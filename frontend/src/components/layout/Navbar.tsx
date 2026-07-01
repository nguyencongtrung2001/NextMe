"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Trang chủ" },
    { href: "/challenges", label: "Danh sách Thử thách" },
    { href: "/today", label: "Hôm nay" },
    { href: "/garden", label: "Vườn hoa" },
  ];

  return (
    <header className="flex justify-center w-full pt-8 px-4 sticky top-0 z-50 pointer-events-none">
      <nav className="bg-surface-2/85 dark:bg-surface-2/70 backdrop-blur-md border border-border p-1.5 rounded-full inline-flex gap-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_10px_30px_rgba(0,0,0,0.03)] pointer-events-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-bold transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(37,99,235,0.25)]"
                  : "text-ink-4 dark:text-ink-3 hover:text-ink-2 dark:hover:text-ink hover:bg-surface dark:hover:bg-surface-3"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
