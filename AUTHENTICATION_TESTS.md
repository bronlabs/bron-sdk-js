# Authentication Tests

This directory contains comprehensive tests for the Bron SDK authentication system.

## Test Files

### 1. `test/auth.test.ts` - Unit Tests
Comprehensive unit tests that verify:
- JWK (JSON Web Key) parsing and validation
- JWT (JSON Web Token) generation
- HTTP client authentication headers
- Query parameter handling
- Error handling for invalid credentials

### 2. `test/auth-integration.test.ts` - Integration Tests
Real API integration tests that require environment variables:
- Tests actual API calls with real credentials
- Verifies authentication works against the live API
- Tests error handling for invalid API keys

### 3. `test-auth.js` - Standalone Test Runner
A simple Node.js script that can be run independently to test authentication:
- No test framework required
- Provides detailed console output
- Can test with mock data or real API credentials

## Running the Tests

### Prerequisites
First, install the dependencies:
```bash
npm install
```

### Unit Tests (No API credentials needed)
```bash
npm test test/auth.test.ts
```

### Integration Tests (Requires API credentials)
Set up environment variables:
```bash
export BRON_API_KEY="your-jwk-key-here"
export BRON_WORKSPACE_ID="your-workspace-id"
export BRON_API_URL="https://api.bron.org"  # optional
```

Then run:
```bash
npm test test/auth-integration.test.ts
```

### Standalone Test Runner
```bash
node test-auth.js
```

Or with real credentials:
```bash
BRON_API_KEY="your-jwk-key" BRON_WORKSPACE_ID="your-workspace-id" node test-auth.js
```

## What the Tests Verify

### JWK Parsing
- Validates EC P-256 key format
- Extracts private key and key ID
- Handles invalid key formats gracefully

### JWT Generation
- Creates properly formatted JWTs
- Includes correct headers and payload
- Generates unique tokens for different requests
- Handles request bodies correctly

### HTTP Client
- Adds proper Authorization headers
- Includes Content-Type for JSON requests
- Handles query parameters correctly
- Processes array parameters properly

### Real API Integration
- Tests actual API endpoints
- Verifies authentication works with live API
- Handles network errors gracefully
- Validates response formats

## Environment Variables

For integration tests, you can set these environment variables:

- `BRON_API_KEY`: Your Bron API JWK key (required for real API tests)
- `BRON_WORKSPACE_ID`: Your workspace ID (required for real API tests)
- `BRON_API_URL`: Custom API URL (optional, defaults to https://api.bron.org)

## Test Output Examples

### Successful Unit Test
```
✅ JWK parsing successful
✅ JWT generation successful
✅ Client creation successful
✅ All authentication tests completed!
```

### Failed Authentication
```
❌ JWK parsing failed: Invalid or unsupported JWK format
```

### Real API Test (with credentials)
```
✅ Real client creation successful
✅ Real API call successful
```

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Make sure to run `npm install` first
2. **JWT generation fails**: Check that your JWK is in the correct EC P-256 format
3. **API calls fail**: Verify your API credentials and network connectivity
4. **TypeScript errors**: Ensure you're using Node.js 18+ and the correct TypeScript configuration

### Getting API Credentials

To get real API credentials for testing:
1. Contact Bron Labs support
2. Request API access for your workspace
3. Receive your JWK key and workspace ID
4. Set the environment variables as shown above

## Security Notes

- Never commit real API credentials to version control
- Use environment variables for sensitive data
- The mock JWK in tests is for testing only and has no real value
- Real API tests will make actual network calls 