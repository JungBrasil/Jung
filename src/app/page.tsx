import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <main className="flex flex-col gap-8 items-center text-center">
        <h1 className="text-4xl font-bold mb-4">
          Sistema de Gestão - Acampamento Homens de Honra
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Bem-vindo! Este é o seu painel central para gerenciar todas as edições,
          participantes e equipes do acampamento.
        </p>
        <Button asChild size="lg">
          <Link href="/dashboard">Acessar o Painel</Link>
        </Button>
      </main>
    </div>
  );
}