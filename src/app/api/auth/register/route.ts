import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    console.log('Registration request received');
    const { name, email, password } = await req.json();

    // Log the received data (excluding password for security)
    console.log('Registration attempt for:', {
      name,
      email,
      password: password ? '[REDACTED]' : '[MISSING]',
    });

    if (!name || !email || !password) {
      console.error('Missing required fields:', {
        name: !!name,
        email: !!email,
        password: !!password,
      });
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    console.log('Checking for existing user...');
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.error('Registration failed: Email already in use', { email });
      return NextResponse.json({ error: 'Email already in use.' }, { status: 400 });
    }

    console.log('Hashing password...');
    const hashed = await hash(password, 10);

    console.log('Creating user...');
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: 'user',
      },
    });

    console.log('User created successfully:', { id: newUser.id, email: newUser.email });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json(
      {
        error: 'Registration failed.',
        // Only include details in development for security
        ...(process.env.NODE_ENV === 'development' && { details: String(err) }),
      },
      { status: 500 },
    );
  }
}
