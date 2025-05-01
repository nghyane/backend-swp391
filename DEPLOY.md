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

### Phương pháp 1: Sử dụng Railway Dashboard

1. Đăng nhập vào [Railway Dashboard](https://railway.app)
2. Tạo một dự án mới
3. Chọn "Deploy from GitHub repo"
4. Chọn repository của dự án
5. Railway sẽ tự động phát hiện `railway.toml` và `Dockerfile`
6. Cấu hình các biến môi trường (xem phần dưới)

### Phương pháp 2: Sử dụng Railway CLI

1. Đăng nhập vào Railway CLI:
   ```bash
   railway login
   ```

2. Liên kết với dự án hiện có hoặc tạo dự án mới:
   ```bash
   railway link
   ```

3. Triển khai lên Railway:
   ```bash
   railway up
   ```

### Cấu hình biến môi trường

Cấu hình các biến môi trường trên Railway Dashboard:
- Truy cập vào dự án > Service > Variables
- Thêm các biến môi trường cần thiết:
  - `DATABASE_URL`: Connection string từ Neon
  - `JWT_SECRET`: Khóa bí mật cho JWT (nên tạo một chuỗi ngẫu nhiên an toàn)
  - `HUBSPOT_ACCESS_TOKEN`: Token truy cập HubSpot API
  - Các biến khác theo yêu cầu

Hoặc sử dụng Railway CLI:
```bash
railway variables set DATABASE_URL=postgresql://username:password@hostname/database_name?sslmode=require
railway variables set JWT_SECRET=your_secret_key
railway variables set HUBSPOT_ACCESS_TOKEN=your_hubspot_token
```

## Cấu hình cơ sở dữ liệu

Sau khi triển khai, bạn cần chạy migration để cập nhật cơ sở dữ liệu:

1. Sử dụng Railway CLI để kết nối với service:
   ```bash
   railway connect
   ```

2. Chạy lệnh migration:
   ```bash
   bun run db:push
   ```

Hoặc bạn có thể cấu hình pre-deploy command trong `railway.toml`:
```toml
[deploy]
preDeployCommand = ["bun run db:push"]
```

## Kiểm tra triển khai

1. Truy cập vào Railway Dashboard để xem trạng thái triển khai
2. Kiểm tra logs để đảm bảo ứng dụng đã khởi động thành công
3. Truy cập API documentation tại đường dẫn được cung cấp bởi Railway + `/docs`
   (Ví dụ: `https://your-app-name.railway.app/docs`)

## Xử lý sự cố

Nếu gặp vấn đề khi triển khai:

1. Kiểm tra logs trên Railway Dashboard
2. Đảm bảo tất cả biến môi trường bắt buộc đã được cấu hình
3. Kiểm tra kết nối đến cơ sở dữ liệu Neon
4. Đảm bảo Dockerfile đã được cấu hình đúng
5. Kiểm tra healthcheck endpoint (`/health`) đang hoạt động đúng

## Các lệnh Railway hữu ích

1. Xem logs:
   ```bash
   railway logs
   ```

2. Mở ứng dụng trong trình duyệt:
   ```bash
   railway open
   ```

3. Khởi động lại dịch vụ:
   ```bash
   railway service restart
   ```

4. Xem thông tin về dịch vụ:
   ```bash
   railway status
   ```

5. Xem biến môi trường:
   ```bash
   railway variables
   ```

## Xử lý sự cố phổ biến

### Vấn đề kết nối cơ sở dữ liệu

- Kiểm tra connection string đã được cấu hình đúng chưa
- Kiểm tra IP của Railway có được cho phép trong cấu hình Neon không
- Kiểm tra logs để xem lỗi chi tiết
- Đảm bảo cơ sở dữ liệu Neon đang hoạt động và không ở chế độ ngủ

### Vấn đề triển khai

- Kiểm tra logs để xem lỗi chi tiết
- Đảm bảo Dockerfile không có lỗi
- Kiểm tra các biến môi trường bắt buộc đã được cấu hình đầy đủ
- Kiểm tra healthcheck endpoint (`/health`) đang hoạt động đúng

### Vấn đề với Bun

- Đảm bảo Dockerfile sử dụng phiên bản Bun phù hợp
- Kiểm tra logs để xem lỗi liên quan đến Bun
- Đảm bảo các dependencies đã được cài đặt đúng
