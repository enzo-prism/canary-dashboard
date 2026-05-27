import {
  CalendarCheck,
  CalendarRange,
  Mail,
  Repeat2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDateTime, timeAgo } from "@/lib/format";
import type { Lead, LeadStatus } from "@/data/types";

/* ── Initials avatar ─────────────────────────────────────────────────────
 * No photo data from Formspree, so we anchor each row with a tinted initials
 * monogram. The tint is derived deterministically from the name so a given
 * lead always gets the same color. */
const AVATAR_TINTS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
];

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  const letters = [words[0]?.[0], words[words.length - 1]?.[0]].filter(Boolean);
  return letters.join("").toUpperCase() || "?";
}

function tintFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) | 0;
  return AVATAR_TINTS[Math.abs(hash) % AVATAR_TINTS.length];
}

function LeadAvatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        tintFor(name),
      )}
    >
      {initials(name)}
    </span>
  );
}

/* ── Status pill ─────────────────────────────────────────────────────────
 * One consistent shape (outline badge + colored dot), so the lifecycle reads
 * as a single legend rather than five differently-colored fills. */
const STATUS_DOT: Record<LeadStatus, string> = {
  new: "bg-blue-500",
  contacted: "bg-amber-500",
  qualified: "bg-violet-500",
  booked: "bg-emerald-500",
  closed: "bg-muted-foreground",
};

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge variant="outline" className="gap-1.5 capitalize">
      <span className={cn("size-1.5 rounded-full", STATUS_DOT[status])} />
      {status}
    </Badge>
  );
}

/* ── Channel pill ──────────────────────────────────────────────────────── */
function ChannelBadge({ lead }: { lead: Lead }) {
  if (lead.channel === "booking") {
    return (
      <Badge variant="secondary" data-icon="inline-start">
        <CalendarCheck />
        Booking
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground" data-icon="inline-start">
      <Mail />
      Contact
    </Badge>
  );
}

function MetaChip({
  icon: Icon,
  children,
  emphasis,
}: {
  icon: typeof CalendarRange;
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap",
        emphasis ? "font-medium text-foreground/80" : "text-muted-foreground",
      )}
    >
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      {children}
    </span>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const hasMeta = lead.stayDates || lead.party || (lead.submissions ?? 0) > 1;
  return (
    <li className="-mx-4 flex gap-3 px-4 py-4 transition-colors hover:bg-muted/40 sm:gap-4 [&:not(:last-child)]:border-b">
      <LeadAvatar name={lead.name} />

      <div className="min-w-0 flex-1">
        {/* Identity ── status / time */}
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-medium leading-none">{lead.name}</span>
              {lead.org && (
                <span className="truncate text-sm text-muted-foreground">
                  {lead.org}
                </span>
              )}
              <ChannelBadge lead={lead} />
            </div>
            <a
              href={`mailto:${lead.email}`}
              className="mt-1 inline-block text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              {lead.email}
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={lead.status} />
            <Tooltip>
              <TooltipTrigger asChild>
                <time
                  dateTime={lead.submittedAt}
                  className="cursor-default text-xs whitespace-nowrap text-muted-foreground tabular-nums"
                >
                  {timeAgo(lead.submittedAt)}
                </time>
              </TooltipTrigger>
              <TooltipContent>{formatDateTime(lead.submittedAt)}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Structured stay details */}
        {hasMeta && (
          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            {lead.stayDates && (
              <MetaChip icon={CalendarRange} emphasis>
                {lead.stayDates}
              </MetaChip>
            )}
            {lead.party && <MetaChip icon={Users}>{lead.party}</MetaChip>}
            {(lead.submissions ?? 0) > 1 && (
              <MetaChip icon={Repeat2}>{lead.submissions} submissions</MetaChip>
            )}
          </div>
        )}

        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {lead.message}
        </p>
      </div>
    </li>
  );
}

export function LeadsList({ leads }: { leads: Lead[] }) {
  return (
    <ul className="-mb-4 flex flex-col">
      {leads.map((lead) => (
        <LeadRow key={lead.id} lead={lead} />
      ))}
    </ul>
  );
}
