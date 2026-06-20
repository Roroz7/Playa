import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function AdminDashboard() {
  const games = await prisma.game.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="admin-header">
        <h1>Dashboard Administrateur</h1>
        <Link href="/admin/games/new" className="btn">
          + Ajouter un jeu
        </Link>
      </div>

      <div className="admin-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Miniature</th>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Aucun jeu dans le catalogue.
                </td>
              </tr>
            ) : (
              games.map((game) => (
                <tr key={game.id}>
                  <td>
                    {game.thumbnail && (
                      <Image
                        src={game.thumbnail}
                        alt={game.title}
                        width={60}
                        height={60}
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td><strong>{game.title}</strong></td>
                  <td>{game.category}</td>
                  <td>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: "4px", 
                      background: game.type === "NATIVE" ? "var(--primary-color)" : "#3498db",
                      color: game.type === "NATIVE" ? "#000" : "#fff",
                      fontSize: "0.8rem",
                      fontWeight: "bold"
                    }}>
                      {game.type}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-small btn-danger" disabled>Supprimer (Bientôt)</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
