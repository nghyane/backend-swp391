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
 *       - $ref: '#/components/parameters/MajorIdQuery'
 *       - $ref: '#/components/parameters/MajorCodeQuery'
 *       - $ref: '#/components/parameters/CampusIdQuery'
 *       - $ref: '#/components/parameters/CampusCodeQuery'
 *     responses:
 *       200:
 *         description: Danh sách học bổng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
 *         description: Thông tin học bổng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
 *         description: Học bổng đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
 *         description: Học bổng đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
 *         description: Học bổng đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.delete("/:id", validateId, scholarshipController.deleteScholarship);

export default router;
