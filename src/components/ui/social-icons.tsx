import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export function WhatsAppIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.5 4.1 1.6 5.9L.1 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4H12c6.6 0 12-5.3 12-11.9 0-3.2-1.2-6.2-3.5-8.3ZM12.1 21.7a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.3-.4a9.8 9.8 0 0 1-1.5-5.1C2.1 6.4 6.6 2 12.1 2A9.8 9.8 0 0 1 22 11.9c0 5.4-4.5 9.8-9.9 9.8Zm5.4-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.1 8.1 0 0 1-2.5-1.6 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.6L8.8 6.7c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6s1.1 2.9 1.3 3.1c.1.2 2.2 3.4 5.4 4.8.8.3 1.4.5 1.8.6.8.3 1.5.2 2.1.1.6-.1 1.8-.7 2.1-1.5.2-.7.2-1.4.2-1.5-.1-.2-.3-.3-.6-.5Z" />
    </svg>
  );
}

export function InstagramIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 0c.4 2.6 1.9 4.2 4.5 4.4v4.1a9.1 9.1 0 0 1-4.5-1.3v8.4a7.3 7.3 0 1 1-6.3-7.2v4.2a3.2 3.2 0 1 0 2.1 3V0h4.2Z" />
    </svg>
  );
}
