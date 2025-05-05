/**
 * Dashboard Routes
 * Defines routes for dashboard statistics and data
 * All routes are restricted to admin users only
 */

import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { verifyTokenMiddleware, checkRole } from "../../middlewares/auth.middleware";
import { dashboardValidators } from "../../middlewares/validators/dashboard.validator";

const router = Router();

// Log when this module is loaded
console.log('Dashboard routes module loaded');

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Lấy thống kê tổng quan
 *     description: Endpoint này trả về thống kê tổng quan. Chỉ admin mới có thể truy cập.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê tổng quan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/OverallStats'
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get("/stats", verifyTokenMiddleware, checkRole(["admin"]), dashboardController.getOverallStats);

/**
 * @swagger
 * /dashboard/users:
 *   get:
 *     summary: Lấy thống kê người dùng
 *     description: Endpoint này trả về thống kê về người dùng hệ thống. Chỉ admin mới có thể truy cập.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/UserStats'
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get("/users", verifyTokenMiddleware, checkRole(["admin"]), dashboardController.getUserStats);

/**
 * @swagger
 * /dashboard/platforms:
 *   get:
 *     summary: Lấy thống kê theo nền tảng
 *     description: Endpoint này trả về thống kê theo nền tảng. Chỉ admin mới có thể truy cập.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê theo nền tảng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PlatformStats'
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get("/platforms", verifyTokenMiddleware, checkRole(["admin"]), dashboardController.getPlatformStats);

/**
 * @swagger
 * /dashboard/academic-years:
 *   get:
 *     summary: Lấy thống kê theo năm học
 *     description: Endpoint này trả về thống kê theo năm học. Chỉ admin mới có thể truy cập.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê theo năm học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AcademicYearStats'
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get("/academic-years", verifyTokenMiddleware, checkRole(["admin"]), dashboardController.getAcademicYearStats);

/**
 * @swagger
 * /dashboard/sessions:
 *   get:
 *     summary: Lấy thống kê phiên theo ngày
 *     description: Endpoint này trả về thống kê phiên theo ngày. Chỉ admin mới có thể truy cập.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/StartDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *     responses:
 *       200:
 *         description: Thống kê phiên theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SessionDateStats'
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get("/sessions", verifyTokenMiddleware, checkRole(["admin"]), dashboardValidators.dateRange, dashboardController.getSessionStatsByDate);

export default router;
