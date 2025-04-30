import { Router } from "express";
import * as scholarshipController from "../controllers/scholarship.controller";
import { scholarshipValidators } from "../../middlewares/validators/scholarship.validator";
import { validateId } from "../../middlewares/validators/zod.validator";

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
 * /scholarships:
 *   post:
 *     summary: Tạo học bổng mới
 *     tags: [Scholarships]
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
 */
router.post("/", scholarshipValidators.create, scholarshipController.createScholarship);

/**
 * @swagger
 * /scholarships/{id}:
 *   put:
 *     summary: Cập nhật thông tin học bổng
 *     tags: [Scholarships]
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
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put("/:id", validateId, scholarshipValidators.update, scholarshipController.updateScholarship);

/**
 * @swagger
 * /scholarships/{id}:
 *   delete:
 *     summary: Xóa học bổng
 *     tags: [Scholarships]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete("/:id", validateId, scholarshipController.deleteScholarship);

export default router;
