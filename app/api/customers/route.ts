import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { parse } from 'url';

export async function GET(req: Request) {
    const { query } = parse(req.url!, true); // Effettua il parsing dell'URL per ottenere i parametri di query
    
    const userId = query.userId as string;

    try {
        const customers = await db.customer.findMany({
            where: {
                userId: userId
            }
        });
        return NextResponse.json({ customers }, { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return NextResponse.json({ message: "Something went wrong! :(" }, { status: 500 });
    }
}