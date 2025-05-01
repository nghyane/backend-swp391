/**
 * Session Routes
 * Defines routes for session management
 */

import { Router } from "express";
import * as sessionController from "../controllers/session.controller";
import { sessionValidators } from "@middlewares/validators/session.validator";
import { verifyTokenMiddleware, checkRole } from "@middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Lấy danh sách phiên người dùng
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PlatformQuery'
 *       - $ref: '#/components/parameters/AnonymousQuery'
 *       - $ref: '#/components/parameters/HubspotContactIdQuery'
 *       - $ref: '#/components/parameters/NameQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get("/", verifyTokenMiddleware, checkRole(["admin", "staff"]), sessionValidators.query, sessionController.getAllSessions);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Lấy thông tin phiên theo ID
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SessionIdParam'
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
router.get("/:id", verifyTokenMiddleware, checkRole(["admin", "staff"]), sessionValidators.sessionId, sessionController.getSessionById);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Xóa phiên
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SessionIdParam'
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
router.delete("/:id", verifyTokenMiddleware, checkRole(["admin", "staff"]), sessionValidators.sessionId, sessionController.deleteSession);

export default router;
