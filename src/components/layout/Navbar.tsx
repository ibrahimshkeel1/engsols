import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AuthLinks } from "@/components/layout/AuthLinks";
import { NavbarSearch } from "@/components/layout/NavbarSearch";
import { NavbarShell } from "@/components/layout/NavbarShell";
import { getCurrentUser } from "@/lib/auth";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <NavbarShell
      showForYou={Boolean(user)}
      menuFooter={
        <div className="flex flex-col gap-2 sm:hidden">
          <AuthLinks />
        </div>
      }
    >
      <NavbarSearch />
      <ThemeToggle />
      <div className="hidden items-center gap-1 sm:flex">
        <AuthLinks />
      </div>
    </NavbarShell>
  );
}
