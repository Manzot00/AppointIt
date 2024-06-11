import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id: customerId } = params;

    try {
        await db.customer.delete({
            where: {
                id: customerId
            }
        });
        return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return NextResponse.json({ message: "Something went wrong! :(" }, { status: 500 });
    }
}