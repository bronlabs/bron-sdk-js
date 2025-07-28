export interface MessagesForSigning {
  messages?: { hashFunction?: "none" | "sha256d" | "keccak256" | "blake2b256" | "sha256" | "sha512" | "sha512_half" | "sha512_256" | "poseidon"; keyType?: "secp256k1" | "edwards25519" | "BLS12381G1" | "pallas" | "RSA4096"; message?: string; signatureScheme?: "ecdsa" | "eddsa" | "bls" | "schnorr" | "rsa-pss"; signatureVariant?: "zilliqa" | "mina" }[];
  publicKey?: string;
  useBackupPrimitive?: boolean;
}
