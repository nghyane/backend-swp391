import { Router } from "express";
import * as campusController from "../controllers/campus.controller";
import { campusValidators } from "../../middlewares/validators/campus.validator";
import { validateId } from "../../middlewares/validators/zod.validator";

const router = Router();

/**
 * @swagger
 * /campuses:
 *   get:
 *     summary: Lấy danh sách cơ sở
 *     tags: [Campuses]
 *     parameters:
 *       - $ref: '#/components/parameters/NameQuery'
 *       - $ref: '#/components/parameters/CampusCodeQuery'
 *     responses:
 *       200:
 *         description: Danh sách cơ sở
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/", campusValidators.query, campusController.getAllCampuses);

/**
 * @swagger
 * /campuses/{id}:
 *   get:
 *     summary: Lấy thông tin cơ sở theo ID
 *     tags: [Campuses]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Thông tin cơ sở
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/:id", validateId, campusController.getCampusById);

/**
 * @swagger
 * /campuses/{id}/majors:
 *   get:
 *     summary: Lấy danh sách ngành học của cơ sở
 *     tags: [Campuses]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *       - $ref: '#/components/parameters/AcademicYearQuery'
 *     responses:
 *       200:
 *         description: Danh sách ngành học của cơ sở
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/:id/majors", validateId, campusController.getCampusMajors);

/**
 * @swagger
 * /campuses:
 *   post:
 *     summary: Tạo cơ sở mới
 *     tags: [Campuses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campus'
 *     responses:
 *       201:
 *         description: Cơ sở đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post("/", campusValidators.create, campusController.createCampus);

/**
 * @swagger
 * /campuses/{id}:
 *   put:
 *     summary: Cập nhật thông tin cơ sở
 *     tags: [Campuses]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campus'
 *     responses:
 *       200:
 *         description: Cơ sở đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.put("/:id", validateId, campusValidators.update, campusController.updateCampus);

/**
 * @swagger
 * /campuses/{id}:
 *   delete:
 *     summary: Xóa cơ sở
 *     tags: [Campuses]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Cơ sở đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.delete("/:id", validateId, campusController.deleteCampus);

export default router;
