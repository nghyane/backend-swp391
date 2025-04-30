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
 *       - $ref: '#/components/parameters/CampusCodeQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
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
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
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
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete("/:id", validateId, dormitoryController.deleteDormitory);

export default router;
