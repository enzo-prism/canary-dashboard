"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutGrid, Menu } from "lucide-react";
import { SITES } from "@/lib/sites";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SiteLogo } from "@/components/dashboard/site-logo";

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const overviewActive = pathname === "/";

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-10 pb-6">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-4">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
            L
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Listwin</div>
            <div className="text-xs text-muted-foreground">Executive dashboard</div>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4">
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-4 rounded-md px-2 py-2 text-sm transition-colors",
            overviewActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
          )}
        >
          <LayoutGrid className="size-4 shrink-0" />
          Dashboard
        </Link>

        <div className="mt-6 mb-2 px-2 text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
          Projects
        </div>

        {SITES.map((site) => {
          const href = `/${site.id}`;
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={site.id}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-4 rounded-md px-2 py-2 transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50",
              )}
            >
              <SiteLogo site={site} className="size-8" />
              <span className="min-w-0 flex-1 leading-tight">
                <span className={cn("block truncate text-sm", active ? "font-medium" : "text-foreground/90")}>
                  {site.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{site.domain}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t px-6 py-6">
        <div className="text-xs font-medium">Don Listwin</div>
        <div className="mt-2 text-xs text-muted-foreground">Managed by Prism</div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-sidebar md:block">
        <NavContent />
      </aside>

      <div className="sticky top-0 z-30 flex w-full items-center gap-2 border-b bg-sidebar px-4 py-2 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <NavContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
            L
          </div>
          <span className="text-sm font-semibold">Listwin</span>
        </div>
      </div>
    </>
  );
}
