import { Router } from "express";
import * as majorController from "../controllers/major.controller";
import { majorValidators } from "../../middlewares/validators/major.validator";
import { validateId, validateCampusId, validateMajorCode } from "../../middlewares/validators/zod.validator";
import { verifyTokenMiddleware, checkRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /majors:
 *   get:
 *     summary: Lấy danh sách ngành học
 *     tags: [Majors]
 *     parameters:
 *       - $ref: '#/components/parameters/AcademicYearQuery'
 *       - $ref: '#/components/parameters/NameQuery'
 *       - $ref: '#/components/parameters/MajorCodeQuery'
 *       - $ref: '#/components/parameters/CampusCodeQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 */
router.get("/", majorValidators.query, majorController.getAllMajors);

/**
 * @swagger
 * /majors/campus/{campus_id}:
 *   get:
 *     summary: Lấy danh sách ngành học theo cơ sở
 *     tags: [Majors]
 *     parameters:
 *       - $ref: '#/components/parameters/CampusIdParam'
 *       - $ref: '#/components/parameters/AcademicYearQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 */
router.get("/campus/:campus_id", validateCampusId, majorValidators.query, majorController.getMajorsByCampus);

/**
 * @swagger
 * /majors/{major_code}:
 *   get:
 *     summary: Lấy thông tin ngành học theo mã
 *     tags: [Majors]
 *     parameters:
 *       - $ref: '#/components/parameters/MajorCodeParam'
 *       - $ref: '#/components/parameters/AcademicYearQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 */
router.get("/:major_code", validateMajorCode, majorController.getMajorByCode);

/**
 * @swagger
 * /majors:
 *   post:
 *     summary: Tạo ngành học mới
 *     tags: [Majors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Major'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post("/", verifyTokenMiddleware, checkRole(["admin", "staff"]), majorValidators.create, majorController.createMajor);

/**
 * @swagger
 * /majors/{id}:
 *   put:
 *     summary: Cập nhật thông tin ngành học
 *     tags: [Majors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Major'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.put("/:id", verifyTokenMiddleware, checkRole(["admin", "staff"]), validateId, majorValidators.update, majorController.updateMajor);

/**
 * @swagger
 * /majors/{id}:
 *   delete:
 *     summary: Xóa ngành học
 *     tags: [Majors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.delete("/:id", verifyTokenMiddleware, checkRole(["admin", "staff"]), validateId, majorController.deleteMajor);

export default router;
