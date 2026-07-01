import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.name) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const secret = process.env.SOCKET_JWT_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Servidor mal configurado." }, { status: 500 });
  }

  const token = jwt.sign({ name: session.user.name }, secret, { expiresIn: "2h" });

  return NextResponse.json({ token });
}
