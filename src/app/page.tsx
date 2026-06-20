import Link from "next/link";
import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // En production, on utiliserait prisma pour récupérer les jeux "Featured"
  // const featuredGames = await prisma.game.findMany({ take: 6 });
  
  // Données mockées pour la V1 initiale
  const mockGames = [
    { id: "coco-break", title: "Coco-Break", category: "Arcade", thumbnail: "/games/coco-break/thumb.jpg", tags: ["Action", "Retro"] }
  ];

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
          {mockGames.map(game => (
            <Link href={`/games/${game.id}`} key={game.id} className={styles.gameCard}>
              <div className={styles.thumbnailPlaceholder}>
                <span style={{fontSize: "3rem"}}>🥥</span>
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
