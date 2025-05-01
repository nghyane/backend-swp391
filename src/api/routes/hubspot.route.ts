/**
 * HubSpot Routes
 * Defines routes for HubSpot integration
 */

import { Router } from "express";
import * as hubspotController from "../controllers/hubspot.controller";
import { hubspotValidators } from "@/middlewares/validators/hubspot.validator";

const router = Router();

/**
 * @swagger
 * /hubspot/contact:
 *   post:
 *     summary: Tạo hoặc cập nhật contact trên HubSpot và liên kết với session
 *     tags: [HubSpot]
 *     description: Kiểm tra email trên HubSpot, tạo contact mới nếu chưa tồn tại, và liên kết contact ID với session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - session_id
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email của người dùng
 *               session_id:
 *                 type: string
 *                 description: ID của phiên cần liên kết với contact
 *               firstname:
 *                 type: string
 *                 description: Tên của người dùng
 *               lastname:
 *                 type: string
 *                 description: Họ của người dùng
 *               phone:
 *                 type: string
 *                 description: Số điện thoại của người dùng
 *               school:
 *                 type: string
 *                 description: Trường học của người dùng
 *               school_rank:
 *                 type: string
 *                 description: Xếp hạng trường học
 *     responses:
 *       200:
 *         description: Contact đã được tạo/cập nhật và liên kết với session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: HubSpot contact created and linked to session
 *                 data:
 *                   type: object
 *                   properties:
 *                     contact_id:
 *                       type: string
 *                       description: ID của contact trên HubSpot
 *                     session_id:
 *                       type: string
 *                       description: ID của phiên đã liên kết
 *                     email:
 *                       type: string
 *                       description: Email của contact
 *                     created:
 *                       type: boolean
 *                       description: true nếu contact mới được tạo, false nếu đã tồn tại và được cập nhật
 *       404:
 *         description: Không tìm thấy session
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/contact", hubspotValidators.createOrUpdateContact, hubspotController.createOrUpdateContact);

export default router;
