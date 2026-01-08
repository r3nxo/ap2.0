const bcrypt = require('bcryptjs');

console.log('\n========================================');
console.log('  GENERARE HASH-URI PENTRU R\Q');
console.log('========================================\n');

// Parola pentru admin
const adminPassword = 'admin123';
const adminHash = bcrypt.hashSync(adminPassword, 10);

console.log('👤 ADMIN:');
console.log('   Username: admin');
console.log('   Parolă:   admin123');
console.log('   Hash:     ' + adminHash);
console.log('');

// Parola pentru user1
const user1Password = 'user123';
const user1Hash = bcrypt.hashSync(user1Password, 10);

console.log('👤 USER1:');
console.log('   Username: user1');
console.log('   Parolă:   user123');
console.log('   Hash:     ' + user1Hash);
console.log('');

console.log('========================================');
console.log('📋 Copiază hash-urile de mai sus!');
console.log('========================================\n');
