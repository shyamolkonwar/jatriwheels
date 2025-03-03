import { hashPassword, verifyPassword } from '../lib/auth';

async function main() {
  const password = 'Katala@123';
  const hashedPassword = await hashPassword(password);
  console.log('Hashed Password:', hashedPassword);
  
  // Verify the password
  const isValid = await verifyPassword(password, hashedPassword);
  console.log('Password verification test:', isValid);
  
  // Test with the provided hash
  const providedHash = '$2y$10$2d6Q.UsutsdK1sNwHJYt1uzvWwtLZBL3Jx4wXxgbxbUWKWuIEM09m';
  const isValidWithProvidedHash = await verifyPassword(password, providedHash);
  console.log('Password verification with provided hash:', isValidWithProvidedHash);
}

main().catch(console.error);