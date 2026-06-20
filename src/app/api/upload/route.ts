import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    // 1. Vérification de sécurité (seul un admin peut uploader)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // 2. Récupérer les données du formulaire
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // 3. Préparer le nom du fichier et le dossier de destination
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Nettoyer le nom du fichier pour éviter les problèmes d'espace ou de caractères spéciaux
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${originalName}`;
    
    // Le dossier public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // 4. Sauvegarder le fichier
    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, buffer);

    // 5. Retourner l'URL publique de l'image
    const publicUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'upload" },
      { status: 500 }
    );
  }
}
