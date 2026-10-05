import type { Metadata } from "next";
import { PortalShell } from "@/components/portal-shell";
import { Avatar } from "@/components/ui";
import { portalLang, pt, requireClient, type MyThread } from "@/lib/portal";
import { updateMyIdentity } from "../actions";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = { title: "Moje dane", robots: { index: false } };

type Ident = { birth_date: string | null; pesel_last4: string | null; has_pesel: boolean; id_document: string | null; address: string | null; guardian_name: string | null; guardian_contact: string | null };

const T: Record<Lang, Record<string, string>> = {
  pl: {
    title: "Moje dane",
    lead: "Psycholog ma obowiązek prowadzić dokumentację z Twoimi podstawowymi danymi (ustawa o zawodzie psychologa, art. 28). Możesz je podać tutaj zamiast na sesji. Widzi je tylko Twój terapeuta; dane są przechowywane w UE i nie trafiają do żadnej AI.",
    birth: "Data urodzenia",
    pesel: "PESEL",
    peselSaved: "Zapisany numer kończy się na",
    peselKeep: "Zostaw puste, aby nie zmieniać",
    idDoc: "Nr dokumentu tożsamości (jeśli nie masz numeru PESEL)",
    address: "Adres zamieszkania",
    guardian: "Przedstawiciel ustawowy (jeśli masz mniej niż 18 lat)",
    guardianContact: "Kontakt do przedstawiciela",
    save: "Zapisz",
    saved: "Zapisano. Terapeuta widzi już te dane.",
    errPesel: "Ten numer PESEL jest nieprawidłowy — sprawdź cyfry.",
    errSave: "Nie udało się zapisać. Spróbuj ponownie.",
    none: "Gdy zarezerwujesz sesję, będziesz mógł tu uzupełnić dane dla swojego terapeuty.",
    with: "Dla",
  },
  en: {
    title: "My details",
    lead: "Psychologists must keep records with your basic details (Polish Psychologist Act, Art. 28). You can give them here instead of during a session. Only your therapist sees them; they're stored in the EU and never sent to any AI.",
    birth: "Date of birth",
    pesel: "PESEL",
    peselSaved: "Saved number ends in",
    peselKeep: "Leave empty to keep it",
    idDoc: "ID document number (if you have no PESEL)",
    address: "Home address",
    guardian: "Legal representative (if you're under 18)",
    guardianContact: "Representative's contact",
    save: "Save",
    saved: "Saved. Your therapist can see these details now.",
    errPesel: "That PESEL isn't valid — please check the digits.",
    errSave: "Couldn't save. Please try again.",
    none: "Once you book a session, you can add your details for your therapist here.",
    with: "For",
  },
  uk: {
    title: "Мої дані",
    lead: "Психолог зобов’язаний вести документацію з вашими основними даними (польський закон про професію психолога, ст. 28). Ви можете вказати їх тут, а не на сесії. Їх бачить лише ваш терапевт; дані зберігаються в ЄС і не передаються жодному ШІ.",
    birth: "Дата народження",
    pesel: "PESEL",
    peselSaved: "Збережений номер закінчується на",
    peselKeep: "Залиште порожнім, щоб не змінювати",
    idDoc: "Номер документа (якщо немає PESEL)",
    address: "Адреса проживання",
    guardian: "Законний представник (якщо вам менше 18 років)",
    guardianContact: "Контакт представника",
    save: "Зберегти",
    saved: "Збережено. Терапевт уже бачить ці дані.",
    errPesel: "Цей номер PESEL недійсний — перевірте цифри.",
    errSave: "Не вдалося зберегти. Спробуйте ще раз.",
    none: "Коли ви забронюєте сесію, тут можна буде вказати дані для вашого терапевта.",
    with: "Для",
  },
};

const field = "t-body-m w-full rounded-[14px] border border-line-strong bg-paper px-3.5 py-2.5 outline-none focus:border-sage";

export default async function Details(props: PageProps<"/me/details">) {
  const sp = await props.searchParams;
  const { supabase, profile } = await requireClient("/me/details");
  const lang = await portalLang(sp.lang);
  const d = pt(lang);
  const t = T[lang];
  const { data } = await supabase.rpc("my_threads");
  const threads = (data ?? []) as MyThread[];
  const idents = await Promise.all(
    threads.map(async (th) => {
      const { data: r } = await supabase.rpc("my_identity", { p_slug: th.therapist_slug });
      return ((Array.isArray(r) ? r[0] : r) as Ident) ?? null;
    }),
  );

  return (
    <PortalShell lang={lang} profile={profile} current="details" path="/me/details">
      <div className="flex max-w-[720px] flex-col gap-6 pt-6 md:pt-10">
        <div className="flex flex-col gap-2">
          <h1 className="t-display-l !text-[clamp(32px,4.5vw,44px)]">{t.title}</h1>
          <p className="t-body-m text-stone">{t.lead}</p>
        </div>
        {sp.err && <p className="t-body-s rounded-lg bg-[#f6e3dc] px-3 py-2 text-warn">{sp.err === "pesel" ? t.errPesel : t.errSave}</p>}
        {threads.length === 0 && <p className="t-body-m text-stone">{t.none}</p>}
        {threads.map((th, i) => {
          const id = idents[i];
          return (
            <form key={th.therapist_slug} id={th.therapist_slug} action={updateMyIdentity} className="flex scroll-mt-6 flex-col gap-4 rounded-[24px] border border-line bg-surface p-5 md:p-6">
              <input type="hidden" name="slug" value={th.therapist_slug} />
              <div className="flex items-center gap-3">
                <Avatar name={th.therapist_name} photo={th.therapist_photo} size={36} />
                <p className="t-title-m">
                  <span className="t-caption mr-1.5 text-stone">{t.with}</span>
                  {th.therapist_name}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="t-label-m">{t.birth}</span>
                  <input type="date" name="birth_date" defaultValue={id?.birth_date ?? ""} className={field} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="t-label-m">{t.pesel}</span>
                  <input name="pesel" inputMode="numeric" pattern="\d{11}" maxLength={11} autoComplete="off" placeholder={id?.has_pesel ? `•••••••${id.pesel_last4}` : "00000000000"} className={field} />
                  {id?.has_pesel && (
                    <span className="t-caption text-stone">
                      {t.peselSaved} {id.pesel_last4}. {t.peselKeep}.
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="t-label-m">{t.idDoc}</span>
                  <input name="id_document" maxLength={40} defaultValue={id?.id_document ?? ""} autoComplete="off" className={field} />
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="t-label-m">{t.address}</span>
                  <input name="address" maxLength={200} defaultValue={id?.address ?? ""} autoComplete="street-address" className={field} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="t-label-m">{t.guardian}</span>
                  <input name="guardian_name" maxLength={120} defaultValue={id?.guardian_name ?? ""} className={field} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="t-label-m">{t.guardianContact}</span>
                  <input name="guardian_contact" maxLength={120} defaultValue={id?.guardian_contact ?? ""} className={field} />
                </label>
              </div>
              <div className="flex items-center justify-end gap-3">
                {sp.saved === th.therapist_slug && <span className="t-caption text-sage">{t.saved}</span>}
                <button className="t-label-m h-11 rounded-full bg-sage px-6 text-white hover:bg-sage-hover">{t.save}</button>
              </div>
            </form>
          );
        })}
        <p className="t-caption text-stone">{d.replyNote}</p>
      </div>
    </PortalShell>
  );
}
