"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/browser";
import { Logo } from "@/components/logo";

type Signal = { type: "hello"; from: string } | { type: "description"; from: string; description: RTCSessionDescriptionInit } | { type: "candidate"; from: string; candidate: RTCIceCandidateInit } | { type: "bye"; from: string };

type Outgoing = Signal extends infer S ? (S extends Signal ? Omit<S, "from"> : never) : never;

const STUN: RTCIceServer[] = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }];

export function RoomClient(p: { room: string; role: "therapist" | "client"; me: string; other: string; startsAt: string; endsAt: string; iceExtra: RTCIceServer[] }) {
  const [stage, setStage] = useState<"lobby" | "call" | "left">("lobby");
  const [status, setStatus] = useState("Waiting for " + p.other.split(" ")[0] + "…");
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [err, setErr] = useState("");
  const [remoteOn, setRemoteOn] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const chan = useRef<RealtimeChannel | null>(null);
  const makingOffer = useRef(false);
  const ignoreOffer = useRef(false);
  const id = useRef(Math.random().toString(36).slice(2));
  const polite = p.role === "client";

  // camera preview
  useEffect(() => {
    let alive = true;
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 }, audio: { echoCancellation: true, noiseSuppression: true } })
      .then((s) => {
        if (!alive) return s.getTracks().forEach((t) => t.stop());
        stream.current = s;
        if (localRef.current) localRef.current.srcObject = s;
      })
      .catch(() => setErr("Camera or microphone is blocked. Allow access in your browser and reload."));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (stage !== "call") return;
    const i = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(i);
  }, [stage]);

  const send = useCallback((msg: Outgoing) => {
    chan.current?.send({ type: "broadcast", event: "signal", payload: { ...msg, from: id.current } });
  }, []);

  const newPeer = useCallback(() => {
    pc.current?.close();
    const conn = new RTCPeerConnection({ iceServers: [...STUN, ...p.iceExtra] });
    stream.current?.getTracks().forEach((t) => conn.addTrack(t, stream.current!));
    conn.onicecandidate = ({ candidate }) => candidate && send({ type: "candidate", candidate: candidate.toJSON() });
    conn.ontrack = ({ streams }) => {
      if (remoteRef.current && streams[0]) remoteRef.current.srcObject = streams[0];
      setRemoteOn(true);
    };
    conn.onnegotiationneeded = async () => {
      try {
        makingOffer.current = true;
        await conn.setLocalDescription();
        send({ type: "description", description: conn.localDescription!.toJSON() });
      } finally {
        makingOffer.current = false;
      }
    };
    conn.onconnectionstatechange = () => {
      const s = conn.connectionState;
      if (s === "connected") setStatus("Connected · peer-to-peer, encrypted");
      if (s === "connecting") setStatus("Connecting…");
      if (s === "disconnected" || s === "failed") {
        setStatus(p.other.split(" ")[0] + " lost connection…");
        setRemoteOn(false);
        if (s === "failed") conn.restartIce();
      }
    };
    pc.current = conn;
    return conn;
  }, [p.iceExtra, p.other, send]);

  async function join() {
    const sb = createClient();
    const channel = sb.channel(`room-${p.room}`, { config: { broadcast: { self: false } } });
    channel.on("broadcast", { event: "signal" }, async ({ payload }: { payload: Signal }) => {
      if (payload.from === id.current) return;
      if (payload.type === "hello") {
        newPeer();
        return;
      }
      if (payload.type === "bye") {
        setRemoteOn(false);
        setStatus(p.other.split(" ")[0] + " left the room");
        return;
      }
      const conn = pc.current ?? newPeer();
      try {
        if (payload.type === "description") {
          const d = payload.description;
          const collision = d.type === "offer" && (makingOffer.current || conn.signalingState !== "stable");
          ignoreOffer.current = !polite && collision;
          if (ignoreOffer.current) return;
          await conn.setRemoteDescription(d);
          if (d.type === "offer") {
            await conn.setLocalDescription();
            send({ type: "description", description: conn.localDescription!.toJSON() });
          }
        } else if (payload.type === "candidate") {
          try {
            await conn.addIceCandidate(payload.candidate);
          } catch (e) {
            if (!ignoreOffer.current) throw e;
          }
        }
      } catch (e) {
        console.error(e);
      }
    });
    channel.subscribe((s) => {
      if (s === "SUBSCRIBED") {
        newPeer();
        send({ type: "hello" });
      }
    });
    chan.current = channel;
    setStage("call");
  }

  function leave() {
    send({ type: "bye" });
    pc.current?.close();
    chan.current?.unsubscribe();
    stream.current?.getTracks().forEach((t) => t.stop());
    setStage("left");
  }

  function toggle(kind: "audio" | "video") {
    const tracks = kind === "audio" ? stream.current?.getAudioTracks() : stream.current?.getVideoTracks();
    tracks?.forEach((t) => (t.enabled = !t.enabled));
    if (kind === "audio") setMic((m) => !m);
    else setCam((c) => !c);
  }

  useEffect(() => {
    if (stage === "call" && localRef.current && stream.current) localRef.current.srcObject = stream.current;
  }, [stage]);

  const mmss = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;
  const firstOther = p.other.split(" ")[0];

  if (stage === "left")
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-paper px-5 text-center">
        <Logo size={26} />
        <h1 className="t-heading-s">You left the session</h1>
        <p className="t-body-s max-w-sm text-stone">Nothing was recorded. {p.role === "therapist" ? "You can dictate your note now." : "Take care."}</p>
        <div className="flex gap-2">
          <button onClick={() => location.reload()} className="t-label-m h-10 rounded-full border border-line-strong px-5">
            Rejoin
          </button>
          {p.role === "therapist" && (
            <a href="/dashboard" className="t-label-m flex h-10 items-center rounded-full bg-sage px-5 text-white">
              Back to today
            </a>
          )}
        </div>
      </main>
    );

  if (stage === "lobby")
    return (
      <main className="flex min-h-dvh flex-col bg-paper">
        <header className="flex h-16 items-center px-6">
          <Logo size={24} />
        </header>
        <div className="mx-auto grid w-full max-w-[1000px] flex-1 items-center gap-8 px-5 pb-16 md:grid-cols-[1.3fr_1fr]">
          <div className="relative aspect-video overflow-hidden rounded-[24px] bg-ink">
            <video ref={localRef} autoPlay playsInline muted className={`size-full scale-x-[-1] object-cover ${cam ? "" : "invisible"}`} />
            {err && <p className="t-body-s absolute inset-0 flex items-center justify-center p-6 text-center text-white/80">{err}</p>}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              <Ctl on={mic} onClick={() => toggle("audio")} label={mic ? "Mute" : "Unmute"} icon="mic" />
              <Ctl on={cam} onClick={() => toggle("video")} label={cam ? "Camera off" : "Camera on"} icon="cam" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="t-overline text-stone">{p.role === "therapist" ? "Your session with" : "Your session with"}</p>
            <h1 className="t-heading-m">{p.other}</h1>
            <p className="t-body-s text-stone">
              {new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Warsaw", weekday: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(p.startsAt))} –{" "}
              {new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit" }).format(new Date(p.endsAt))}
            </p>
            <div className="t-caption flex flex-col gap-1.5 rounded-[14px] bg-sage-soft p-4 text-sage">
              <span>🔒 Video goes directly between you and {firstOther}, encrypted.</span>
              <span>Nothing is recorded. Sessio&rsquo;s servers never see or hear the session.</span>
            </div>
            <button onClick={join} disabled={Boolean(err)} className="t-label-m h-12 rounded-full bg-sage text-white hover:bg-sage-hover disabled:opacity-50">
              Join now
            </button>
          </div>
        </div>
      </main>
    );

  return (
    <main className="fixed inset-0 flex flex-col bg-[#11161d] text-white">
      <div className="flex h-14 shrink-0 items-center justify-between px-5">
        <Logo size={22} tone="inverse" />
        <p className="t-caption text-white/60">
          {status} · {mmss}
        </p>
      </div>
      <div className="relative min-h-0 flex-1 px-3 pb-3">
        <video ref={remoteRef} autoPlay playsInline className={`size-full rounded-[20px] bg-black object-cover ${remoteOn ? "" : "hidden"}`} />
        {!remoteOn && (
          <div className="flex size-full flex-col items-center justify-center gap-3 rounded-[20px] bg-white/5 text-center">
            <p className="t-heading-s">{status}</p>
            <p className="t-body-s max-w-sm text-white/60">Keep this page open. The call starts as soon as {firstOther} joins.</p>
          </div>
        )}
        <video ref={localRef} autoPlay playsInline muted className={`absolute bottom-6 right-6 aspect-video w-[22%] min-w-[140px] scale-x-[-1] rounded-[14px] bg-black object-cover shadow-lg ${cam ? "" : "opacity-0"}`} />
      </div>
      <div className="flex shrink-0 items-center justify-center gap-3 pb-5">
        <Ctl on={mic} onClick={() => toggle("audio")} label={mic ? "Mute" : "Unmute"} icon="mic" />
        <Ctl on={cam} onClick={() => toggle("video")} label={cam ? "Camera off" : "Camera on"} icon="cam" />
        <button onClick={leave} className="t-label-m h-12 rounded-full bg-warn px-6 text-white">
          Leave
        </button>
      </div>
    </main>
  );
}

function Ctl({ on, onClick, label, icon }: { on: boolean; onClick: () => void; label: string; icon: "mic" | "cam" }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className={`flex size-12 items-center justify-center rounded-full ${on ? "bg-white/15 text-white backdrop-blur" : "bg-white text-ink"}`}>
      {icon === "mic" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {!on && <path d="M4 4l16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="13" height="12" rx="2.5" fill="currentColor" />
          <path d="M16 10.5l5-3v9l-5-3z" fill="currentColor" />
          {!on && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
        </svg>
      )}
    </button>
  );
}
