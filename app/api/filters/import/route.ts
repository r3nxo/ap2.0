import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('Missing Supabase server env vars for import route');
}

const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
  : null;

function validateFilterShape(item: any): { valid: boolean; reason?: string } {
  if (!item) return { valid: false, reason: 'Empty item' };
  if (!item.name || typeof item.name !== 'string') return { valid: false, reason: 'Missing or invalid name' };
  if (item.description && typeof item.description !== 'string') return { valid: false, reason: 'Invalid description' };
  if (item.conditions && typeof item.conditions !== 'object') return { valid: false, reason: 'Invalid conditions object' };
  return { valid: true };
}

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const filters = body.filters;
    const userId = body.userId;

    if (!Array.isArray(filters)) {
      return NextResponse.json({ error: 'filters must be an array' }, { status: 400 });
    }
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const rows: any[] = [];
    const errors: Array<{ index: number; reason: string }> = [];

    filters.forEach((item: any, idx: number) => {
      const v = validateFilterShape(item);
      if (!v.valid) {
        errors.push({ index: idx, reason: v.reason || 'invalid' });
        return;
      }

      rows.push({
        user_id: userId ? userId : null,
        name: item.name,
        description: item.description || null,
        conditions: item.conditions || item,
        is_active: item.is_active !== undefined ? !!item.is_active : true,
        notification_enabled: item.notification_enabled !== undefined ? !!item.notification_enabled : false,
        telegram_enabled: item.telegram_enabled !== undefined ? !!item.telegram_enabled : false,
        is_shared: item.is_shared !== undefined ? !!item.is_shared : false,
        trigger_count: typeof item.trigger_count === 'number' ? item.trigger_count : 0,
        success_rate: typeof item.success_rate === 'number' ? item.success_rate : null,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    });

    if (rows.length === 0) {
      return NextResponse.json({ success: 0, failed: filters.length, errors }, { status: 200 });
    }

    // Upsert by name + user_id to avoid duplicates
    const { data, error } = await supabaseAdmin
      .from('filters')
      .upsert(rows, { onConflict: 'name,user_id' })
      .select();

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({ error: error.message || error }, { status: 500 });
    }

    const success = Array.isArray(data) ? data.length : 0;
    const failed = errors.length;

    return NextResponse.json({ success, failed, errors }, { status: 200 });
  } catch (err: any) {
    console.error('Import route error:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
