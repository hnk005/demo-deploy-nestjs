#!/bin/sh
pnpm run test:unit
pnpm run test:e2e
pnpm run start:prod
