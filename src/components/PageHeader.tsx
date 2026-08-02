export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="px-5 pb-4 pt-8">
      {eyebrow && <p className="section-title">{eyebrow}</p>}
      <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{subtitle}</p>
      )}
    </header>
  );
}
