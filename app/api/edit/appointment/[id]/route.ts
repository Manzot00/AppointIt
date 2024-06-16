import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }){
    const { id: appointmentId } = params;

    try {
        const body = await req.json();
        const { customerId, type, startTime, endTime, cost, status, notes } = body;

        const updatedAppointment = await db.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                customerId,
                type,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                cost,
                status,
                notes
            }
        });

        return NextResponse.json({ appointment: updatedAppointment }, { status: 200 });
    }catch(error){
        console.error(error);
        return NextResponse.json({ message: "Something went wrong! :(" }, { status: 500 });
    }
}