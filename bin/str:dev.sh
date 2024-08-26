#!/bin/bash



# Check if node_modules directory exists
if [ ! -d "node_modules" ]; then
  echo "node_modules directory not found. Running npm install..."
  npm install
else
  echo "node_modules directory exists. Skipping npm install..."
fi

# Run the development server
npm run dev