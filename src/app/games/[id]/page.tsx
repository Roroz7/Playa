import { notFound } from "next/navigation";
import styles from "./game.module.css";
import GamePlayer from "./GamePlayer";
import { prisma } from "@/lib/prisma";

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // En production, on utiliserait prisma pour récupérer les détails du jeu et le leaderboard
  // const game = await prisma.game.findUnique({ where: { id } });
  
  // Données mockées pour la V1 initiale
  const mockGame = id === "coco-break" ? {
    id: "coco-break",
    title: "Coco-Break",
    description: "Cassez toutes les briques avec votre noix de coco ! Utilisez la souris ou le doigt pour déplacer la raquette en bambou.",
    type: "NATIVE",
    sourceUrl: "/games/coco-break/index.html",
    category: "Arcade",
    controls: "Souris / Touch"
  } : {
    id: "iframe-example",
    title: "Flappy Iframe",
    description: "Un jeu externe intégré via Iframe.",
    type: "IFRAME",
    sourceUrl: "https://flappybird.io/", // Exemple d'url externe
    category: "Action",
    controls: "Espace / Clic"
  };

  if (!mockGame) {
    notFound();
  }

  // Leaderboard mocké
  const leaderboard = [
    { rank: 1, username: "ProGamer", score: 15400 },
    { rank: 2, username: "CoconutKing", score: 12200 },
    { rank: 3, username: "TropicalUser", score: 9800 },
  ];

  return (
    <div className={styles.gamePageContainer}>
      <div className={styles.mainContent}>
        <header className={styles.gameHeader}>
          <h1>{mockGame.title}</h1>
          <span className={styles.categoryBadge}>{mockGame.category}</span>
        </header>

        <div className={styles.playerWrapper}>
          {/* GamePlayer est un Client Component qui gère l'iframe et la communication postMessage */}
          <GamePlayer game={mockGame} />
        </div>

        <section className={styles.gameInfo}>
          <div className={`card ${styles.infoCard}`}>
            <h3>Description</h3>
            <p>{mockGame.description}</p>
            <h4 style={{marginTop: "15px"}}>Contrôles</h4>
            <p className={styles.controls}>{mockGame.controls}</p>
          </div>
        </section>
      </div>

      <aside className={styles.sidebar}>
        <div className={`card ${styles.leaderboardCard}`}>
          <h2>🏆 Classement</h2>
          <div className={styles.leaderboardFilters}>
            <button className={`${styles.lbFilter} ${styles.active}`}>Top 10</button>
            <button className={styles.lbFilter}>Mon Rang</button>
          </div>
          
          <ul className={styles.leaderboardList}>
            {leaderboard.map((entry) => (
              <li key={entry.rank} className={styles.leaderboardItem}>
                <span className={styles.rank}>#{entry.rank}</span>
                <span className={styles.username}>{entry.username}</span>
                <span className={styles.score}>{entry.score.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
