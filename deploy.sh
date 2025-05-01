#!/bin/bash

# Kiểm tra tham số
if [ "$1" == "railway" ]; then
  # Triển khai lên Railway
  echo "Đang triển khai ứng dụng lên Railway..."

  # Kiểm tra xem Railway CLI đã được cài đặt chưa
  if ! command -v railway &> /dev/null; then
    echo "Railway CLI chưa được cài đặt. Đang cài đặt..."
    npm i -g @railway/cli
  fi

  # Đăng nhập vào Railway (nếu chưa đăng nhập)
  railway login

  # Triển khai lên Railway
  railway up

  echo "Ứng dụng đã được triển khai lên Railway thành công!"
  echo "Bạn có thể kiểm tra trạng thái triển khai tại: https://railway.app/dashboard"

else
  # Triển khai cục bộ bằng Docker
  echo "Đang triển khai ứng dụng cục bộ..."
  docker-compose down
  docker-compose build
  docker-compose up -d

  echo "Ứng dụng đã được triển khai cục bộ thành công!"
  echo "API có thể truy cập tại: http://localhost:3000"
fi
