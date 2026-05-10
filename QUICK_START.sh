#!/bin/bash

# Quick Start Guide - Traffic Violation System

echo "🚀 Starting Traffic Violation System..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Step 1: Installing backend dependencies...${NC}"
cd backend
npm install || { echo "Failed to install backend deps"; exit 1; }
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
echo ""

echo -e "${YELLOW}📦 Step 2: Installing frontend dependencies...${NC}"
cd ../frontend
npm install || { echo "Failed to install frontend deps"; exit 1; }
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
echo ""

echo -e "${YELLOW}🔧 Step 3: Configuration Check${NC}"
if [ -f ../backend/.env ]; then
    echo -e "${GREEN}✅ Backend .env file exists${NC}"
else
    echo -e "${RED}❌ Backend .env file missing${NC}"
fi
echo ""

echo -e "${GREEN}✨ Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}📝 To start the application:${NC}"
echo ""
echo "1️⃣  Start Backend (in one terminal):"
echo -e "   ${YELLOW}cd backend && npm start${NC}"
echo ""
echo "2️⃣  Start Frontend (in another terminal):"
echo -e "   ${YELLOW}cd frontend && npm start${NC}"
echo ""
echo "3️⃣  Open browser:"
echo -e "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "${GREEN}🎯 Test Credentials (after registration):${NC}"
echo "   Email: test@example.com"
echo "   Password: password123"
echo ""
