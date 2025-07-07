export default function Home() {
  return (
    <div
      className="relative flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1552728634-c1a01b575234?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      {/* Overlay para escurecer a imagem e melhorar a legibilidade do texto */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Conteúdo */}
      <main className="relative z-10 flex flex-col items-center gap-8 p-8">
        <h1 className="text-4xl font-bold text-white drop-shadow-md md:text-5xl lg:text-6xl">
          Seja Bem Vindo ao HOMENS DE HONRA NO PANTANAL
        </h1>
        <p className="max-w-2xl text-lg text-gray-200 drop-shadow-md">
          Um lugar para homens que buscam honra, integridade e propósito.
        </p>
      </main>
    </div>
  );
}