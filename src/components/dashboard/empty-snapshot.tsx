export function EmptySnapshotNote({
  title = "No reviewed snapshot yet",
  children,
}: {
  title?: string;
  children?: string;
}) {
  return (
    <div className="py-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {children && <p className="mt-2 text-sm text-muted-foreground">{children}</p>}
    </div>
  );
}
