import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/db/prismaClient';

export async function GET(req: NextRequest) {
    const musicians = await prisma.musician.findMany();
    return NextResponse.json(musicians);
}

export async function POST(req: NextRequest) {
    const { name, bio }: { name: string, bio: string } = await req.json();
    const musician = await prisma.musician.create({
        data: { name, bio },
    });
    return NextResponse.json(musician);
}