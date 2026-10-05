export const INQUIRY_PREFIX = "[NAKATHATA_ENQUIRY_V1]";
export type InquiryRecord = {
  kind: "INQUIRY";
  eventDate: string;
  location: string;
  guestCount: number;
  requirements: string;
  listingName?: string;
};
export type InquiryResponse = {
  kind: "RESPONSE";
  inquiryId: string;
  action: "REPLIED" | "NEEDS_DETAILS" | "DECLINED";
  text: string;
};
export function readInquiryRecord(
  content: string,
): InquiryRecord | InquiryResponse | null {
  if (!content?.startsWith(INQUIRY_PREFIX)) return null;
  try {
    const value = JSON.parse(content.slice(INQUIRY_PREFIX.length));
    if (
      value.kind === "INQUIRY" &&
      typeof value.eventDate === "string" &&
      typeof value.location === "string" &&
      Number.isInteger(value.guestCount) &&
      typeof value.requirements === "string"
    )
      return value;
    if (
      value.kind === "RESPONSE" &&
      typeof value.inquiryId === "string" &&
      ["REPLIED", "NEEDS_DETAILS", "DECLINED"].includes(value.action) &&
      typeof value.text === "string"
    )
      return value;
  } catch {
    /* Keep existing free-text conversations readable. */
  }
  return null;
}
export const inquiryStatusLabel = {
  NEW: "New enquiry",
  REPLIED: "Replied",
  NEEDS_DETAILS: "More details requested",
  DECLINED: "Declined",
};
export function messagePreview(content: string) {
  const record = readInquiryRecord(content);
  return record?.kind === "INQUIRY"
    ? `Event on ${record.eventDate} · ${record.guestCount} guests · ${record.location}`
    : record?.kind === "RESPONSE"
      ? `${inquiryStatusLabel[record.action]}: ${record.text}`
      : content;
}
