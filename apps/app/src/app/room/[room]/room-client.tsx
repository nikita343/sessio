"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/browser";
import { Logo } from "@/components/logo";

type Role = "therapist" | "client";
type Signal =
  | { type: "hello"; from: string; role: Role }
  | { type: "description"; from: string; role: Role; description: RTCSessionDescriptionInit }
  | { type: "candidate"; from: string; role: Role; candidate: RTCIceCandidateInit }
  | { type: "bye"; from: string; role: Role };
type ChatMsg = { id: string; mine: boolean; text: string; at: number };

type Outgoing = Signal extends infer S ? (S extends Signal ? Omit<S, "from" | "role"> : never) : never;

const STUN: RTCIceServer[] = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }];

export function RoomClient(p: { topic: string; role: Role; me: string; other: string; startsAt: string; endsAt: string; iceExtra: RTCIceServer[] }) {
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
  const peer = useRef<string | null>(null); // the one other participant this call is locked to
  const dc = useRef<RTCDataChannel | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [unread, setUnread] = useState(0);
  const [draft, setDraft] = useState("");
  const [chatReady, setChatReady] = useState(false);
  const [route, setRoute] = useState<"direct" | "relay" | null>(null);
  const chatOpenRef = useRef(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const polite = p.role === "client";

  function toggleChat() {
    const next = !chatOpenRef.current;
    chatOpenRef.current = next;
    setChatOpen(next);
    if (next) setUnread(0);
  }
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ block: "end" });
  }, [chat, chatOpen]);

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
    chan.current?.send({ type: "broadcast", event: "signal", payload: { ...msg, from: id.current, role: p.role } });
  }, [p.role]);

  const newPeer = useCallback(() => {
    pc.current?.close();
    const conn = new RTCPeerConnection({ iceServers: [...STUN, ...p.iceExtra] });
    stream.current?.getTracks().forEach((t) => conn.addTrack(t, stream.current!));
    // Private in-call chat: a data channel inside the same encrypted peer connection.
    // It never touches a server and nothing is stored; it is gone when the call ends.
    const ch = conn.createDataChannel("chat", { negotiated: true, id: 0, ordered: true });
    ch.onopen = () => setChatReady(true);
    ch.onclose = () => setChatReady(false);
    ch.onmessage = (e) => {
      try {
        const m = JSON.parse(String(e.data)) as { id: string; text: string };
        if (typeof m.text !== "string") return;
        setChat((c) => [...c, { id: m.id, mine: false, text: m.text.slice(0, 2000), at: Date.now() }]);
        if (!chatOpenRef.current) setUnread((u) => u + 1);
      } catch {
        /* ignore anything that isn't a chat message */
      }
    };
    dc.current = ch;
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
      if (s === "connected") {
        setStatus("Connected · encrypted");
        conn
          .getStats()
          .then((stats) => {
            let localId = "";
            stats.forEach((r) => {
              if (r.type === "transport" && r.selectedCandidatePairId) localId = stats.get(r.selectedCandidatePairId)?.localCandidateId ?? "";
            });
            const local = localId ? stats.get(localId) : null;
            setRoute(local?.candidateType === "relay" ? "relay" : "direct");
          })
          .catch(() => {});
      }
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
    const channel = sb.channel(`r-${p.topic}`, { config: { broadcast: { self: false } } });
    channel.on("broadcast", { event: "signal" }, async ({ payload }: { payload: Signal }) => {
      if (payload.from === id.current) return;
      // A call is exactly one therapist and one client: ignore anyone with my role, and once
      // paired, ignore everyone but that peer until they leave.
      if (payload.role === p.role) return;
      if (peer.current && payload.from !== peer.current) return;
      if (payload.type === "hello") {
        peer.current = payload.from;
        newPeer();
        return;
      }
      if (payload.type === "bye") {
        peer.current = null;
        setRemoteOn(false);
        setRoute(null);
        setStatus(p.other.split(" ")[0] + " left the room");
        return;
      }
      if (!peer.current) peer.current = payload.from;
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

  function sendChat() {
    const text = draft.trim();
    if (!text || dc.current?.readyState !== "open") return;
    const m = { id: Math.random().toString(36).slice(2), text: text.slice(0, 2000) };
    dc.current.send(JSON.stringify(m));
    setChat((c) => [...c, { ...m, mine: true, at: Date.now() }]);
    setDraft("");
  }

  function leave() {
    send({ type: "bye" });
    setChat([]);
    dc.current?.close();
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
        <p className="t-body-s max-w-sm text-stone">Nothing was recorded, and the chat is gone. {p.role === "therapist" ? "You can dictate your note now." : "Take care."}</p>
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
              <span>The chat inside the call is private too: it goes directly between you and is not saved.</span>
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
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 px-5">
        <Logo size={22} tone="inverse" />
        <p className="t-caption flex items-center gap-2 text-white/60">
          <span aria-hidden>🔒</span>
          <span>
            {status}
            {route && ` · ${route === "direct" ? "direct" : "relayed"}`} · {mmss}
          </span>
        </p>
      </div>
      <div className="relative flex min-h-0 flex-1 gap-3 px-3 pb-3">
        <div className="relative min-w-0 flex-1">
          <video ref={remoteRef} autoPlay playsInline className={`size-full rounded-[20px] bg-black object-cover ${remoteOn ? "" : "hidden"}`} />
          {!remoteOn && (
            <div className="flex size-full flex-col items-center justify-center gap-3 rounded-[20px] bg-white/5 text-center">
              <p className="t-heading-s">{status}</p>
              <p className="t-body-s max-w-sm text-white/60">Keep this page open. The call starts as soon as {firstOther} joins.</p>
            </div>
          )}
          <video ref={localRef} autoPlay playsInline muted className={`absolute bottom-3 right-3 aspect-video w-[22%] min-w-[120px] scale-x-[-1] rounded-[14px] bg-black object-cover shadow-lg ${cam ? "" : "opacity-0"}`} />
        </div>
        {chatOpen && (
          <aside aria-label="Private chat" className="absolute inset-x-3 bottom-3 top-0 z-10 flex flex-col overflow-hidden rounded-[20px] bg-[#1b222b] md:static md:w-[340px] md:shrink-0">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="t-label-m">Private chat</p>
                <p className="t-caption text-white/50">Direct and encrypted · not saved</p>
              </div>
              <button onClick={toggleChat} aria-label="Close chat" className="flex size-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10">
                ✕
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
              {chat.length === 0 && (
                <p className="t-caption m-auto max-w-[220px] text-center text-white/45">
                  Messages go straight to {firstOther}&rsquo;s browser. They aren&rsquo;t stored anywhere and disappear when the call ends.
                </p>
              )}
              {chat.map((m) => (
                <div key={m.id} className={`max-w-[85%] rounded-2xl px-3.5 py-2 ${m.mine ? "self-end rounded-br-md bg-sage" : "self-start rounded-bl-md bg-white/10"}`}>
                  <p className="t-body-s whitespace-pre-line break-words">{m.text}</p>
                </div>
              ))}
              <div ref={chatEnd} />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendChat();
              }}
              className="flex gap-2 border-t border-white/10 p-3"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={2000}
                disabled={!chatReady}
                placeholder={chatReady ? `Message ${firstOther}` : `Chat opens when ${firstOther} joins`}
                className="t-body-s min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2.5 text-white outline-none placeholder:text-white/40 focus:bg-white/15 disabled:opacity-60"
              />
              <button disabled={!chatReady || !draft.trim()} className="t-label-m rounded-full bg-sage px-4 text-white disabled:opacity-40">
                Send
              </button>
            </form>
          </aside>
        )}
      </div>
      <div className="flex shrink-0 items-center justify-center gap-3 pb-5">
        <Ctl on={mic} onClick={() => toggle("audio")} label={mic ? "Mute" : "Unmute"} icon="mic" />
        <Ctl on={cam} onClick={() => toggle("video")} label={cam ? "Camera off" : "Camera on"} icon="cam" />
        <button
          onClick={toggleChat}
          aria-label={chatOpen ? "Hide chat" : "Open private chat"}
          title="Private chat"
          className={`relative flex size-12 items-center justify-center rounded-full ${chatOpen ? "bg-white text-ink" : "bg-white/15 text-white backdrop-blur"}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="currentColor" />
          </svg>
          {unread > 0 && !chatOpen && <span className="t-caption absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-warn text-[11px] text-white">{unread}</span>}
        </button>
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
