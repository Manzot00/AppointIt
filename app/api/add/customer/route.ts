import db from "@/app/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, surname, email, phoneNumber } = body;

    const newCustomer = await db.customer.create({
      data: {
        name,
        surname,
        email,
        phoneNumber,
        userId: session.user.id, // Associa il cliente all'utente loggato
      },
    });

    return NextResponse.json({ customer: newCustomer }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong! :(" }, { status: 500 });
  }
}