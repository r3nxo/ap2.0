const bcrypt = require('bcryptjs');

// Hash-ul din database (copiază-l din Supabase)
const hashFromDB = '\\\.uMGJ7KZjYmQl4vN5pWxLmHqZoQxKvYqi';

// Parola pe care o încerci
const password = 'admin123';

// Test
const isValid = bcrypt.compareSync(password, hashFromDB);

console.log('Hash din DB:', hashFromDB);
console.log('Parolă testată:', password);
console.log('Rezultat:', isValid ? 'MATCH ✅' : 'NO MATCH ❌');

// Generează hash nou
const newHash = bcrypt.hashSync(password, 10);
console.log('\nHash NOU generat:', newHash);
