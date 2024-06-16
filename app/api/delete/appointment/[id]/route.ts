import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { id: string } }){
    const { id: appointmentId } = params;

    try {
        await db.appointment.delete({
            where: {
                id: appointmentId
            }
        });

        return NextResponse.json({ message: "Appointment deleted successfully!" }, { status: 200 });
    }catch(error){
        console.error(error);
        return NextResponse.json({ message: "Something went wrong! :(" }, { status: 500 });
    }
}