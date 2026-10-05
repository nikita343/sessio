/* Phone screens for the "one client, one week" story. Designed at 344×758 (the
   phone screen in /story/hand.webp) and scaled by the parent. Pure markup. */

export const SCREEN_W = 344;
export const SCREEN_H = 758;

function StatusBar({ time, dark = false }: { time: string; dark?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-6 pt-4 text-[13px] font-semibold ${dark ? "text-white" : "text-ink"}`}>
      <span>{time}</span>
      <span className="flex items-center gap-1.5" aria-hidden>
        <span className="flex items-end gap-[2px]">
          {[5, 7, 9, 11].map((h) => (
            <span key={h} className={`w-[3px] rounded-sm ${dark ? "bg-white" : "bg-ink"}`} style={{ height: h }} />
          ))}
        </span>
        <span className={`h-[11px] w-[22px] rounded-[3px] border ${dark ? "border-white/70" : "border-ink/60"} p-[1.5px]`}>
          <span className={`block h-full w-[70%] rounded-[1px] ${dark ? "bg-white" : "bg-ink"}`} />
        </span>
      </span>
    </div>
  );
}

function Avatar({ size = 40, text = "AK" }: { size?: number; text?: string }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-clay-soft font-display font-medium text-clay"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {text}
    </span>
  );
}

export function ScreenLock() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(160deg,#dcd6f1_0%,#eef0ea_45%,#cfe0d6_100%)]">
      <StatusBar time="21:38" />
      <div className="mt-14 text-center text-ink">
        <p className="text-[15px] font-medium text-ink/70">Sunday, 4 October</p>
        <p className="font-display text-[84px] font-semibold leading-none tracking-[-0.04em]">21:38</p>
      </div>
      <div className="absolute inset-x-3 top-[300px] rounded-[22px] bg-white/80 p-4 shadow-[0_10px_30px_-12px_rgb(28_37_48/0.25)] backdrop-blur" data-pop>
        <div className="flex items-center justify-between text-[12px] text-stone">
          <span className="font-semibold uppercase tracking-wide">Messages</span>
          <span>now</span>
        </div>
        <p className="mt-1.5 text-[15px] font-semibold text-ink">Ola</p>
        <p className="text-[14px] leading-snug text-ink/85">
          This is the psychologist I told you about. She has evenings and you can book online 🌿
        </p>
        <p className="mt-2 truncate rounded-xl bg-paper px-3 py-2 text-[13px] text-sage">usesessio.com/anna-kowalska</p>
      </div>
    </div>
  );
}

export function ScreenBooking() {
  const days = [
    ["Mon", "5"],
    ["Tue", "6"],
    ["Wed", "7"],
    ["Thu", "8"],
  ];
  const slots = ["09:00", "10:00", "11:00", "13:30", "15:00", "17:30"];
  return (
    <div className="flex h-full w-full flex-col bg-paper">
      <StatusBar time="21:40" />
      <div className="flex flex-col gap-3 px-5 pt-6">
        <div className="flex items-center gap-3">
          <Avatar size={46} />
          <div>
            <p className="font-display text-[20px] font-medium leading-tight tracking-[-0.03em] text-ink">Anna Kowalska</p>
            <p className="text-[12px] text-stone">Psychologist · CBT · Warsaw &amp; online</p>
          </div>
        </div>
        <p className="text-[13px] leading-snug text-ink/80">
          I work with anxiety, burnout and life transitions. Sessions are 50 minutes, in Polish, Ukrainian or English.
        </p>
        <p className="font-display text-[22px] font-medium tracking-[-0.03em] text-ink">
          200 zł <span className="text-[12px] font-normal text-stone">per session</span>
        </p>
      </div>
      <div className="mx-3 mt-4 flex-1 rounded-t-[22px] bg-white p-4 shadow-[0_-6px_24px_-16px_rgb(28_37_48/0.25)]">
        <p className="text-[11px] font-medium uppercase tracking-wider text-stone">Choose a time</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {days.map(([d, n], i) => (
            <div key={d} className={`flex flex-col items-center rounded-xl py-1.5 ${i === 1 ? "bg-ink text-white" : "bg-paper text-ink"}`}>
              <span className="text-[11px] opacity-70">{d}</span>
              <span className="text-[17px] font-semibold">{n}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {slots.map((s) => (
            <div
              key={s}
              data-pop={s === "11:00" ? "" : undefined}
              className={`rounded-xl border py-2 text-center text-[13px] ${s === "11:00" ? "border-sage bg-sage-soft font-semibold text-sage" : "border-line text-ink"}`}
            >
              {s}
            </div>
          ))}
        </div>
        <div data-pop className="mt-4 flex h-11 items-center justify-center rounded-full bg-sage text-[14px] font-medium text-white">
          Book Tue 6 Oct · 11:00
        </div>
        <p className="mt-2 text-center text-[11px] text-stone">BLIK, card or Przelewy24 · free cancellation until 24 h before</p>
      </div>
    </div>
  );
}

export function ScreenBlik() {
  const code = ["4", "8", "2", "9", "1", "3"];
  return (
    <div className="flex h-full w-full flex-col bg-paper">
      <StatusBar time="21:42" />
      <div className="flex flex-col gap-1 px-5 pt-8">
        <p className="text-[12px] font-medium uppercase tracking-wider text-stone">Prepayment</p>
        <p className="font-display text-[34px] font-medium leading-tight tracking-[-0.04em] text-ink">200 zł</p>
        <p className="text-[13px] text-stone">Session with Anna Kowalska · Tue 6 Oct, 11:00</p>
      </div>
      <div className="mx-3 mt-5 rounded-[22px] bg-white p-4">
        <div className="flex gap-2">
          {["BLIK", "Card", "P24"].map((m, i) => (
            <span key={m} className={`flex-1 rounded-xl py-2 text-center text-[13px] font-medium ${i === 0 ? "bg-ink text-white" : "bg-paper text-ink/70"}`}>
              {m}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-stone">6-digit code from your banking app</p>
        <div className="mt-2 grid grid-cols-6 gap-1.5">
          {code.map((c, i) => (
            <span key={i} data-pop className="flex h-11 items-center justify-center rounded-lg border border-line-strong font-display text-[20px] font-semibold text-ink">
              {c}
            </span>
          ))}
        </div>
      </div>
      <div data-pop className="mx-3 mt-4 flex flex-col items-center gap-2 rounded-[22px] bg-sage-soft p-5 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-sage text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="font-display text-[18px] font-medium text-sage">Paid. See you Tuesday.</p>
        <p className="text-[12px] text-sage/80">200 zł went to Anna&rsquo;s own account. Sessio fee: 0 zł.</p>
      </div>
    </div>
  );
}

export function ScreenEmail() {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      <StatusBar time="11:00" />
      <div className="flex items-center justify-between px-5 pt-5 text-[13px]">
        <span className="text-[#3d6a80]">‹ Inbox</span>
        <span className="text-stone">1 of 12</span>
      </div>
      <div className="px-5 pt-4">
        <p className="font-display text-[19px] font-medium leading-snug tracking-[-0.02em] text-ink">Tomorrow at 11:00 with Anna Kowalska</p>
        <div className="mt-3 flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-sage text-[13px] font-semibold text-white">S</span>
          <div className="text-[12px] leading-tight">
            <p className="font-semibold text-ink">Sessio</p>
            <p className="text-stone">to Marta · Mon 5 Oct</p>
          </div>
        </div>
      </div>
      <div className="mx-4 mt-4 flex flex-col gap-3 rounded-[20px] bg-paper p-4 text-[13px] leading-snug text-ink/85">
        <p>Hi Marta,</p>
        <p>a reminder of your session with Anna Kowalska tomorrow, Tuesday 6 October, 11:00–11:50.</p>
        <div data-pop className="rounded-2xl bg-white p-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-stone">Private video room</p>
          <p className="mt-1 text-[13px] text-ink">Opens 10 minutes before. No app, no account.</p>
          <span className="mt-3 flex h-10 items-center justify-center rounded-full bg-ink text-[13px] font-medium text-white">Join the session</span>
        </div>
        <p className="text-[12px] text-stone">Need to move it? Free until today 11:00, from your booking link.</p>
      </div>
    </div>
  );
}

export function ScreenVideo() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#141a21]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/photos/session.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[38%_50%]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60" />
      <div className="relative">
        <StatusBar time="11:04" dark />
      </div>
      <div data-pop className="absolute left-4 top-14 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
        <span className="size-1.5 rounded-full bg-[#7fd1a8]" /> Peer-to-peer · not recorded
      </div>
      <div className="absolute right-4 top-24 h-[132px] w-[96px] overflow-hidden rounded-2xl border border-white/30 bg-[linear-gradient(160deg,#c9b8a8,#8e7d70)]">
        <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white">You</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 pb-10">
        <p className="text-[13px] text-white/90">Anna Kowalska · 04:12</p>
        <div className="flex gap-4">
          {["M", "V"].map((k) => (
            <span key={k} className="flex size-12 items-center justify-center rounded-full bg-white/20 text-[13px] font-semibold text-white backdrop-blur">
              {k === "M" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="3" y="6" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 10l5-3v10l-5-3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          ))}
          <span className="flex size-12 items-center justify-center rounded-full bg-[#c4553f] text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 14c5-5 13-5 18 0l-2.5 2.5-3.5-2v-2.5a10 10 0 0 0-6 0V14l-3.5 2z" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

const BARS = [8, 14, 10, 18, 12, 20, 9, 16, 11, 19, 7, 13, 17, 10, 15, 8, 12, 18, 9, 14, 11, 16, 13, 9];

export function ScreenMemo() {
  return (
    <div className="flex h-full w-full flex-col bg-paper">
      <StatusBar time="11:52" />
      <div className="flex items-center justify-between px-5 pt-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-stone">Session 12 · Marta N.</p>
          <p className="font-display text-[20px] font-medium tracking-[-0.03em] text-ink">After-session memo</p>
        </div>
        <Avatar size={34} text="MN" />
      </div>
      <div className="mx-4 mt-4 flex flex-col gap-3 rounded-[20px] bg-white p-4">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sage-soft px-2.5 py-1 text-[11px] text-sage">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="2" />
          </svg>
          Transcribed on this phone
        </span>
        <div className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-white">
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <path d="M2 1l7 4-7 4z" fill="currentColor" />
            </svg>
          </span>
          <span className="flex flex-1 items-center gap-[3px]" aria-hidden data-wave>
            {BARS.map((h, i) => (
              <span key={i} className="w-[3px] rounded-full bg-ink" style={{ height: h }} />
            ))}
          </span>
          <span className="text-[11px] text-stone">2:06</span>
        </div>
      </div>
      <div data-pop className="mx-4 mt-3 flex flex-col gap-2 rounded-[20px] border border-line bg-white p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-stone">Draft record · for your review</p>
        <p className="text-[13px] leading-snug text-ink">
          Continued thought records for work situations. Fewer Sunday-evening episodes (2 vs 4). Agreed homework: one
          behavioural experiment before session 13.
        </p>
        <p className="rounded-lg bg-paper px-2.5 py-1.5 text-[11px] text-stone">Working notes kept separate from the formal record</p>
      </div>
      <div data-pop className="mx-4 mt-auto mb-8 flex h-11 items-center justify-center rounded-full bg-sage text-[14px] font-medium text-white">
        Approve &amp; sign
      </div>
    </div>
  );
}
