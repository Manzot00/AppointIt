import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id: userId } = params;

    try {
        const customers = await db.customer.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                surname: 'asc'
            }
        });
        return NextResponse.json({ customers }, { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return NextResponse.json({ message: "Something went wrong! :(" }, { status: 500 });
    }
}