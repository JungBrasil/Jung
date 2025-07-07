import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Signup {
  id: string;
  nome_completo: string;
  tipo: string;
  avatar_url: string | null;
}

export function RecentSignups({ signups }: { signups: Signup[] }) {
  if (signups.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        <p>Nenhuma inscrição recente nesta edição.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {signups.map((signup) => (
        <Link href={`/dashboard/pessoas/${signup.id}`} key={signup.id}>
          <div className="flex items-center hover:bg-muted/50 p-2 rounded-md">
            <Avatar className="h-9 w-9">
              <AvatarImage src={signup.avatar_url || undefined} alt={signup.nome_completo} />
              <AvatarFallback>
                {signup.nome_completo
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {signup.nome_completo}
              </p>
            </div>
            <div className="ml-auto font-medium">
              <Badge variant={signup.tipo === 'participante' ? 'secondary' : 'outline'}>
                {signup.tipo === 'participante' ? 'Participante' : 'Equipe'}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}