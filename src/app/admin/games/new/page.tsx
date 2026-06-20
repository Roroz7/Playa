"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGame } from "../../actions";

export default function NewGamePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      
      // 1. Upload the image first if a file is selected
      let thumbnailUrl = "";
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        
        if (!uploadRes.ok) {
          throw new Error("Erreur lors de l'upload de l'image.");
        }
        
        const uploadJson = await uploadRes.json();
        thumbnailUrl = uploadJson.url;
        formData.set("thumbnail", thumbnailUrl); // Replace the File object with the URL string
      } else {
        throw new Error("Vous devez uploader une miniature.");
      }

      // 2. Save the game
      await createGame(formData);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Ajouter un nouveau jeu</h1>
      </div>

      {error && <div className="error-message" style={{ color: "#ff4757", marginBottom: "1rem" }}>{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre du jeu</label>
          <input type="text" id="title" name="title" required placeholder="Ex: Coco-Break" />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={3} required placeholder="Description courte du jeu..."></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <input type="text" id="category" name="category" required placeholder="Ex: Arcade, Puzzle..." />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type d'intégration</label>
          <select id="type" name="type" required>
            <option value="NATIVE">Natif (Fichiers locaux dans /games/)</option>
            <option value="IFRAME">Externe (Lien iFrame vers un autre site)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sourceUrl">URL Source (Pour iFrame ou dossier Natif)</label>
          <input type="text" id="sourceUrl" name="sourceUrl" placeholder="Ex: /games/coco-break/index.html ou https://..." />
          <small style={{ color: "#aaa", fontSize: "0.8rem" }}>Laissez vide si ce n'est pas applicable.</small>
        </div>

        <div className="form-group">
          <label htmlFor="thumbnailFile">Miniature (Upload local)</label>
          <input 
            type="file" 
            id="thumbnailFile" 
            accept="image/*" 
            required 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="controls">Contrôles (Optionnel)</label>
          <input type="text" id="controls" name="controls" placeholder="Ex: Espace pour sauter" />
        </div>

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Création en cours..." : "Créer le jeu"}
        </button>
      </form>
    </div>
  );
}
