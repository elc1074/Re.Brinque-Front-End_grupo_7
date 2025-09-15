import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  return NextResponse.redirect('https://front-re-brinque.vercel.app/google-sync');
}
