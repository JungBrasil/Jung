import { MadeWithLasy } from "@/components/made-with-lasy";

export const Footer = () => {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Homens de Honra no Pantanal. Todos os
        direitos reservados.
      </p>
      <div className="sm:ml-auto">
        <MadeWithLasy />
      </div>
    </footer>
  );
};