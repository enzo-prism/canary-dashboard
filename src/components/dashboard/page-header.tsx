import { CalendarRange, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Site } from "@/lib/sites";
import type { SiteSnapshot } from "@/data/types";
import { SiteLogo } from "@/components/dashboard/site-logo";

export function PageHeader({ site, snapshot }: { site: Site; snapshot: SiteSnapshot }) {
  return (
    <div className="flex flex-col gap-4 border-b bg-background px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        <SiteLogo site={site} className="size-11 rounded-lg" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{site.name}</h1>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            {site.domain}
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 self-start rounded-md border bg-muted/40 px-2.5 py-1.5 text-sm lg:self-auto">
        <CalendarRange className="size-4 text-muted-foreground" />
        <span className="font-medium">{snapshot.periodLabel}</span>
        <span className="text-muted-foreground">
          ({formatDate(snapshot.rangeStart)} – {formatDate(snapshot.rangeEnd)})
        </span>
      </div>
    </div>
  );
}
