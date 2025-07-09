#!/bin/bash

# Display Dynamix Studio - Remote Access Startup Script
# This script starts both frontend and backend for remote network access

echo "🚀 Starting Display Dynamix Studio for Remote Access..."
echo ""

# Get the local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo "📍 Your local IP address: $LOCAL_IP"
echo ""

# Start backend server
echo "🔧 Starting backend server..."
cd backend
python run.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://$LOCAL_IP:9002"
echo "   Backend API: http://$LOCAL_IP:8000"
echo "   API Docs: http://$LOCAL_IP:8000/docs"
echo ""
echo "🔑 Default login credentials:"
echo "   Username: admin"
echo "   Password: admin"
echo ""
echo "⚠️  Make sure your firewall allows connections on ports 8000 and 9002"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 