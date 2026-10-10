"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSiteMedia, fallbackImage } from "@/lib/site-media";
import { usePlatformSettings } from "@/lib/platform-settings-context";

/** Display the supplied artwork, framing out its large white margins in CSS. */
export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  const { media } = useSiteMedia();
  const { general } = usePlatformSettings();
  return (
    <span
      className={cn(
        "relative block aspect-[8/5] w-28 shrink-0 overflow-hidden rounded-lg bg-white",
        className,
      )}
    >
      {media.logoImage ? (
        <img
          key={media.logoImage}
          src={media.logoImage}
          alt={general.siteName}
          className="w-full h-full object-contain p-1"
          onError={(event) =>
            fallbackImage(event, "/images/brand/nakathata-logo.jpg")
          }
        />
      ) : (
        <Image
          src="/images/brand/nakathata-logo.jpg"
          alt={`${general.siteName} — Weddings, Events, Everything Together`}
          width={2048}
          height={2048}
          priority={priority}
          sizes="(max-width: 640px) 180px, 320px"
          className="absolute h-auto max-w-none"
          style={{ width: "124%", left: "-13.5%", top: "-42%" }}
        />
      )}
    </span>
  );
}
