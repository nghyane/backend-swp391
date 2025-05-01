# Hướng dẫn triển khai dự án với Railway và Neon Database

Tài liệu này hướng dẫn cách triển khai dự án backend sử dụng Railway cho ứng dụng và Neon cho cơ sở dữ liệu PostgreSQL.

## Chuẩn bị

### 1. Tạo tài khoản và cơ sở dữ liệu trên Neon

1. Đăng ký tài khoản tại [Neon](https://neon.tech)
2. Tạo một dự án mới
3. Tạo một cơ sở dữ liệu mới trong dự án đó
4. Lấy connection string từ Neon (sẽ có dạng: `postgresql://username:password@hostname/database_name?sslmode=require`)

### 2. Tạo tài khoản Railway

1. Đăng ký tài khoản tại [Railway](https://railway.app)
2. Cài đặt Railway CLI: `npm i -g @railway/cli`
3. Đăng nhập vào Railway CLI: `railway login`

## Triển khai

### Phương pháp 1: Sử dụng script deploy.sh

1. Chạy lệnh sau để triển khai lên Railway:
   ```bash
   ./deploy.sh railway
   ```

### Phương pháp 2: Triển khai thủ công

1. Đăng nhập vào Railway CLI:
   ```bash
   railway login
   ```

2. Khởi tạo dự án Railway:
   ```bash
   railway init
   ```

3. Liên kết với dự án hiện có hoặc tạo dự án mới

4. Cấu hình các biến môi trường trên Railway:
   - `DATABASE_URL`: Connection string từ Neon
   - `JWT_SECRET`: Khóa bí mật cho JWT
   - `PORT`: 8080
   - Các biến môi trường khác từ file .env

5. Triển khai lên Railway:
   ```bash
   railway up
   ```

## Cấu hình cơ sở dữ liệu

Sau khi triển khai, bạn cần chạy migration để cập nhật cơ sở dữ liệu:

1. Truy cập vào Railway CLI:
   ```bash
   railway connect
   ```

2. Chạy lệnh migration:
   ```bash
   bun run db:push
   ```

## Kiểm tra triển khai

1. Kiểm tra logs:
   ```bash
   railway logs
   ```

2. Mở ứng dụng:
   ```bash
   railway open
   ```

## Xử lý sự cố

### Vấn đề kết nối cơ sở dữ liệu

- Kiểm tra connection string đã được cấu hình đúng chưa
- Kiểm tra IP của Railway có được cho phép trong cấu hình Neon không
- Kiểm tra logs để xem lỗi chi tiết

### Vấn đề triển khai

- Kiểm tra logs: `railway logs`
- Khởi động lại dịch vụ: `railway service restart`
