import { ExternalLink } from "lucide-react";
import { formatDateLong } from "@/lib/format";
import type { Site } from "@/lib/sites";
import type { SiteSnapshot } from "@/data/types";
import { SiteLogo } from "@/components/dashboard/site-logo";

export function PageHeader({ site, snapshot }: { site: Site; snapshot: SiteSnapshot }) {
  const empty = snapshot.review === "empty";

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-4">
        <SiteLogo site={site} className="size-11 rounded-lg" />
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
            {site.category}
          </p>
          <h1 className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.011em]">
            {site.name}
          </h1>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            {site.domain}
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      <div className="text-sm text-muted-foreground lg:text-right">
        <div className="font-medium text-foreground">
          {empty ? "No reviewed snapshot yet" : "Dashboard snapshot"}
        </div>
        {!empty && snapshot.rangeStart && snapshot.rangeEnd && (
          <div className="mt-2">
            {formatDateLong(snapshot.rangeStart)} – {formatDateLong(snapshot.rangeEnd)}
          </div>
        )}
        {!empty && snapshot.updatedAt && (
          <div className="mt-2">Refreshed {formatDateLong(snapshot.updatedAt)}</div>
        )}
      </div>
    </div>
  );
}
