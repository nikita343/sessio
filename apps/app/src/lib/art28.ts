/**
 * Art. 28 of the Polish Psychologist Act (Dz.U. 2026 poz. 187): minimum content of psychological
 * documentation — the client's identity (name, date of birth, address, PESEL or an identity-document
 * number), legal representatives of minors, the psychologist's name and Register number, the practice
 * name and address, a description of the service, the date and a signature.
 */

export type Identity = {
  full_name: string;
  birth_date: string | null;
  pesel: string | null;
  id_document: string | null;
  address: string | null;
  guardian_name: string | null;
  guardian_contact: string | null;
};

/** Valid PESEL: 11 digits with a correct check digit. */
export function validPesel(p: string) {
  if (!/^\d{11}$/.test(p)) return false;
  const w = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const sum = w.reduce((s, x, i) => s + x * Number(p[i]), 0);
  return (10 - (sum % 10)) % 10 === Number(p[10]);
}

/** Date of birth encoded in a PESEL (YYYY-MM-DD), or null. */
export function birthFromPesel(p: string): string | null {
  if (!validPesel(p)) return null;
  const yy = Number(p.slice(0, 2));
  let mm = Number(p.slice(2, 4));
  const dd = Number(p.slice(4, 6));
  let century = 1900;
  if (mm > 80) {
    century = 1800;
    mm -= 80;
  } else if (mm > 60) {
    century = 2200;
    mm -= 60;
  } else if (mm > 40) {
    century = 2100;
    mm -= 40;
  } else if (mm > 20) {
    century = 2000;
    mm -= 20;
  }
  return `${century + yy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

export function ageOn(birth: string | null, at = new Date()) {
  if (!birth) return null;
  const b = new Date(birth + "T00:00:00Z");
  let age = at.getUTCFullYear() - b.getUTCFullYear();
  const m = at.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && at.getUTCDate() < b.getUTCDate())) age--;
  return age;
}

export type Missing = "birth_date" | "identifier" | "address" | "guardian" | "register" | "practice_address";

/** What Art. 28 still needs for this client and practice. */
export function missingArt28(c: Identity, practice: { register_number?: string | null; address?: string | null; online_only?: boolean }): Missing[] {
  const out: Missing[] = [];
  if (!c.birth_date) out.push("birth_date");
  if (!c.pesel && !c.id_document) out.push("identifier");
  if (!c.address) out.push("address");
  const age = ageOn(c.birth_date);
  if (age !== null && age < 18 && !c.guardian_name) out.push("guardian");
  if (!practice.register_number) out.push("register");
  if (!practice.address && !practice.online_only) out.push("practice_address");
  return out;
}

export const maskPesel = (p: string | null) => (p ? `•••••••${p.slice(-4)}` : null);
