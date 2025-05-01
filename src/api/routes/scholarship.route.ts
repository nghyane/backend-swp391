import { Router } from "express";
import * as scholarshipController from "../controllers/scholarship.controller";
import { scholarshipValidators } from "../../middlewares/validators/scholarship.validator";
import { validateId, validateMajorCode } from "../../middlewares/validators/zod.validator";
import { verifyTokenMiddleware, checkRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /scholarships:
 *   get:
 *     summary: Lấy danh sách học bổng
 *     tags: [Scholarships]
 *     parameters:
 *       - $ref: '#/components/parameters/NameQuery'
 *       - $ref: '#/components/parameters/MajorCodeQuery'
 *       - $ref: '#/components/parameters/CampusCodeQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.get("/", scholarshipValidators.query, scholarshipController.getAllScholarships);

/**
 * @swagger
 * /scholarships/{id}:
 *   get:
 *     summary: Lấy thông tin học bổng theo ID
 *     tags: [Scholarships]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/:id", validateId, scholarshipController.getScholarshipById);

/**
 * @swagger
 * /scholarships/major/{majorCode}:
 *   get:
 *     summary: Lấy danh sách học bổng theo mã ngành
 *     tags: [Scholarships]
 *     parameters:
 *       - $ref: '#/components/parameters/MajorCodeParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/major/:majorCode", validateMajorCode, scholarshipController.getScholarshipsByMajor);

/**
 * @swagger
 * /scholarships:
 *   post:
 *     summary: Tạo học bổng mới
 *     tags: [Scholarships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Scholarship'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post("/", verifyTokenMiddleware, checkRole(["admin", "staff"]), scholarshipValidators.create, scholarshipController.createScholarship);

/**
 * @swagger
 * /scholarships/{id}:
 *   put:
 *     summary: Cập nhật thông tin học bổng
 *     tags: [Scholarships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Scholarship'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put("/:id", verifyTokenMiddleware, checkRole(["admin", "staff"]), validateId, scholarshipValidators.update, scholarshipController.updateScholarship);

/**
 * @swagger
 * /scholarships/{id}:
 *   delete:
 *     summary: Xóa học bổng
 *     tags: [Scholarships]
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
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete("/:id", verifyTokenMiddleware, checkRole(["admin", "staff"]), validateId, scholarshipController.deleteScholarship);

export default router;
