import type { ReactNode } from "react";
import "./wedding-sections.css";

export function WeddingSection({
  children,
  tone = "ivory",
  className = "",
  id,
  label,
}: {
  children: ReactNode;
  tone?: "ivory" | "blush" | "sage" | "white";
  className?: string;
  id?: string;
  label: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`home-wedding-section home-wedding-${tone} ${className}`}
    >
      <div className="home-section-decoration" aria-hidden="true">
        {["left", "right"].map((side) => (
          <svg
            key={side}
            className={`home-section-flourish home-section-flourish-${side}`}
            viewBox="0 0 160 220"
            fill="none"
            focusable="false"
          >
            <path
              d="M15 213C42 164 67 147 84 100S118 44 141 10"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <g
              stroke="currentColor"
              strokeWidth="1.5"
              fill="currentColor"
              fillOpacity="0.06"
            >
              <path d="M41 174C11 171 3 146 12 128C37 134 49 153 41 174Z" />
              <path d="M56 149C82 154 104 141 109 119C81 116 62 127 56 149Z" />
              <path d="M78 117C51 108 49 86 58 68C83 79 89 98 78 117Z" />
              <path d="M91 85C119 93 142 79 146 59C119 53 100 64 91 85Z" />
              <path d="M114 47C90 39 89 19 99 6C119 14 127 32 114 47Z" />
            </g>
          </svg>
        ))}
      </div>
      <div className="home-section-content">{children}</div>
    </section>
  );
}
