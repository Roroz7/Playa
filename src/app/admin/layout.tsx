import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import "./admin.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ADMIN") {
    return (
      <div className="admin-error">
        <h1>⛔ Accès Refusé</h1>
        <p>Vous n'avez pas les droits d'administration.</p>
        <Link href="/" className="btn">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <h2>🥥 Playa Admin</h2>
        <ul>
          <li><Link href="/admin">Dashboard</Link></li>
          <li><Link href="/admin/games/new">Ajouter un jeu</Link></li>
          <li><Link href="/">Retour au site public</Link></li>
        </ul>
      </nav>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
