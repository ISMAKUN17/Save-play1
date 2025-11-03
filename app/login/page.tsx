
import { AuthForm } from "@/components/auth/auth-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <Image
        src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop"
        alt="Ilustración de fondo de finanzas"
        fill
        className="object-cover"
        quality={80}
        priority
      />
      <div className="absolute inset-0 bg-background/30 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md">
        <AuthForm />
      </div>
       <footer className="absolute bottom-4 text-center w-full z-10 text-white/70 text-xs">
          Foto de <a href="https://unsplash.com/@micheile" target="_blank" rel="noopener noreferrer" className="underline">micheile || visual stories</a> en <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a>
      </footer>
    </div>
  );
}

