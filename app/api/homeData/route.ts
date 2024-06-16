import db from "@/app/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(req: Request){
    try{
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.id;

        const [collected, pending, appointments, today, customers, todayAppointments, earningsData] = await Promise.all([
            db.appointment.aggregate({
              _sum: { cost: true },
              where: { status: 'PAID', userId: userId },
            }),
            db.appointment.aggregate({
              _sum: { cost: true },
              where: { status: 'PENDING', userId: userId },
            }),
            db.appointment.count({ where: { userId: userId } }),
            db.appointment.count({
              where: {
                userId: userId,
                startTime: {
                  gte: startOfDay(new Date()),
                  lt: endOfDay(new Date()),
                },
              },
            }),
            db.customer.count({ where: { userId: userId } }),
            db.appointment.findMany({
              where: {
                userId: userId,
                startTime: {
                  gte: startOfDay(new Date()),
                  lt: endOfDay(new Date()),
                },
              },
              include: { customer: true },
            }),
            db.appointment.groupBy({
              by: ['date'],
              _sum: {
                cost: true,
              },
              where: {
                userId: userId,
              },
              orderBy: {
                date: 'desc',
              },
            }),
        ]);

        return NextResponse.json({ 
            collected: collected._sum.cost || 0,
            pending: pending._sum.cost || 0,
            appointments: appointments || 0,
            today: today || 0,
            customers: customers || 0,
            todayAppointments,
            earningsData,});
    }catch(error){
        console.error(error);
        return NextResponse.json({ message: "Something went wrong! :(" }, { status: 500 });
    }
}
