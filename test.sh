#!/bin/bash
set -e

RPC_URL="http://127.0.0.1:8899"

echo "🧪 Testing Solana RPC Endpoints on $RPC_URL"
echo "=========================================="

# Helper function for making RPC calls
function test_rpc() {
    local method=$1
    echo "🔹 $method:"
    RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
        -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"$method\"}" \
        $RPC_URL)

    echo "$RESPONSE" | jq . || echo "⚠️  jq failed to parse response"
    echo "Raw response received"
    echo
}

# Run tests
test_rpc getHealth
test_rpc getVersion
test_rpc getSlot
test_rpc getBlockHeight
test_rpc getGenesisHash

echo "✅ RPC Testing Complete!"
