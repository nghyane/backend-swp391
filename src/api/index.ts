import { Router } from "express";
import majorRoutes from "./routes/major.route";
import campusRoutes from "./routes/campus.route";
import sessionRoutes from "./routes/session.route";
import scholarshipRoutes from "./routes/scholarship.route";
import dormitoryRoutes from "./routes/dormitory.route";
import admissionMethodRoutes from "./routes/admission-method.route";
import zaloWebhookRoutes from "./routes/zalo-webhook.route";

const router = Router();

router.use("/majors", majorRoutes);
router.use("/campuses", campusRoutes);
router.use("/sessions", sessionRoutes);
router.use("/scholarships", scholarshipRoutes);
router.use("/dormitories", dormitoryRoutes);
router.use("/admission-methods", admissionMethodRoutes);
router.use("/chatbot/zalo/webhook", zaloWebhookRoutes);

export default router;