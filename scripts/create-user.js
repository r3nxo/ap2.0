#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERROR: Missing Supabase env vars in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const [,, username, password, fullName = '', isAdmin = 'false'] = process.argv;

  if (!username || !password) {
    console.log('Usage: node scripts/create-user.js <username> <password> [fullName] [isAdmin]');
    process.exit(1);
  }

  try {
    const passwordHash = bcrypt.hashSync(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        username,
        password_hash: passwordHash,
        full_name: fullName || username,
        email: null,
        is_admin: isAdmin === 'true' || isAdmin === '1',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error.message || error);
      process.exit(1);
    }

    console.log('User created:', data.username, 'id:', data.id);
  } catch (err) {
    console.error('Error creating user:', err);
    process.exit(1);
  }
}

main();
