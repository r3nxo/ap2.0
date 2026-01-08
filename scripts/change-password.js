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
  const [,, usernameOrId, newPassword] = process.argv;

  if (!usernameOrId || !newPassword) {
    console.log('Usage: node scripts/change-password.js <username|id> <newPassword>');
    process.exit(1);
  }

  try {
    const { data: users, error: selectErr } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${usernameOrId},id.eq.${usernameOrId}`)
      .limit(1);

    if (selectErr) {
      console.error('Supabase error:', selectErr.message || selectErr);
      process.exit(1);
    }

    if (!users || users.length === 0) {
      console.error('User not found');
      process.exit(1);
    }

    const user = users[0];
    const passwordHash = bcrypt.hashSync(newPassword, 10);

    const { error: updateErr } = await supabase
      .from('users')
      .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateErr) {
      console.error('Supabase error:', updateErr.message || updateErr);
      process.exit(1);
    }

    console.log('Password updated for user:', user.username || user.id);
  } catch (err) {
    console.error('Error changing password:', err);
    process.exit(1);
  }
}

main();
