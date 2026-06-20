"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createGame(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Non autorisé");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as "IFRAME" | "NATIVE";
  const sourceUrl = formData.get("sourceUrl") as string;
  const thumbnail = formData.get("thumbnail") as string; // Will come from /api/upload
  const category = formData.get("category") as string;
  const controls = formData.get("controls") as string;
  
  if (!title || !description || !type || !thumbnail || !category) {
    throw new Error("Tous les champs obligatoires doivent être remplis.");
  }

  await prisma.game.create({
    data: {
      title,
      description,
      type,
      sourceUrl: sourceUrl || null,
      thumbnail,
      category,
      controls: controls || "Souris / Clavier",
      tags: [],
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");
}
