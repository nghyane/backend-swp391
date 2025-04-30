/**
 * @swagger
 * components:
 *   parameters:
 *     IdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID của bản ghi
 *
 *     CampusIdParam:
 *       in: path
 *       name: campus_id
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID của cơ sở
 *
 *     MajorCodeParam:
 *       in: path
 *       name: major_code
 *       required: true
 *       schema:
 *         type: string
 *       description: Mã ngành học
 *
 *     MajorIdParam:
 *       in: path
 *       name: major_id
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID của ngành học
 *
 *     ScholarshipIdParam:
 *       in: path
 *       name: scholarship_id
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID của học bổng
 *
 *     DormitoryIdParam:
 *       in: path
 *       name: dormitory_id
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID của ký túc xá
 *
 *     AdmissionMethodIdParam:
 *       in: path
 *       name: admission_method_id
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID của phương thức xét tuyển
 *
 *     PlatformParam:
 *       in: path
 *       name: platform
 *       required: true
 *       schema:
 *         type: string
 *         enum: [zalo, facebook, hubspot]
 *       description: Nền tảng gửi webhook
 *
 *     AcademicYearQuery:
 *       in: query
 *       name: academic_year
 *       schema:
 *         type: integer
 *       description: "Năm học (ví dụ: 2024)"
 *
 *     NameQuery:
 *       in: query
 *       name: name
 *       schema:
 *         type: string
 *       description: Tìm kiếm theo tên
 *
 *     CampusIdQuery:
 *       in: query
 *       name: campus_id
 *       schema:
 *         type: integer
 *       description: Lọc theo ID cơ sở
 *
 *     CampusCodeQuery:
 *       in: query
 *       name: campus_code
 *       schema:
 *         type: string
 *       description: Lọc theo mã cơ sở
 *
 *     MajorIdQuery:
 *       in: query
 *       name: major_id
 *       schema:
 *         type: integer
 *       description: Lọc theo ID ngành học
 *
 *     MajorCodeQuery:
 *       in: query
 *       name: major_code
 *       schema:
 *         type: string
 *       description: Lọc theo mã ngành học
 *
 *     IsActiveQuery:
 *       in: query
 *       name: is_active
 *       schema:
 *         type: boolean
 *       description: Lọc theo trạng thái hoạt động
 *
 *   schemas:
 *     Campus:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của cơ sở
 *         name:
 *           type: string
 *           description: Tên cơ sở
 *         code:
 *           type: string
 *           description: Mã cơ sở
 *         address:
 *           type: string
 *           description: Địa chỉ cơ sở
 *         contact:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *               description: Số điện thoại liên hệ
 *             email:
 *               type: string
 *               description: Email liên hệ
 *           description: Thông tin liên hệ của cơ sở
 *         description:
 *           type: string
 *           description: Mô tả về cơ sở
 *       required:
 *         - name
 *         - code
 *
 *     Major:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của ngành học
 *         name:
 *           type: string
 *           description: Tên ngành học
 *         code:
 *           type: string
 *           description: Mã ngành học
 *         description:
 *           type: string
 *           description: Mô tả về ngành học
 *       required:
 *         - name
 *         - code
 *
 *     MajorCampusLink:
 *       type: object
 *       properties:
 *         major_id:
 *           type: integer
 *           description: ID của ngành học
 *         campus_id:
 *           type: integer
 *           description: ID của cơ sở
 *         academic_year:
 *           type: integer
 *           description: Năm học
 *         quota:
 *           type: integer
 *           description: Chỉ tiêu tuyển sinh
 *         tuition_fee:
 *           type: integer
 *           description: Học phí
 *       required:
 *         - major_id
 *         - campus_id
 *         - academic_year
 *
 *     Scholarship:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của học bổng
 *         name:
 *           type: string
 *           description: Tên học bổng
 *         description:
 *           type: string
 *           description: Mô tả về học bổng
 *         amount:
 *           type: number
 *           description: Giá trị học bổng
 *         condition:
 *           type: string
 *           description: "Điều kiện xét học bổng"
 *         major_id:
 *           type: integer
 *           description: ID của ngành học liên quan
 *         campus_id:
 *           type: integer
 *           description: ID của cơ sở liên quan
 *         application_url:
 *           type: string
 *           description: URL để đăng ký học bổng
 *       required:
 *         - name
 *         - amount
 *
 *     Dormitory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của ký túc xá
 *         name:
 *           type: string
 *           description: Tên ký túc xá
 *         campus_id:
 *           type: integer
 *           description: ID của cơ sở liên kết
 *         capacity:
 *           type: integer
 *           description: Sức chứa của ký túc xá
 *         description:
 *           type: string
 *           description: Mô tả về ký túc xá
 *       required:
 *         - name
 *         - campus_id
 *
 *     AdmissionMethod:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của phương thức xét tuyển
 *         name:
 *           type: string
 *           description: Tên phương thức xét tuyển
 *         description:
 *           type: string
 *           description: Mô tả về phương thức xét tuyển
 *         application_url:
 *           type: string
 *           description: URL để đăng ký xét tuyển
 *       required:
 *         - name
 *
 *     AdmissionMethodAssociate:
 *       type: object
 *       properties:
 *         admission_method_id:
 *           type: integer
 *           description: ID của phương thức xét tuyển
 *         major_id:
 *           type: integer
 *           description: ID của ngành học
 *         academic_year_id:
 *           type: integer
 *           description: ID của năm học
 *         campus_id:
 *           type: integer
 *           description: ID của cơ sở
 *         min_score:
 *           type: integer
 *           description: Điểm tối thiểu để xét tuyển
 *         is_active:
 *           type: boolean
 *           description: Trạng thái hoạt động
 *       required:
 *         - admission_method_id
 *         - major_id
 *         - academic_year_id
 *
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Trạng thái lỗi
 *         message:
 *           type: string
 *           description: Thông báo lỗi
 *         error:
 *           type: object
 *           description: Chi tiết lỗi
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           default: success
 *           description: Trạng thái thành công
 *         message:
 *           type: string
 *           description: Thông báo thành công
 *         data:
 *           type: object
 *           description: Dữ liệu trả về
 */
