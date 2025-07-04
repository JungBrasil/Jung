import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Painel de Controle</h1>
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Sistema de Gerenciamento</CardTitle>
          <CardDescription>
            Use a navegação à esquerda para gerenciar as edições, participantes e
            equipes do acampamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Comece cadastrando uma nova edição do acampamento!</p>
        </CardContent>
      </Card>
    </div>
  );
}