import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin } = body;

    // PIN divalidasi di sisi server secara aman.
    // Nilai diambil dari environment variable ADMIN_PIN (rahasia di Vercel).
    const secretPin = process.env.ADMIN_PIN || '1234';

    if (pin && typeof pin === 'string' && pin.trim() === secretPin) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'PIN salah! Silakan coba lagi.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem.' },
      { status: 500 }
    );
  }
}
