import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { gameId, score } = await req.json();

    if (!gameId || typeof score !== "number") {
      return NextResponse.json({ message: "Données invalides" }, { status: 400 });
    }

    // Rate limiting et anti-cheat basique pourraient être ajoutés ici
    // Ex: vérifier que le score n'est pas absurde, vérifier le temps depuis la dernière soumission

    const newScore = await prisma.score.create({
      data: {
        value: score,
        userId: session.user.id,
        gameId: gameId,
      }
    });

    return NextResponse.json({ message: "Score enregistré", id: newScore.id }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du score:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
