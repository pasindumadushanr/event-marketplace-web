import type { ReactNode } from "react";
import "./wedding-sections.css";

type Motif =
  "sparkles" | "flowers" | "rings" | "rosette" | "ribbon" | "arch" | "hearts";

function MotifDrawing({ motif }: { motif: Motif }) {
  switch (motif) {
    case "sparkles":
      return (
        <>
          <path d="M78 45L87 82L118 93L87 104L78 141L69 104L38 93L69 82Z" />
          <path d="M125 122L131 143L149 150L131 157L125 178L119 157L101 150L119 143Z" />
          <path d="M37 147V169M26 158H48" />
          <circle cx="123" cy="56" r="3" />
          <circle cx="57" cy="188" r="2" />
        </>
      );
    case "flowers":
      return (
        <>
          <g transform="translate(78 87)">
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx="0"
                cy="-24"
                rx="13"
                ry="25"
                transform={`rotate(${angle})`}
              />
            ))}
            <circle r="9" />
          </g>
          <g transform="translate(116 160)">
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx="0"
                cy="-15"
                rx="8"
                ry="15"
                transform={`rotate(${angle})`}
              />
            ))}
            <circle r="5" />
          </g>
          <circle cx="30" cy="159" r="3" />
          <path d="M42 174L48 186M48 174L42 186" />
        </>
      );
    case "rings":
      return (
        <>
          <circle cx="58" cy="112" r="39" />
          <circle cx="58" cy="112" r="33" />
          <circle cx="105" cy="128" r="39" />
          <circle cx="105" cy="128" r="33" />
          <path d="M45 66L51 56H65L71 66L58 79ZM45 66H71M51 56L58 79L65 56" />
          <path d="M116 62V78M108 70H124" />
        </>
      );
    case "rosette":
      return (
        <>
          <g transform="translate(80 110)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={angle}
                cx="0"
                cy="-28"
                rx="17"
                ry="31"
                transform={`rotate(${angle})`}
              />
            ))}
            <circle r="14" />
            <circle r="7" />
          </g>
          <circle cx="42" cy="42" r="3" />
          <circle cx="127" cy="184" r="3" />
        </>
      );
    case "ribbon":
      return (
        <>
          <path d="M75 105C35 50 4 74 31 107C43 121 62 119 75 105ZM85 105C125 50 156 74 129 107C117 121 98 119 85 105Z" />
          <rect x="72" y="96" width="16" height="19" rx="5" />
          <path d="M73 113L44 173L68 168L79 182L84 116M89 113L117 173L97 167L87 179" />
          <path d="M37 91C46 88 60 95 72 104M123 91C114 88 100 95 88 104" />
        </>
      );
    case "arch":
      return (
        <>
          <path d="M28 188V85A52 52 0 0 1 132 85V188M38 188V85A42 42 0 0 1 122 85V188M17 188H49M111 188H143" />
          <path d="M48 57V79M80 40V65M112 57V79" />
          <circle cx="48" cy="83" r="4" />
          <circle cx="80" cy="69" r="4" />
          <circle cx="112" cy="83" r="4" />
        </>
      );
    case "hearts":
      return (
        <>
          <path d="M71 142L32 104C6 78 44 44 71 72C98 44 136 78 110 104Z" />
          <path d="M112 182L87 158C71 142 95 121 112 138C129 121 153 142 137 158Z" />
          <path d="M127 48V66M118 57H136" />
          <circle cx="35" cy="165" r="3" />
        </>
      );
  }
}

export function WeddingSection({
  children,
  tone = "ivory",
  className = "",
  id,
  label,
  motif = "flowers",
}: {
  children: ReactNode;
  tone?: "ivory" | "blush" | "sage" | "white";
  className?: string;
  id?: string;
  label: string;
  motif?: Motif;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`home-wedding-section home-wedding-${tone} ${className}`}
    >
      <div
        className={`home-section-decoration home-motif-${motif}`}
        data-motif={motif}
        aria-hidden="true"
      >
        {["left", "right"].map((side) => (
          <svg
            key={side}
            className={`home-section-flourish home-section-flourish-${side}`}
            viewBox="0 0 160 220"
            fill="none"
            focusable="false"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <MotifDrawing motif={motif} />
          </svg>
        ))}
      </div>
      <div className="home-section-content">{children}</div>
    </section>
  );
}
