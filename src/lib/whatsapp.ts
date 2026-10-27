export function whatsappUrl(value?: string, message?: string): string | null {
  if (!value?.trim()) return null;
  let raw = value.trim();
  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      if (url.hostname !== "wa.me" || url.username || url.password || url.port)
        return null;
      raw = url.pathname.slice(1);
    } catch {
      return null;
    }
  }
  if (!/^[+\d\s()-]+$/.test(raw)) return null;
  let number = raw.replace(/\D/g, "");
  if (number.startsWith("00")) number = number.slice(2);
  if (/^0\d{9}$/.test(number)) number = `94${number.slice(1)}`;
  return /^[1-9]\d{6,14}$/.test(number)
    ? `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`
    : null;
}

export const WHATSAPP_ENQUIRY =
  "Hi, I found your business on Nakathata.lk. I'd like to ask about your services.";
export function whatsappEnquiryUrl(value?: string): string | null {
  return whatsappUrl(value, WHATSAPP_ENQUIRY);
}
