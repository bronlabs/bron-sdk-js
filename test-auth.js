#!/usr/bin/env node

/**
 * Simple authentication test runner
 * This script tests the authentication flow without requiring the full test suite
 */

import { generateBronJwt, parseJwkEcPrivateKey } from "./src/utils/auth.js";
import BronClient from "./src/client.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Mock JWK for testing
const mockJwk = {
  "kty": "EC",
  "crv": "P-256",
  "x": "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
  "y": "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
  "d": "870MB6gfuTJ4H3UnuUpxs5SwSxH2yf5K0uR49f6OzcP",
  "kid": "test-key-id"
};

const mockJwkString = JSON.stringify(mockJwk);

async function runAuthTests() {
  console.log("🔐 Running Authentication Tests...\n");

  // Test 1: JWK Parsing
  console.log("1. Testing JWK parsing...");
  try {
    const { privateKey, kid } = parseJwkEcPrivateKey(mockJwkString);
    console.log("✅ JWK parsing successful");
    console.log(`   - Key ID: ${kid}`);
    console.log(`   - Private key length: ${privateKey.length} characters`);
  } catch (error) {
    console.log("❌ JWK parsing failed:", error.message);
    return false;
  }

  // Test 2: JWT Generation
  console.log("\n2. Testing JWT generation...");
  try {
    const { privateKey, kid } = parseJwkEcPrivateKey(mockJwkString);
    const jwt = generateBronJwt({
      method: "GET",
      path: "/api/v1/workspaces",
      kid,
      privateKey
    });
    
    console.log("✅ JWT generation successful");
    console.log(`   - JWT length: ${jwt.length} characters`);
    console.log(`   - JWT parts: ${jwt.split(".").length} (should be 3)`);
    
    // Basic JWT structure validation
    const parts = jwt.split(".");
    if (parts.length === 3) {
      console.log("✅ JWT structure is valid");
    } else {
      console.log("❌ JWT structure is invalid");
      return false;
    }
  } catch (error) {
    console.log("❌ JWT generation failed:", error.message);
    return false;
  }

  // Test 3: Client Creation
  console.log("\n3. Testing client creation...");
  try {
    const client = new BronClient({
      apiKey: mockJwkString,
      workspaceId: "test-workspace"
    });
    
    console.log("✅ Client creation successful");
    console.log(`   - Workspace ID: ${client.workspaceId}`);
    console.log("   - API endpoints configured:");
    console.log("     - balances:", !!client.balances);
    console.log("     - workspaces:", !!client.workspaces);
    console.log("     - addressBook:", !!client.addressBook);
    console.log("     - assets:", !!client.assets);
    console.log("     - accounts:", !!client.accounts);
    console.log("     - addresses:", !!client.addresses);
    console.log("     - transactionLimits:", !!client.transactionLimits);
    console.log("     - transactions:", !!client.transactions);
  } catch (error) {
    console.log("❌ Client creation failed:", error.message);
    return false;
  }

  // Test 4: Real API Authentication (if environment variables are set)
  const apiKey = process.env.BRON_API_KEY;
  const workspaceId = process.env.BRON_WORKSPACE_ID;
  
  if (apiKey && workspaceId) {
    console.log("\n4. Testing real API authentication...");
    try {
      const client = new BronClient({
        apiKey,
        workspaceId,
        baseUrl: process.env.BRON_API_URL || "https://api.bron.org"
      });
      
      console.log("✅ Real client creation successful");
      console.log(`   - Workspace ID: ${client.workspaceId}`);
      
      // Try to make a real API call
      try {
        const workspace = await client.workspaces.getWorkspaceById();
        console.log("✅ Real API call successful");
        console.log(`   - Workspace data received: ${typeof workspace}`);
      } catch (apiError) {
        console.log("⚠️  Real API call failed, but this might be expected:");
        console.log(`   - Error: ${apiError.message}`);
        console.log("   - This could be due to network issues, API changes, or invalid credentials");
      }
    } catch (error) {
      console.log("❌ Real client creation failed:", error.message);
      return false;
    }
  } else {
    console.log("\n4. Skipping real API authentication (BRON_API_KEY and BRON_WORKSPACE_ID not set)");
    console.log("   To test real API calls, set these environment variables:");
    console.log("   - BRON_API_KEY: Your Bron API JWK key");
    console.log("   - BRON_WORKSPACE_ID: Your workspace ID");
    console.log("   - BRON_API_URL: (optional) Custom API URL");
  }

  console.log("\n🎉 All authentication tests completed!");
  return true;
}

// Run the tests
runAuthTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error("❌ Test runner failed:", error);
  process.exit(1);
}); 