# Danh sách việc cần làm cho MVP (Minimum Viable Product)

## API và Controllers (Đã hoàn thành)

### Majors ✅
- [x] API lấy danh sách ngành học
- [x] API lấy thông tin ngành học theo Code
- [x] API lấy danh sách ngành học theo cơ sở

### Campuses ✅
- [x] API lấy danh sách cơ sở
- [x] API lấy thông tin cơ sở theo ID, Code

### Dormitories ✅
- [x] API lấy danh sách ký túc xá
- [x] API lấy thông tin ký túc xá theo ID

### Admission Methods ✅
- [x] API lấy danh sách phương thức xét tuyển
- [x] API lấy danh sách phương thức xét tuyển theo mã ngành

### Scholarships ✅
- [x] API lấy danh sách học bổng
- [x] API lấy thông tin học bổng theo ID
- [x] API lấy danh sách học bổng theo mã ngành

## Webhook và Tích hợp

### Zalo Integration ✅
- [x] API xử lý webhook từ Zalo
- [x] Service xử lý tin nhắn từ người dùng Zalo
- [x] Service quản lý phiên người dùng

## Admin Panel (Cần phát triển)

### Xác thực và Phân quyền ✅
- [x] Tạo auth service:
  - Tạo src/services/auth/auth.service.ts với các hàm login, validateToken
  - Sử dụng bcrypt để xác thực mật khẩu với password_hash
  - Sử dụng JWT để tạo và xác thực token
- [x] Tạo auth controller:
  - Tạo src/api/controllers/auth.controller.ts với các hàm login, logout
  - Sử dụng catch$ để xử lý lỗi
- [x] Tạo auth route:
  - Tạo src/api/routes/auth.route.ts với endpoints POST /login và POST /logout
  - Thêm route vào src/api/index.ts
- [x] Tạo auth middleware:
  - Tạo src/middlewares/auth.middleware.ts với các hàm verifyToken, checkRole
  - Sử dụng để bảo vệ các API admin

### Quản lý Dữ liệu (API đã có, cần thêm xác thực) ✅
- [x] Thêm xác thực cho API CRUD ngành học:
  - Thêm middleware verifyToken vào các routes POST, PUT, DELETE trong major.route.ts
  - Thêm middleware checkRole với quyền admin/staff
- [x] Thêm xác thực cho API CRUD cơ sở:
  - Thêm middleware verifyToken vào các routes POST, PUT, DELETE trong campus.route.ts
  - Thêm middleware checkRole với quyền admin/staff
- [x] Thêm xác thực cho API CRUD ký túc xá:
  - Thêm middleware verifyToken vào các routes POST, PUT, DELETE trong dormitory.route.ts
  - Thêm middleware checkRole với quyền admin/staff
- [x] Thêm xác thực cho API CRUD phương thức xét tuyển:
  - Thêm middleware verifyToken vào các routes POST, PUT, DELETE trong admission-method.route.ts
  - Thêm middleware checkRole với quyền admin/staff
- [x] Thêm xác thực cho API CRUD học bổng:
  - Thêm middleware verifyToken vào các routes POST, PUT, DELETE trong scholarship.route.ts
  - Thêm middleware checkRole với quyền admin/staff

### Quản lý Người dùng và Phiên
- [x] Tạo session controller:
  - Tạo src/api/controllers/session.controller.ts với các hàm getAllSessions, getSessionById, deleteSession
  - Sử dụng catch$ để xử lý lỗi
- [x] Tạo session route:
  - Tạo src/api/routes/session.route.ts với endpoints GET /sessions, GET /sessions/:id, DELETE /sessions/:id
  - Thêm route vào src/api/index.ts
  - Bảo vệ route với auth middleware
- [ ] Tạo admin user controller:
  - Tạo src/api/controllers/admin-user.controller.ts với các hàm CRUD cho internal_users
  - Sử dụng catch$ để xử lý lỗi
- [ ] Tạo admin user route:
  - Tạo src/api/routes/admin-user.route.ts với endpoints CRUD
  - Thêm route vào src/api/index.ts
  - Bảo vệ route với auth middleware và checkRole

### Dashboard
- [ ] Tạo dashboard service:
  - Tạo src/services/dashboard/dashboard.service.ts với hàm getUserStats
  - Sử dụng truy vấn SQL để tính toán thống kê người dùng từ bảng sessions
