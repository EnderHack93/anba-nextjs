#!/usr/bin/env bash
# Caching folders to speed up builds on Render
echo "Restoring cache..."
yarn install --immutable

echo "Building app..."
npm run build

echo "Saving cache..."
