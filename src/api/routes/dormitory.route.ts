import { Router } from "express";
import * as dormitoryController from "../controllers/dormitory.controller";
import { dormitoryValidators } from "../../middlewares/validators/dormitory.validator";
import { validateId } from "../../middlewares/validators/zod.validator";

const router = Router();

/**
 * @swagger
 * /dormitories:
 *   get:
 *     summary: Lấy danh sách ký túc xá
 *     tags: [Dormitories]
 *     parameters:
 *       - $ref: '#/components/parameters/NameQuery'
 *       - $ref: '#/components/parameters/CampusIdQuery'
 *       - $ref: '#/components/parameters/CampusCodeQuery'
 *     responses:
 *       200:
 *         description: Danh sách ký túc xá
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/", dormitoryValidators.query, dormitoryController.getAllDormitories);

/**
 * @swagger
 * /dormitories/{id}:
 *   get:
 *     summary: Lấy thông tin ký túc xá theo ID
 *     tags: [Dormitories]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Thông tin ký túc xá
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/:id", validateId, dormitoryController.getDormitoryById);

/**
 * @swagger
 * /dormitories:
 *   post:
 *     summary: Tạo ký túc xá mới
 *     tags: [Dormitories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dormitory'
 *     responses:
 *       201:
 *         description: Ký túc xá đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post("/", dormitoryValidators.create, dormitoryController.createDormitory);

/**
 * @swagger
 * /dormitories/{id}:
 *   put:
 *     summary: Cập nhật thông tin ký túc xá
 *     tags: [Dormitories]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dormitory'
 *     responses:
 *       200:
 *         description: Ký túc xá đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.put("/:id", validateId, dormitoryValidators.update, dormitoryController.updateDormitory);

/**
 * @swagger
 * /dormitories/{id}:
 *   delete:
 *     summary: Xóa ký túc xá
 *     tags: [Dormitories]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Ký túc xá đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.delete("/:id", validateId, dormitoryController.deleteDormitory);

export default router;
