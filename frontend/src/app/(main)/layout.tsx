import Navbar from "@/components/layout/Navbar";
import Logo from "@/components/layout/Logo";
import UserMenu from "@/components/layout/UserMenu";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Logo />
      <Navbar />
      <UserMenu />
      <main className="w-full flex flex-col flex-1 pt-24 md:pt-28 pb-24 md:pb-12">
        {children}
      </main>
    </>
  );
}
