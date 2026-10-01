import Image from 'next/image';
import { cn } from '@/lib/utils';

/** Display the supplied artwork, framing out its large white margins in CSS. */
export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={cn('relative block aspect-[8/5] w-28 shrink-0 overflow-hidden rounded-lg bg-white', className)}>
      <Image
        src="/images/brand/nakathata-logo.jpg"
        alt="Nakathata.lk — Weddings, Events, Everything Together"
        width={2048}
        height={2048}
        priority={priority}
        sizes="(max-width: 640px) 180px, 320px"
        className="absolute h-auto max-w-none"
        style={{ width: '124%', left: '-13.5%', top: '-42%' }}
      />
    </span>
  );
}
