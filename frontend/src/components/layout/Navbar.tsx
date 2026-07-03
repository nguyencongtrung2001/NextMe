"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Compass, Calendar, Sprout } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/challenges", label: "Thử thách", icon: Compass },
    { href: "/today", label: "Hôm nay", icon: Calendar },
    { href: "/garden", label: "Vườn hoa", icon: Sprout },
  ];

  return (
    <header className="flex justify-center w-full fixed bottom-4 md:top-0 md:bottom-auto md:pt-8 px-4 z-50 pointer-events-none">
      <nav className="bg-surface-2/90 dark:bg-surface-2/75 backdrop-blur-md border border-border p-1.5 rounded-full inline-flex gap-1 shadow-[0_10px_30px_rgba(0,0,0,0.1)] pointer-events-auto max-w-full">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full transition-all duration-200 whitespace-nowrap flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-1.5 px-3 md:px-5 py-1.5 md:py-2 text-[9px] md:text-sm font-bold min-w-[60px] md:min-w-0",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(37,99,235,0.2)]"
                  : "text-ink-4 dark:text-ink-3 hover:text-ink-2 dark:hover:text-ink hover:bg-surface dark:hover:bg-surface-3"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
