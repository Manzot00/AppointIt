import db from "@/app/lib/db";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function GET(req: Request, { params }: { params: { id: string } }){
    const { id: customerId } = params;

    try {
        const customer = await db.customer.findUnique({
            where: {
                id: customerId
            }
        });

        return NextResponse.json({ customer }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong! :(" }, { status: 500 });
    }
}

const FormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    surname: z.string().min(1, 'Surname is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    phoneNumber: z.string().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }){
    const { id: customerId} = params;

    try {
        const body = await req.json();
        const { name, surname, email, phoneNumber } = FormSchema.parse(body);

        const updatedCustomer = await db.customer.update({
            where: {
                id: customerId
            },
            data: {
                name,
                surname,
                email,
                phoneNumber
            }
        });

        return NextResponse.json({ customer: updatedCustomer }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong! :(" }, { status: 500 });
    }
}