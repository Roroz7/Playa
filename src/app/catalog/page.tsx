import Link from "next/link";
import styles from "./catalog.module.css";
import { prisma } from "@/lib/prisma";

export default async function Catalog() {
  // En production, on utiliserait prisma pour récupérer les jeux avec des filtres
  // const games = await prisma.game.findMany({ orderBy: { createdAt: 'desc' } });
  
  // Données mockées pour la V1 initiale
  const mockGames = [
    { id: "coco-break", title: "Coco-Break", category: "Arcade", thumbnail: "/games/coco-break/thumb.jpg", tags: ["Action", "Retro"] },
    { id: "iframe-example", title: "Flappy Iframe", category: "Action", thumbnail: "/games/iframe/thumb.jpg", tags: ["Casual", "Difficile"] }
  ];

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
        {mockGames.map(game => (
          <Link href={`/games/${game.id}`} key={game.id} className={styles.gameCard}>
            <div className={styles.thumbnailPlaceholder}>
              <span style={{fontSize: "3rem"}}>{game.id === 'coco-break' ? '🥥' : '🐦'}</span>
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
