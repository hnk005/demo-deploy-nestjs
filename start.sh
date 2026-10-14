#!/bin/sh
set -e  # Bật chế độ tự động thoát khi có lỗi

echo "Running Unit Tests..."
pnpm run test

echo "Running E2E Tests..."
pnpm run test:e2e

echo "Starting Application..."
pnpm run start:prod
