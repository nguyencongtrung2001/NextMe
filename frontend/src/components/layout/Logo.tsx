import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="fixed top-6 left-6 z-50 flex items-center gap-3 group animate-fade-in">
      <div className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 group-active:scale-95 transition-all duration-300">
        <span className="font-black text-2xl font-serif">N</span>
      </div>
      <span className="font-extrabold text-2xl text-ink tracking-tight hidden md:block">
        NextMe
      </span>
    </Link>
  );
}
