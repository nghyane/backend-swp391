# Admission Consulting Chatbot Backend

Backend API và chatbot tư vấn tuyển sinh, cung cấp thông tin về ngành học, cơ sở, học bổng, ký túc xá và phương thức xét tuyển.

## Công nghệ sử dụng
- **Ngôn ngữ:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL với Drizzle ORM
- **Authentication:** JWT
- **Validation:** Zod
- **Documentation:** Swagger/OpenAPI

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
