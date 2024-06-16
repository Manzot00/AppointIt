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
        const { customerId, type, startTime, endTime, cost, status, notes } = body;

        // Estrai solo la parte della data da startTime
        const dateOnly = new Date(startTime).toISOString().split('T')[0];
        // Converti la stringa della data in un oggetto Date senza l'orario
        const date = new Date(dateOnly);

        const newAppointment = await db.appointment.create({
            data: {
                userId: session.user.id,
                customerId,
                date,
                type,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                cost,
                status,
                notes,
            },
        });

        return NextResponse.json({ appointment: newAppointment }, { status: 200 });
    }catch(error){
        console.error(error);
        return NextResponse.json({ message: "Something went wrong! :(" }, { status: 500 });
    }
}