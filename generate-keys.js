#!/usr/bin/env node

/**
 * CLI tool for generating Bron API key pairs
 * Usage: node generate-keys.js
 */

import { generateBronKeyPair, validateBronJwk, extractKeyId, isPrivateKey } from './dist/utils/keyGenerator.js';

async function main() {
  try {
    const keyPair = await generateBronKeyPair();
    
    console.log('Public JWK:');
    console.log(keyPair.publicJwk);
    console.log();
    console.log('Private JWK:');
    console.log(keyPair.privateJwk);
    
  } catch (error) {
    console.error('❌ Failed to generate key pair:', error.message);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('🔑 Bron API Key Generator');
  console.log();
  console.log('Usage: node generate-keys.js [options]');
  console.log();
  console.log('Options:');
  console.log('  --help, -h    Show this help message');
  console.log('  --validate    Validate an existing JWK');
  console.log();
  console.log('Examples:');
  console.log('  node generate-keys.js                    # Generate new key pair');
  console.log('  node generate-keys.js --validate jwk    # Validate existing JWK');
  process.exit(0);
}

if (args.includes('--validate')) {
  const jwkIndex = args.indexOf('--validate') + 1;
  const jwk = args[jwkIndex];
  
  if (!jwk) {
    console.error('❌ Please provide a JWK to validate');
    process.exit(1);
  }
  
  console.log('🔍 Validating JWK...\n');
  console.log(`   Valid ES256 JWK: ${validateBronJwk(jwk)}`);
  console.log(`   Key ID: ${extractKeyId(jwk) || 'Not found'}`);
  console.log(`   Is private key: ${isPrivateKey(jwk)}`);
  process.exit(0);
}

// Run the main function
main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
}); 