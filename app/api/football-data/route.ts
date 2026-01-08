// ============================================
// R$Q - FOOTBALL-DATA PROXY API
// ============================================
// Next.js API Route pentru a bypassa CORS restrictions
// Request-urile se fac SERVER-SIDE, nu CLIENT-SIDE!

import { NextRequest, NextResponse } from 'next/server';

const FOOTBALL_DATA_API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_DATA_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

// ============================================
// API ROUTE HANDLER
// ============================================

export async function GET(request: NextRequest) {
  // Verifică API key
  if (!FOOTBALL_DATA_API_KEY) {
    return NextResponse.json(
      { error: 'Football-Data API key not configured' },
      { status: 500 }
    );
  }
  
  // Obține parametrii din query
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint') || '/matches';
  const status = searchParams.get('status');
  const matchId = searchParams.get('matchId');
  
  // Construiește URL-ul
  let url = `${BASE_URL}${endpoint}`;
  
  // Adaugă parametri
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (matchId) params.append('id', matchId);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  try {
    console.log('🔍 Proxy request to Football-Data:', url);
    
    // Fă request SERVER-SIDE (nu mai e CORS!)
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': FOOTBALL_DATA_API_KEY,
      },
      next: { revalidate: 30 }, // Cache 30s
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Football-Data error:', error);
      return NextResponse.json(
        { error: error.message || 'Football-Data API error' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    console.log('✅ Football-Data response:', {
      endpoint,
      results: data.matches?.length || data.resultSet?.count || 'N/A',
    });
    
    // Returnează datele
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ============================================
// USAGE EXAMPLE
// ============================================

/*
În browser, în loc de:
  fetch('https://api.football-data.org/v4/matches?status=LIVE')

Folosim:
  fetch('/api/football-data?endpoint=/matches&status=LIVE')

Astfel, request-ul se face SERVER-SIDE și nu mai e blocat de CORS!
*/
