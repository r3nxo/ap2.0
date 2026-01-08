#!/usr/bin/env node

/**
 * RLS Diagnostic Tool
 * Run this to check RLS policies and identify login issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 RLS Policy Diagnostic Tool\n');
console.log('=' .repeat(50));

// Check 1: Supabase environment variables
console.log('\n1️⃣  Checking Supabase Configuration:');
const envFile = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envFile)) {
  const env = fs.readFileSync(envFile, 'utf8');
  const hasSupabaseUrl = env.includes('NEXT_PUBLIC_SUPABASE_URL');
  const hasSupabaseKey = env.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const hasServiceRole = env.includes('SUPABASE_SERVICE_ROLE_KEY');
  
  console.log(`  ✓ NEXT_PUBLIC_SUPABASE_URL: ${hasSupabaseUrl ? '✅' : '❌'}`);
  console.log(`  ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${hasSupabaseKey ? '✅' : '❌'}`);
  console.log(`  ✓ SUPABASE_SERVICE_ROLE_KEY: ${hasServiceRole ? '✅' : '❌'}`);
} else {
  console.log('  ❌ .env.local not found!');
}

// Check 2: Login function exists
console.log('\n2️⃣  Checking Login Implementation:');
const supabaseFile = path.join(process.cwd(), 'lib', 'supabase.ts');
if (fs.existsSync(supabaseFile)) {
  const content = fs.readFileSync(supabaseFile, 'utf8');
  const hasLoginFunc = content.includes('async login(');
  const hasRLSCheck = content.includes('PGRST100');
  
  console.log(`  ✓ Login function exists: ${hasLoginFunc ? '✅' : '❌'}`);
  console.log(`  ✓ RLS error handling: ${hasRLSCheck ? '✅' : '❌'}`);
} else {
  console.log('  ❌ lib/supabase.ts not found!');
}

// Check 3: Instructions
console.log('\n3️⃣  To Fix Login Issues:');
console.log('\n  Step 1: Go to Supabase Dashboard');
console.log('    - Navigate to: SQL Editor');
console.log('    - Copy & run the RLS_POLICIES_FIX.sql file');
console.log('\n  Step 2: Verify RLS is enabled on users table');
console.log('    - Go to: Authentication → Policies');
console.log('    - Check "Enable RLS"');
console.log('\n  Step 3: Reload the app');
console.log('    - npm run dev');
console.log('    - Try login again');

// Check 4: Common issues
console.log('\n4️⃣  Common Issues & Solutions:\n');
console.log('  Problem: "Invalid credentials" on login');
console.log('  ├─ Solution 1: Run RLS_POLICIES_FIX.sql');
console.log('  └─ Solution 2: Check user exists in database\n');

console.log('  Problem: "policy" error in console');
console.log('  ├─ Cause: RLS policy blocks the SELECT query');
console.log('  └─ Solution: Run RLS_POLICIES_FIX.sql\n');

console.log('  Problem: "PGRST100" error');
console.log('  ├─ Cause: Row Level Security policy violation');
console.log('  └─ Solution: Check RLS policies in Supabase\n');

console.log('=' .repeat(50));
console.log('\n✅ Diagnostic complete. Check output above.\n');
