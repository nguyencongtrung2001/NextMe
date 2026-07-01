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
      {children}
    </>
  );
}
