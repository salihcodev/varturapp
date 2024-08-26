#!/bin/bash


# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install Docker first."
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo "Docker Compose is not installed. Please install Docker Compose first."
  exit 1
fi

# Both Docker and Docker Compose are installed
echo "Docker and Docker Compose are installed. Running docker-compose up --build..."

# Run docker-compose up with --build option
sudo docker-compose up --build
