import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDuration, formatNumber, formatPercent } from "@/lib/format";
import type { SearchPage, SearchQuery, TopPage } from "@/data/types";

export function TopPagesTable({ pages }: { pages: TopPage[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Page</TableHead>
          <TableHead className="text-right">Views</TableHead>
          <TableHead className="text-right">Avg. time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((p) => (
          <TableRow key={p.path}>
            <TableCell>
              <div className="font-medium leading-tight">{p.title}</div>
              <div className="font-mono text-xs text-muted-foreground">{p.path}</div>
            </TableCell>
            <TableCell className="text-right tabular-nums">{formatNumber(p.views)}</TableCell>
            <TableCell className="text-right tabular-nums text-muted-foreground">
              {formatDuration(p.avgEngagementSec)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function QueriesTable({ queries }: { queries: SearchQuery[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Query</TableHead>
          <TableHead className="text-right">Clicks</TableHead>
          <TableHead className="hidden text-right sm:table-cell">Impr.</TableHead>
          <TableHead className="hidden text-right sm:table-cell">CTR</TableHead>
          <TableHead className="text-right">Pos.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {queries.map((q) => (
          <TableRow key={q.query}>
            <TableCell className="font-medium">{q.query}</TableCell>
            <TableCell className="text-right tabular-nums">{formatNumber(q.clicks)}</TableCell>
            <TableCell className="hidden text-right tabular-nums text-muted-foreground sm:table-cell">
              {formatNumber(q.impressions)}
            </TableCell>
            <TableCell className="hidden text-right tabular-nums text-muted-foreground sm:table-cell">
              {formatPercent(q.ctr)}
            </TableCell>
            <TableCell className="text-right tabular-nums">{q.position.toFixed(1)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function SearchPagesTable({ pages }: { pages: SearchPage[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Page</TableHead>
          <TableHead className="text-right">Clicks</TableHead>
          <TableHead className="hidden text-right sm:table-cell">Impr.</TableHead>
          <TableHead className="hidden text-right sm:table-cell">CTR</TableHead>
          <TableHead className="text-right">Pos.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((p) => (
          <TableRow key={p.page}>
            <TableCell className="font-mono text-xs">{p.page}</TableCell>
            <TableCell className="text-right tabular-nums">{formatNumber(p.clicks)}</TableCell>
            <TableCell className="hidden text-right tabular-nums text-muted-foreground sm:table-cell">
              {formatNumber(p.impressions)}
            </TableCell>
            <TableCell className="hidden text-right tabular-nums text-muted-foreground sm:table-cell">
              {formatPercent(p.ctr)}
            </TableCell>
            <TableCell className="text-right tabular-nums">{p.position.toFixed(1)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
