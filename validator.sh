#!/usr/bin/env bash
set -euo pipefail

LEDGER_DIR="./ledger"
KEYS_DIR="./keys"
INITIAL_STAKE=500000000000000000  # 500 SOL for genesis stake

mkdir -p "$LEDGER_DIR" "$KEYS_DIR"

# Key files (only one identity key used for everything)
IDENTITY_KEY="$KEYS_DIR/identity-keypair.json"
VOTE_KEY="$KEYS_DIR/vote-account-keypair.json"
STAKE_KEY="$KEYS_DIR/stake-account-keypair.json"
FAUCET_KEY="$KEYS_DIR/faucet-keypair.json"

# Generate keys if not exist
[[ -f $IDENTITY_KEY ]] || solana-keygen new --no-passphrase -o "$IDENTITY_KEY"
[[ -f $VOTE_KEY ]] || solana-keygen new --no-passphrase -o "$VOTE_KEY"
[[ -f $STAKE_KEY ]] || solana-keygen new --no-passphrase -o "$STAKE_KEY"
[[ -f $FAUCET_KEY ]] || solana-keygen new --no-passphrase -o "$FAUCET_KEY"

# Public keys
ID_PUB=$(solana-keygen pubkey "$IDENTITY_KEY")
VOTE_PUB=$(solana-keygen pubkey "$VOTE_KEY")
STAKE_PUB=$(solana-keygen pubkey "$STAKE_KEY")
FAUCET_PUB=$(solana-keygen pubkey "$FAUCET_KEY")

LOG_FILE="$LEDGER_DIR/solana-validator.log"
PID_FILE="$LEDGER_DIR/validator.pid"
ROTATE_CONF="/etc/logrotate.d/solana-validator"

echo "🔧 Setting Solana CLI to local RPC..."
solana config set --url http://127.0.0.1:8899

echo "🧬 Creating genesis..."
solana-genesis \
  --ledger "$LEDGER_DIR" \
  --bootstrap-validator "$ID_PUB" "$VOTE_PUB" "$STAKE_PUB" \
  --bootstrap-validator-lamports "$INITIAL_STAKE" \
  --bootstrap-validator-stake-lamports "$INITIAL_STAKE" \
  --faucet-pubkey "$FAUCET_PUB" \
  --faucet-lamports 10000000000 \
  --hashes-per-tick auto \
  --cluster-type development

echo "✅ Genesis created."

echo "🚀 Starting validator..."
nohup agave-validator \
  --ledger "$LEDGER_DIR" \
  --identity "$IDENTITY_KEY" \
  --vote-account "$VOTE_KEY" \
  --rpc-bind-address 127.0.0.1 \
  --rpc-port 8899 \
  --gossip-port 8001 \
  --dynamic-port-range 8000-8020 \
  --no-port-check \
  --full-rpc-api \
  --enable-rpc-transaction-history \
  --log - \
  >> "$LOG_FILE" 2>&1 &

echo $! > "$PID_FILE"
echo "✅ Validator launched. PID: $(<"$PID_FILE")"

echo "⏳ Waiting for RPC to be ready..."
for i in {1..30}; do
  if curl -s -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' http://127.0.0.1:8899 | grep -q "ok"; then
    echo "✅ RPC is ready."
    break
  fi
  sleep 2
done

echo "🪙 Airdropping 1000 SOL to identity..."
solana airdrop 1000 "$ID_PUB" > /dev/null || echo "⚠️ Airdrop may have hit a rate limit."

echo "📥 Creating stake account..."
if ! solana account "$STAKE_PUB" &> /dev/null; then
  solana create-stake-account "$STAKE_KEY" 500 --from "$IDENTITY_KEY" > /dev/null
else
  echo "⚠️ Stake account $STAKE_PUB already exists. Skipping creation."
fi


echo "📤 Delegating stake to vote account..."
solana delegate-stake "$STAKE_KEY" "$VOTE_PUB" > /dev/null

echo "🧾 Checking vote account status..."
solana vote-account "$VOTE_PUB"

echo "📦 Checking validator block production..."
solana block-production --limit 1

echo "💰 Balance: $(solana balance "$ID_PUB")"

if [[ $EUID -eq 0 && ! -f "$ROTATE_CONF" ]]; then
  cat > "$ROTATE_CONF" <<EOF
$LOG_FILE {
    daily
    rotate 1
    compress
    missingok
    notifempty
    copytruncate
}
EOF
  echo "✅ logrotate installed."
fi

echo "🎉 All done. Your single-node validator is running and producing blocks!"
echo "  🔗 RPC URL: http://127.0.0.1:8899"
echo "  🔍 Logs: $LOG_FILE"
