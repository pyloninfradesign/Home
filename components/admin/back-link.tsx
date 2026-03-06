import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackLink({ href, label = "Back" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-black">
      <ArrowLeft size={16} />
      {label}
    </Link>
  );
}
