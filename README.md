# Admission Consulting Chatbot Backend

Backend API và chatbot tư vấn tuyển sinh, cung cấp thông tin về ngành học, cơ sở, học bổng, ký túc xá và phương thức xét tuyển.

## Công nghệ sử dụng
- **Ngôn ngữ:** TypeScript
- **Runtime:** Bun
- **Framework:** Express.js
- **Database:** PostgreSQL với Drizzle ORM
- **Authentication:** JWT (với Argon2)
- **Validation:** Zod
- **Documentation:** Swagger/OpenAPI
- **Logging:** Pino
- **Deployment:** Docker & Railway

## Tính năng chính
- **API thông tin tuyển sinh:** Ngành học, cơ sở, học bổng, ký túc xá, phương thức xét tuyển
- **Chatbot tư vấn:** Tích hợp với Zalo OA, xử lý tin nhắn tự nhiên
- **Quản lý phiên:** Lưu trữ lịch sử tương tác và thông tin người dùng
- **Admin Panel:** Quản lý dữ liệu và theo dõi thống kê
- **HubSpot Integration:** Đồng bộ thông tin liên hệ

## Cài đặt và chạy

### Yêu cầu
- Node.js 18+ và Bun
- PostgreSQL database
- HubSpot API key (cho tính năng tích hợp HubSpot)

### Cài đặt
```bash
# Clone repository
git clone https://github.com/nghyane/backend-swp391.git
cd backend-swp391

# Cài đặt dependencies
bun install

# Thiết lập biến môi trường
cp .env.example .env
# Chỉnh sửa .env với thông tin database và cấu hình khác

# Chạy server phát triển
bun dev
```

### Cấu hình HubSpot
1. Đăng ký tài khoản HubSpot Developer (https://developers.hubspot.com/)
2. Tạo Private App và lấy API key
3. Thêm API key vào biến môi trường `HUBSPOT_ACCESS_TOKEN` trong file .env
4. Sử dụng API `/api/hubspot/contact` để tạo hoặc cập nhật contact và liên kết với session

### Cấu hình Zalo OA
1. Đăng ký tài khoản Zalo Developer (https://developers.zalo.me/)
2. Tạo ứng dụng Zalo OA và lấy App ID, App Secret
3. Lấy Access Token và Refresh Token theo hướng dẫn của Zalo
4. Thêm các thông tin vào biến môi trường:
   - `ZALO_APP_ID`: ID của ứng dụng Zalo
   - `ZALO_APP_SECRET`: Secret key của ứng dụng Zalo
   - `ZALO_APP_ACCESS_TOKEN`: Access token để gọi Zalo API
   - `ZALO_APP_REFRESH_TOKEN`: Refresh token để làm mới access token khi hết hạn
5. Hoặc lưu các token vào database (xem phần Quản lý Token)

### Quản lý Token
Hệ thống hỗ trợ lưu trữ token tích hợp (Zalo) trong database:

1. **Di chuyển token từ .env vào database**:
   ```bash
   bun run token:migrate
   ```

2. **Làm mới token Zalo**:
   ```bash
   bun run token:refresh-zalo
   ```
   Lệnh này sẽ sử dụng refresh token để lấy access token mới và refresh token mới từ Zalo API. Nên chạy định kỳ trước khi token hết hạn (access token có thời hạn 1 giờ, refresh token có thời hạn 3 tháng và chỉ dùng được một lần).

3. **Cấu trúc lưu trữ**:
   - Token được lưu trong bảng `integration_tokens`
   - Mỗi token được xác định bởi `provider` (ví dụ: 'zalo') và `token_type` (ví dụ: 'access_token', 'refresh_token')
   - Đối với Zalo, hệ thống sẽ tự động sử dụng token từ database, nếu không tìm thấy sẽ dùng token từ biến môi trường
   - Đối với HubSpot, token luôn được lấy từ biến môi trường

#### Sử dụng HubSpot API
```
POST /api/hubspot/contact
```

Body:
```json
{
  "email": "example@example.com",
  "session_id": "session_123456",
  "firstname": "Nguyen",
  "lastname": "Van A",
  "phone": "0123456789",
  "school": "FPT University",
  "school_rank": "Top 10"
}
```

Chỉ có `email` và `session_id` là bắt buộc, các trường khác là tùy chọn. API sẽ:
- Kiểm tra xem email đã tồn tại trên HubSpot chưa
- Nếu đã tồn tại: cập nhật thông tin và liên kết contact ID với session
- Nếu chưa tồn tại: tạo contact mới và liên kết ID với session
- Cập nhật trạng thái `anonymous` của session thành `false`

### Tài liệu API
Khi server đang chạy, truy cập tài liệu API tại:
```
http://localhost:4000/docs
```

## Triển khai trên Railway

### Chuẩn bị
1. Đăng ký tài khoản trên [Railway](https://railway.app/)
2. Cài đặt Railway CLI (tùy chọn):
   ```bash
   npm i -g @railway/cli
   railway login
   ```

### Triển khai
1. **Sử dụng Railway Dashboard**:
   - Tạo project mới trên Railway
   - Liên kết với GitHub repository
   - Railway sẽ tự động phát hiện `railway.toml` và `Dockerfile`

2. **Sử dụng Railway CLI**:
   ```bash
   # Từ thư mục dự án
   railway link # Liên kết với project đã tạo
   railway up   # Triển khai ứng dụng
   ```

### Thiết lập biến môi trường
1. **Thông qua Railway Dashboard**:
   - Vào project > Service > Variables
   - Thêm các biến môi trường cần thiết:
     - `DATABASE_URL` (tự động nếu sử dụng PostgreSQL của Railway)
     - `JWT_SECRET`
     - `HUBSPOT_ACCESS_TOKEN`
     - Các biến khác theo yêu cầu

2. **Thông qua Railway CLI**:
   ```bash
   railway variables set JWT_SECRET=your_secret_key
   railway variables set HUBSPOT_ACCESS_TOKEN=your_hubspot_token
   ```

3. **Tham chiếu biến từ service khác**:
   - Trong `railway.toml`, bạn có thể tham chiếu biến từ service khác:
   ```toml
   [variables]
   DATABASE_URL = "${{postgres.DATABASE_URL}}"
   ```

### Cấu hình Railway
Dự án đã được cấu hình sẵn với:
- `railway.toml`: Cấu hình build và deploy
- `Dockerfile`: Multi-stage build tối ưu cho Bun
- Healthcheck và restart policy

### Theo dõi và quản lý
- Xem logs: Railway Dashboard > Service > Logs
- Theo dõi metrics: Railway Dashboard > Service > Metrics
- Quản lý deployments: Railway Dashboard > Service > Deployments

## Quy tắc phát triển
- Sử dụng TypeScript strict mode
- Controllers chỉ xử lý request/response
- Services chứa business logic
- Sử dụng logger thay vì console.log
- Tuân thủ quy tắc đặt tên và commit (xem `.commitrules`)

## Cấu trúc thư mục
```
src/
├── api/           # Routes và controllers
├── db/            # Kết nối và schema database
├── middlewares/   # Middlewares (auth, error, validation)
├── services/      # Business logic
└── utils/         # Tiện ích
```

---

© 2025 SWP391 Team. All Rights Reserved.
