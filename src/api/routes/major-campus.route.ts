import { Router } from "express";
import * as majorCampusController from "../controllers/major-campus.controller";
import { majorCampusValidators } from "../../middlewares/validators/major-campus.validator";
import { validateId, validateMajorId } from "../../middlewares/validators/zod.validator";
import { verifyTokenMiddleware, checkRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /majors/{major_id}/campus-admissions:
 *   get:
 *     summary: Lấy danh sách liên kết ngành học với cơ sở
 *     tags: [Major Campus Admissions]
 *     parameters:
 *       - $ref: '#/components/parameters/MajorIdParam'
 *       - $ref: '#/components/parameters/AcademicYearQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/:major_id/campus-admissions", validateMajorId, majorCampusValidators.query, majorCampusController.getMajorCampusAdmissions);

/**
 * @swagger
 * /majors/{major_id}/campus-admissions:
 *   post:
 *     summary: Thêm liên kết ngành học với cơ sở
 *     tags: [Major Campus Admissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/MajorIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MajorCampusAdd'
 *     responses:
 *       201:
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
router.post("/:major_id/campus-admissions", verifyTokenMiddleware, checkRole(["admin", "staff"]), validateMajorId, majorCampusValidators.add, majorCampusController.addMajorCampusAdmission);

/**
 * @swagger
 * /majors/{major_id}/campus-admissions/{campus_id}/{academic_year}:
 *   put:
 *     summary: Cập nhật liên kết ngành học với cơ sở
 *     tags: [Major Campus Admissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/MajorIdParam'
 *       - $ref: '#/components/parameters/CampusIdParam'
 *       - $ref: '#/components/parameters/AcademicYearParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MajorCampusUpdate'
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
router.put("/:major_id/campus-admissions/:campus_id/:academic_year", verifyTokenMiddleware, checkRole(["admin", "staff"]), majorCampusValidators.params, majorCampusValidators.update, majorCampusController.updateMajorCampusAdmission);

/**
 * @swagger
 * /majors/{major_id}/campus-admissions/{campus_id}/{academic_year}:
 *   delete:
 *     summary: Xóa liên kết ngành học với cơ sở
 *     tags: [Major Campus Admissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/MajorIdParam'
 *       - $ref: '#/components/parameters/CampusIdParam'
 *       - $ref: '#/components/parameters/AcademicYearParam'
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
router.delete("/:major_id/campus-admissions/:campus_id/:academic_year", verifyTokenMiddleware, checkRole(["admin", "staff"]), majorCampusValidators.params, majorCampusController.deleteMajorCampusAdmission);

export default router;
