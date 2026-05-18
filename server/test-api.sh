#!/usr/bin/env bash
set -e

BASE="http://localhost:4000/api"

echo "── 1. Login ──────────────────────────────────────────────"
LOGIN=$(curl -sf -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@northpine.test","password":"demopass123"}')

TOKEN=$(echo "$LOGIN" | jq -r '.token')
echo "Token: ${TOKEN:0:40}…"

AUTH=(-H "Authorization: Bearer $TOKEN")

echo ""
echo "── 2. GET /products ──────────────────────────────────────"
PRODUCTS=$(curl -sf "$BASE/products" "${AUTH[@]}")
COUNT=$(echo "$PRODUCTS" | jq 'length')
echo "Product count: $COUNT"

echo ""
echo "── 3. Pick first product ─────────────────────────────────"
PRODUCT=$(echo "$PRODUCTS" | jq '.[0]')
PRODUCT_ID=$(echo "$PRODUCT" | jq -r '._id')
PRODUCT_NAME=$(echo "$PRODUCT" | jq -r '.name')
STOCK_BEFORE=$(echo "$PRODUCT" | jq '.stock')
echo "ID:    $PRODUCT_ID"
echo "Name:  $PRODUCT_NAME"
echo "Stock: $STOCK_BEFORE"

echo ""
echo "── 4. POST /orders ───────────────────────────────────────"
ORDER=$(curl -sf -X POST "$BASE/orders" \
  -H "Content-Type: application/json" \
  "${AUTH[@]}" \
  -d "{\"lines\":[{\"productId\":\"$PRODUCT_ID\",\"qty\":1}],\"paymentMethod\":\"card\"}")

ORDER_NUM=$(echo "$ORDER" | jq -r '.orderNumber')
ORDER_TOT=$(echo "$ORDER" | jq '.total')
echo "Order number: $ORDER_NUM"
echo "Total:        $ORDER_TOT"

echo ""
echo "── 5. Verify stock decrement ─────────────────────────────"
REFRESHED=$(curl -sf "$BASE/products/$PRODUCT_ID" "${AUTH[@]}")
STOCK_AFTER=$(echo "$REFRESHED" | jq '.stock')
echo "Stock before: $STOCK_BEFORE"
echo "Stock after:  $STOCK_AFTER"

if [ "$STOCK_AFTER" -eq $(( STOCK_BEFORE - 1 )) ]; then
  echo "✓ Stock decremented correctly"
else
  echo "✗ Stock mismatch — expected $(( STOCK_BEFORE - 1 )), got $STOCK_AFTER" >&2
  exit 1
fi

echo ""
echo "All checks passed."
