import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import bcrypt from "bcrypt";
import * as z from "zod";

const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
  })

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, email, password } = userSchema.parse(body);

        //chek id email already exists
        const existingUserByEmial = await db.user.findUnique({
            where: { email: email }
        });
        if(existingUserByEmial){
            return NextResponse.json({ user: null, message: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        const { password: newUserPassword, ...rest } = newUser;

        return NextResponse.json({ user: rest, message: "User created successfully"}, {status: 201});
    }catch(error){
        return NextResponse.json({message: "Somethin went wrong! :("}, {status: 500});
    }
}