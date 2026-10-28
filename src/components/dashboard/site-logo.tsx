import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Site } from "@/lib/sites";

/**
 * Renders a site's brand logo inside a neutral rounded tile. Logos vary
 * (full-bleed square, transparent mark, wordmark), so we letterbox them on a
 * white background with `object-contain` for a consistent look.
 */
export function SiteLogo({ site, className }: { site: Site; className?: string }) {
  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-black/5",
        className,
      )}
    >
      <Image
        src={site.logo}
        alt={`${site.name} logo`}
        fill
        sizes="48px"
        unoptimized={site.logo.endsWith(".svg")}
        className="object-contain p-0.5"
      />
    </span>
  );
}
