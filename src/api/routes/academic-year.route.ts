import { Router } from "express";
import * as academicYearController from "@controllers/academic-year.controller";
import { academicYearValidators } from "@middlewares/validators/academic-year.validator";
import { validateId } from "@middlewares/validators/zod.validator";
import { verifyTokenMiddleware, checkRole } from "@middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /academic-years:
 *   get:
 *     summary: Lấy danh sách năm học
 *     tags: [Academic Years]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 */
router.get("/", academicYearController.getAllAcademicYears);

/**
 * @swagger
 * /academic-years/current:
 *   get:
 *     summary: Lấy năm học hiện tại
 *     tags: [Academic Years]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/current", academicYearController.getCurrentAcademicYear);

/**
 * @swagger
 * /academic-years/{id}:
 *   get:
 *     summary: Lấy thông tin năm học theo ID
 *     tags: [Academic Years]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của năm học
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/:id", validateId, academicYearController.getAcademicYearById);

/**
 * @swagger
 * /academic-years:
 *   post:
 *     summary: Tạo năm học mới
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *                 description: Năm học (ví dụ 2024 cho năm học 2024-2025)
 *             required:
 *               - year
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
router.post("/", verifyTokenMiddleware, checkRole(["admin", "staff"]), academicYearValidators.create, academicYearController.createAcademicYear);

/**
 * @swagger
 * /academic-years/{id}:
 *   delete:
 *     summary: Xóa năm học
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của năm học
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
router.delete("/:id", verifyTokenMiddleware, checkRole(["admin"]), validateId, academicYearController.deleteAcademicYear);

export default router;