- [ ] Tạo dashboard controller:
  - Tạo src/api/controllers/dashboard.controller.ts với hàm getUserStats
  - Sử dụng catch$ để xử lý lỗi
- [ ] Tạo dashboard route:
  - Tạo src/api/routes/dashboard.route.ts với endpoint GET /dashboard/users
  - Thêm route vào src/api/index.ts
  - Bảo vệ route với auth middleware

## Tính năng cần ưu tiên phát triển

### HubSpot Integration (MVP) ✅
- [x] Tích hợp cơ bản với HubSpot API - đã có trong hubspot.service.ts
- [x] Tạo types và validator cho HubSpot contact API:
  - Tạo interface HubSpotContactRequest trong src/types/hubspot.types.ts
  - Tạo schema Zod trong src/middlewares/validators/hubspot.validator.ts
  - Tạo middleware validator sử dụng validateZod
- [x] Tạo controller và route (không cần authentication):
  - Tạo src/api/controllers/hubspot.controller.ts với hàm createOrUpdateContact
  - Tạo src/api/routes/hubspot.route.ts với endpoint POST /api/hubspot/contact
  - Thêm route vào src/api/index.ts (không bảo vệ bằng auth middleware)
- [x] Triển khai logic xử lý trong controller:
  - Kiểm tra email trên HubSpot (sử dụng searchContactsByEmail)
  - Nếu email đã tồn tại: lấy contact ID và gán cho session hiện tại
  - Nếu email chưa tồn tại: tạo contact mới (với tên và email) và gán ID cho session
  - Hỗ trợ cập nhật các trường bổ sung như school, phone
  - Cập nhật bảng sessions với hubspot_contact_id

### Cải thiện Chatbot
- [ ] Cải thiện xử lý lỗi trong quá trình xử lý webhook:
  - Thêm try/catch blocks trong zalo.service.ts
  - Thêm logging chi tiết hơn
  - Thêm cơ chế retry cho các API calls thất bại
- [ ] Cải thiện việc gửi tin nhắn đến AI Agent:
  - Thêm timeout và retry logic
  - Thêm xử lý cho các trường hợp AI Agent không phản hồi
  - Thêm caching để tránh gọi API quá nhiều lần

## Tối ưu hóa cần thiết

### Database ✅
- [x] Bảng lưu trữ thông tin admin users (internal_users) đã có sẵn
- [x] Cấu trúc database hiện tại đã đủ cho MVP

### Security ✅
- [x] Cài đặt và sử dụng argon2 để xác thực mật khẩu (password_hash đã có trong bảng) - Đủ cho MVP
- [x] Thêm JWT cho xác thực API admin:
  - Cài đặt thư viện jsonwebtoken
  - Tạo các hàm generateToken và verifyToken trong auth.service.ts
  - Lưu secret key trong biến môi trường

### Documentation
- [x] Cập nhật tài liệu API khi thêm các endpoint mới:
  - Thêm JSDoc comments cho các routes mới
  - Thêm định nghĩa Swagger trong src/docs/components
  - Đảm bảo tất cả các parameters và responses được mô tả đầy đủ
  - Cập nhật tài liệu Swagger để phản ánh yêu cầu xác thực cho các API CRUD
- [x] Cập nhật README với hướng dẫn chi tiết hơn:
  - Thêm hướng dẫn cài đặt và cấu hình HubSpot
  - Thêm hướng dẫn sử dụng API admin
  - Thêm hướng dẫn triển khai
- [ ] Thêm tài liệu API cho phần admin:
  - Thêm mô tả cho các API auth
  - Thêm mô tả cho các API quản lý người dùng và phiên
  - Thêm mô tả cho API dashboard/users

### Deployment ✅
- [x] Tạo script deployment cho production:
  - [x] Tạo Dockerfile cho ứng dụng (Dockerfile.prod đã có)
  - [x] Cấu hình Railway deployment (railway.toml đã có)
  - [x] Tạo hướng dẫn triển khai (DEPLOY.md đã có)
- [x] Thiết lập monitoring cơ bản:
  - [x] Thêm logging chi tiết hơn (đã sử dụng Pino)
  - [x] Thêm health check endpoint (đã có /health endpoint)
