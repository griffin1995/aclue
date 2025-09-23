import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'App Router API test successful!',
    timestamp: new Date().toISOString(),
    status: 'working'
  })
}