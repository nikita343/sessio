"use client";

import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const HIDDEN = "[data-reveal], [data-split], [data-hero-fade], [data-seq] > *";

/**
 * Site-wide motion. Markup opts in with data attributes:
 *  data-split        headline revealed word by word (on load if above the fold)
 *  data-hero-fade    hero elements fading up after the headline
 *  data-reveal       fade-up when scrolled into view (batched, staggered)
 *  data-seq          children appear one after another (chat bubbles, rows)
 *  data-wave         waveform bars grow in
 *  data-parallax=n   moves at n×100px over its scroll range
 *  data-zoom         scales up to full size as it scrolls in
 *  data-rise=n       rises n px into place while scrolling in
 *  data-wordmark     footer wordmark, letters rise
 */
export function Motion() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(HIDDEN, { autoAlpha: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // headlines
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          const split = SplitText.create(el, { type: "words", mask: "words", wordsClass: "split-word" });
          gsap.set(el, { autoAlpha: 1 });
          const above = el.getBoundingClientRect().top < window.innerHeight;
          gsap.from(split.words, {
            yPercent: 110,
            duration: 1,
            ease: "expo.out",
            stagger: 0.06,
            delay: above ? 0.15 : 0,
            scrollTrigger: above ? undefined : { trigger: el, start: "top 85%", once: true },
          });
        });

        const heroFade = gsap.utils.toArray<HTMLElement>("[data-hero-fade]");
        if (heroFade.length)
          gsap.fromTo(heroFade, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.45 });

        // scroll reveals
        gsap.set("[data-reveal]", { autoAlpha: 0, y: 36 });
        ScrollTrigger.batch("[data-reveal]", {
          start: "top 88%",
          once: true,
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, overwrite: true }),
        });

        // sequences: chat bubbles, booking rows
        gsap.utils.toArray<HTMLElement>("[data-seq]").forEach((el) => {
          gsap.fromTo(
            el.children,
            { autoAlpha: 0, y: 14, scale: 0.98 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              ease: "back.out(1.6)",
              stagger: Number(el.dataset.seq) || 0.32,
              scrollTrigger: { trigger: el, start: "top 78%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-wave]").forEach((el) => {
          gsap.from(el.children, {
            scaleY: 0.15,
            transformOrigin: "50% 50%",
            duration: 0.6,
            ease: "power2.out",
            stagger: { each: 0.03, from: "start" },
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });

        // ambient + scroll-linked
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const n = Number(el.dataset.parallax) || 0.4;
          gsap.fromTo(el, { y: n * 100 }, { y: -n * 100, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });

        gsap.utils.toArray<HTMLElement>("[data-zoom]").forEach((el) => {
          gsap.fromTo(el, { scale: 0.88, borderRadius: "48px" }, { scale: 1, borderRadius: "32px", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: 0.6 } });
        });

        gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
          const n = Number(el.dataset.rise) || 120;
          gsap.fromTo(el, { y: n }, { y: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 30%", scrub: 0.6 } });
        });

        gsap.utils.toArray<HTMLElement>("[data-wordmark]").forEach((el) => {
          const split = SplitText.create(el, { type: "chars" });
          gsap.from(split.chars, {
            yPercent: 60,
            autoAlpha: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: el, start: "top 95%", once: true },
          });
        });
      });

      // images and fonts change layout after first paint
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      return () => {
        window.removeEventListener("load", refresh);
        mm.revert();
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
