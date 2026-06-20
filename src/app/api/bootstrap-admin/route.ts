import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Vous devez être connecté pour devenir Admin." }, { status: 401 });
  }

  // Vérifier s'il y a DÉJÀ un admin dans la base de données
  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" }
  });

  if (adminCount > 0) {
    return NextResponse.json({ 
      error: "Il y a déjà un Administrateur sur cette plateforme. Impossible d'utiliser cette route de bootstrap." 
    }, { status: 403 });
  }

  // Promouvoir l'utilisateur actuel
  await prisma.user.update({
    where: { email: session.user.email },
    data: { role: "ADMIN" }
  });

  return NextResponse.json({ 
    success: true, 
    message: `Félicitations, ${session.user.name} ! Vous êtes maintenant Administrateur. Déconnectez-vous puis reconnectez-vous pour actualiser vos droits, puis allez sur /admin !` 
  });
}
