import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase environment variables on server!');
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filterId = searchParams.get('filterId');

    if (!filterId) {
      return NextResponse.json({ error: 'Missing filterId' }, { status: 400 });
    }

    console.log('🔍 API /filters/get-by-id: Getting filter:', filterId);

    const { data, error } = await supabaseAdmin
      .from('filters')
      .select('*')
      .eq('id', filterId)
      .single();

    if (error) {
      console.error('❌ Error getting filter:', error);
      return NextResponse.json(
        { error: error.message || 'Filter not found' },
        { status: 400 }
      );
    }

    console.log('✅ Filter fetched successfully');
    return NextResponse.json({ data, error: null });
  } catch (err) {
    console.error('❌ Error in /filters/get-by-id:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
