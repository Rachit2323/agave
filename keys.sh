#!/usr/bin/env bash
set -euo pipefail

# Directory for storing keys
KEYS_DIR="./keys"

# Keypair file paths
IDENTITY_KEY="$KEYS_DIR/identity-keypair.json"
VOTE_KEY="$KEYS_DIR/vote-account-keypair.json"
STAKE_KEY="$KEYS_DIR/stake-account-keypair.json"
STAKE_KEY_NEW="$KEYS_DIR/stake-account-manual-keypair.json"
FAUCET_KEY="$KEYS_DIR/faucet-keypair.json"

# Create keys directory if it doesn't exist
echo "📁 Creating keys directory at $KEYS_DIR..."
mkdir -p "$KEYS_DIR"

# Function to generate a keypair
generate_keypair() {
    local keypair_path="$1"
    local keypair_name="$2"
    
    echo "🔑 Generating $keypair_name keypair..."
    solana-keygen new --no-bip39-passphrase -so "$keypair_path" --force > /dev/null
    
    local pubkey=$(solana-keygen pubkey "$keypair_path")
    echo "   ✅ $keypair_name created"
    echo "   📋 Public key: $pubkey"
    echo "   📄 Saved to: $keypair_path"
    echo ""
}

echo "🚀 Starting keypair generation..."
echo ""

# Generate all keypairs
generate_keypair "$IDENTITY_KEY" "Identity"
generate_keypair "$VOTE_KEY" "Vote Account"
generate_keypair "$STAKE_KEY" "Stake Account"
generate_keypair "$STAKE_KEY_NEW" "Manual Stake Account"
generate_keypair "$FAUCET_KEY" "Faucet"

echo "🎉 All keypairs generated successfully!"
echo ""
echo "📋 Summary:"
echo "   Identity:           $(solana-keygen pubkey "$IDENTITY_KEY")"
echo "   Vote Account:       $(solana-keygen pubkey "$VOTE_KEY")"
echo "   Stake Account:      $(solana-keygen pubkey "$STAKE_KEY")"
echo "   Manual Stake:       $(solana-keygen pubkey "$STAKE_KEY_NEW")"
echo "   Faucet:             $(solana-keygen pubkey "$FAUCET_KEY")"
echo ""
echo "⚠️  IMPORTANT: Keep these keypairs secure! They contain your validator's secrets."
echo "💡 You can now run your validator setup script."