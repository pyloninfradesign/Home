import Link from "next/link";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-neutral-600">
      {items.map((item, idx) => (
        <span key={item.label} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-black">
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-700">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="text-neutral-400">/</span>}
        </span>
      ))}
    </nav>
  );
}
