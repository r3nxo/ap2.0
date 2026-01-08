#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SRC = process.argv[2];
if (!SRC) {
  console.error('Usage: node scripts/import-filters.js <json_url_or_file>');
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase env vars in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadSource(src) {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    const res = await global.fetch(src);
    if (!res.ok) throw new Error(`Failed to fetch ${src}: ${res.status}`);
    return res.json();
  } else {
    // local file
    const fs = require('fs');
    const content = fs.readFileSync(src, 'utf8');
    return JSON.parse(content);
  }
}

async function main() {
  try {
    const data = await loadSource(SRC);

    if (!Array.isArray(data)) {
      console.error('Source must be a JSON array of filters');
      process.exit(1);
    }

    console.log(`Importing ${data.length} filters...`);

    for (const item of data) {
      // Basic mapping: assume item has { id?, name, description, conditions, is_active, notification_enabled, telegram_enabled, user_id }
      const record = {
        id: item.id || undefined,
        name: item.name || 'Imported filter',
        description: item.description || null,
        conditions: item.conditions || item, // if entire object is conditions
        is_active: item.is_active !== undefined ? item.is_active : true,
        is_shared: item.is_shared || false,
        notification_enabled: item.notification_enabled !== undefined ? item.notification_enabled : false,
        telegram_enabled: item.telegram_enabled !== undefined ? item.telegram_enabled : false,
        trigger_count: item.trigger_count || 0,
        success_rate: item.success_rate || null,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: item.user_id || null,
      };

      // Upsert by name and user_id to avoid duplicates
      const { data: existing } = await supabase
        .from('filters')
        .select('id')
        .eq('name', record.name)
        .eq('user_id', record.user_id)
        .limit(1);

      if (existing && existing.length > 0) {
        const id = existing[0].id;
        const { error: updateErr } = await supabase
          .from('filters')
          .update(record)
          .eq('id', id);
        if (updateErr) console.error('Update error for', record.name, updateErr.message || updateErr);
        else console.log('Updated filter', record.name);
      } else {
        const { error: insertErr } = await supabase
          .from('filters')
          .insert([record]);
        if (insertErr) console.error('Insert error for', record.name, insertErr.message || insertErr);
        else console.log('Inserted filter', record.name);
      }
    }

    console.log('Import complete.');
  } catch (err) {
    console.error('Import failed:', err);
    process.exit(1);
  }
}

main();
