"use client";

import { useEffect, useRef } from "react";

/**
 * Living ink: draws a splash texture through a slow domain-warp so it flows like
 * wet ink, multiplied onto the section's base colour inside the shader (no CSS
 * blend modes, so the browser never has to repaint the page behind it).
 * Renders at reduced resolution, pauses off-screen and in background tabs,
 * and leaves the static image in place when WebGL or motion is unavailable.
 */

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main(){ vUv = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;      // canvas px
uniform vec2 uImg;      // image px
uniform float uTime;
uniform vec3 uBase;     // section colour (0..1)
uniform float uMix;     // splash strength
uniform float uAmp;     // flow amount
uniform vec2 uMouse;    // 0..1, y down
uniform float uPush;    // pointer strength

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<3;i++){ v+=a*noise(p); p*=2.03; a*=.5; } return v; }

void main(){
  // object-fit: cover
  vec2 uv = vec2(vUv.x, 1.-vUv.y);
  float rc = uRes.x/uRes.y, ri = uImg.x/uImg.y;
  vec2 s = rc > ri ? vec2(1., ri/rc) : vec2(rc/ri, 1.);
  vec2 cuv = (uv-.5)*s + .5;

  float t = uTime*.055;
  // gentle breathing zoom so edges never show
  cuv = (cuv-.5)*(0.94 + 0.012*sin(t*3.1)) + .5 + vec2(sin(t*1.7), cos(t*1.3))*0.006;

  vec2 q = vec2(fbm(cuv*2.2 + vec2(t, -t*.7)), fbm(cuv*2.2 + vec2(5.2 - t*.8, 1.3 + t)));
  vec2 r = vec2(fbm(cuv*3.1 + q*1.6 + vec2(1.7, 9.2) + t*.6), fbm(cuv*3.1 + q*1.6 + vec2(8.3, 2.8) - t*.5));
  vec2 off = (r - .5) * .075 * uAmp;

  // pointer swirl
  vec2 d = uv - uMouse; d.x *= rc;
  float f = exp(-dot(d,d)*18.) * uPush;
  off += vec2(-d.y, d.x) * f * .09 + d * f * .03;

  vec3 ink = texture2D(uTex, clamp(cuv + off, .001, .999)).rgb;
  vec3 col = uBase * mix(vec3(1.), ink, uMix);
  gl_FragColor = vec4(col, 1.);
}`;

function hex(c: string): [number, number, number] {
  const n = parseInt(c.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function InkCanvas({
  src,
  base = "#f4f3ef",
  strength = 1,
  amount = 1,
  interactive = false,
}: {
  src: string;
  base?: string;
  strength?: number;
  amount?: number;
  interactive?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power", premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, code: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, code);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("uRes"), uImg = U("uImg"), uTime = U("uTime"), uBase = U("uBase"), uMix = U("uMix"), uAmp = U("uAmp"), uMouse = U("uMouse"), uPush = U("uPush");
    gl.uniform3fv(uBase, hex(base));
    gl.uniform1f(uMix, strength);
    gl.uniform1f(uAmp, amount);
    gl.uniform2f(uMouse, -2, -2);
    gl.uniform1f(uPush, 0);

    let disposed = false;
    let ready = false;
    let visible = false;
    let raf = 0;
    let hideTimer = 0;
    const t0 = performance.now() - Math.random() * 60000; // each splash starts at a different moment
    const mouse = { x: -2, y: -2, tx: -2, ty: -2, push: 0, target: 0 };

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.42; // ink is soft: low-res is invisible to the eye
      const w = Math.max(2, Math.round(canvas.clientWidth * scale));
      const h = Math.max(2, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };

    let lastDraw = 0;
    const frame = (now: number) => {
      raf = 0;
      if (disposed || !ready || !visible || document.hidden) return;
      // ink drifts slowly: 30 fps is indistinguishable and halves the work
      if (now - lastDraw < 32) {
        raf = requestAnimationFrame(frame);
        return;
      }
      lastDraw = now;
      resize();
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      mouse.push += (mouse.target - mouse.push) * 0.04;
      mouse.target *= 0.985;
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uPush, mouse.push);
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (disposed) return;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.uniform2f(uImg, img.naturalWidth, img.naturalHeight);
      ready = true;
      resize();
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      canvas.style.opacity = "1";
      // once the live ink has faded in, stop compositing the static fallback underneath
      hideTimer = window.setTimeout(() => {
        const fallback = canvas.previousElementSibling as HTMLElement | null;
        if (fallback) fallback.style.visibility = "hidden";
      }, 1100);
      kick();
    };
    img.src = src;

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) kick();
      },
      { rootMargin: "100px" },
    );
    io.observe(canvas);
    const onVis = () => !document.hidden && kick();
    document.addEventListener("visibilitychange", onVis);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      if (x < -0.1 || x > 1.1 || y < -0.1 || y > 1.1) return;
      if (mouse.tx < -1) {
        mouse.x = x;
        mouse.y = y;
      }
      mouse.tx = x;
      mouse.ty = y;
      mouse.target = Math.min(1, mouse.target + 0.12);
    };
    if (interactive) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer);
      const fallback = canvas.previousElementSibling as HTMLElement | null;
      if (fallback) fallback.style.visibility = "";
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src, base, strength, amount, interactive]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000" />;
}
