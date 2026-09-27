export function BrandMark({ size = 40 }: { size?: number; className?: string }) {
  return <div className="shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/60" style={{ width: size, height: size }} />;
}
