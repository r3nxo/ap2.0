import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase environment variables on server!');
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { filterId, updates } = body;

    if (!filterId) {
      return NextResponse.json({ error: 'Missing filterId' }, { status: 400 });
    }

    console.log('✏️ API /filters/update: Updating filter:', filterId);

    const { data, error } = await supabaseAdmin
      .from('filters')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', filterId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating filter:', error);
      return NextResponse.json(
        { error: error.message || 'Error updating filter' },
        { status: 400 }
      );
    }

    console.log('✅ Filter updated successfully');
    return NextResponse.json({ data, error: null });
  } catch (err) {
    console.error('❌ Error in /filters/update:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
