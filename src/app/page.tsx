import Link from "next/link";
import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Récupérer les 6 derniers jeux de la base de données
  const featuredGames = await prisma.game.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.homeContainer}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Plongez dans le fun ! 🌴</h1>
          <p>Découvrez notre sélection de mini-jeux colorés et addictifs.</p>
          <Link href="/catalog" className="btn btn-primary" style={{ padding: "16px 32px", fontSize: "1.2rem", marginTop: "20px" }}>
            Voir tout le catalogue
          </Link>
        </div>
        <div className={styles.heroIllustration}>
          {/* Un placeholder visuel pour l'ambiance */}
          <div className={styles.blob}>🎮</div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2>Jeux à la Une ⭐</h2>
          <Link href="/catalog" className="btn btn-outline">Voir plus</Link>
        </div>
        
        <div className={styles.grid}>
          {featuredGames.map(game => (
            <Link href={`/games/${game.id}`} key={game.id} className={styles.gameCard}>
              <div className={styles.thumbnailPlaceholder} style={{ background: "none", padding: 0, overflow: "hidden" }}>
                <img src={game.thumbnail} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className={styles.gameInfo}>
                <span className={styles.category}>{game.category}</span>
                <h3>{game.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
