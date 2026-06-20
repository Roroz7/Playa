"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./game.module.css";
import { useSession } from "next-auth/react";

interface GamePlayerProps {
  game: {
    id: string;
    title: string;
    type: string;
    sourceUrl: string;
  };
}

export default function GamePlayer({ game }: GamePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Écouter les messages venant de l'iframe (scores)
    const handleMessage = async (event: MessageEvent) => {
      // Pour une vraie prod, valider event.origin pour la sécurité
      // if (event.origin !== window.location.origin && event.origin !== 'https://trusted-domain.com') return;

      if (event.data?.type === 'SUBMIT_SCORE') {
        const { score } = event.data;
        console.log(`Nouveau score reçu du jeu ${game.id}: ${score}`);
        
        if (session?.user) {
          try {
            const res = await fetch("/api/scores", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ gameId: game.id, score })
            });
            if (res.ok) {
              // Optionnel : déclencher un rafraîchissement du leaderboard
              console.log("Score sauvegardé !");
            }
          } catch (err) {
            console.error("Erreur lors de la sauvegarde du score", err);
          }
        } else {
          console.warn("Utilisateur non connecté, score non sauvegardé.");
          alert(`Joli score (${score}) ! Connectez-vous pour le sauvegarder dans le classement.`);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [game.id, session]);

  // Construire l'URL (si natif, ajouter des paramètres pour que le jeu sache qui joue ?)
  const url = game.sourceUrl;

  return (
    <div className={styles.iframeContainer}>
      {loading && (
        <div className={styles.loaderWrapper}>
          <div className={styles.loader}>🌴 Chargement du jeu...</div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url}
        className={styles.gameIframe}
        title={game.title}
        allow="autoplay; fullscreen; gamepad"
        sandbox="allow-scripts allow-same-origin allow-popups"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
