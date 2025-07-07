import Link from "next/link";
import { MountainIcon } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground px-4 lg:px-6 h-14 flex items-center">
      <Link
        href="/"
        className="flex items-center justify-center"
        prefetch={false}
      >
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Homens de Honra</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          href="/"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Início
        </Link>
        <Link
          href="/sobre"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Sobre
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Contato
        </Link>
      </nav>
    </header>
  );
};