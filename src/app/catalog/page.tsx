import Link from "next/link";
import styles from "./catalog.module.css";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Catalog() {
  // Récupérer les jeux de la base de données
  const games = await prisma.game.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className={styles.catalogContainer}>
      <header className={styles.header}>
        <h1>Catalogue de Jeux 🎮</h1>
        <p>Trouvez votre prochain coup de cœur !</p>
      </header>
      
      <div className={styles.filters}>
        <button className={`btn ${styles.filterBtn} ${styles.active}`}>Tous</button>
        <button className={`btn ${styles.filterBtn}`}>Arcade</button>
        <button className={`btn ${styles.filterBtn}`}>Action</button>
        <button className={`btn ${styles.filterBtn}`}>Puzzle</button>
      </div>

      <div className={styles.grid}>
        {games.map(game => (
          <Link href={`/games/${game.id}`} key={game.id} className={styles.gameCard}>
            <div className={styles.thumbnailPlaceholder} style={{ background: "none", padding: 0, overflow: "hidden" }}>
              <img src={game.thumbnail} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className={styles.gameInfo}>
              <span className={styles.category}>{game.category}</span>
              <h3>{game.title}</h3>
              <div className={styles.tags}>
                {game.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
