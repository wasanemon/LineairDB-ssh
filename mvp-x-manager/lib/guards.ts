import { NextResponse } from 'next/server';

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function safeServerError() {
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
