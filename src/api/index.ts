import { Router } from "express";
import majorRoutes from "./routes/major.route";
import campusRoutes from "./routes/campus.route";
import scholarshipRoutes from "./routes/scholarship.route";
import dormitoryRoutes from "./routes/dormitory.route";
import admissionMethodRoutes from "./routes/admission-method.route";
import webhookRoutes from "./routes/webhook.route";
import authRoutes from "./routes/auth.route";
import hubspotRoutes from "./routes/hubspot.route";

const router = Router();

router.use("/majors", majorRoutes);
router.use("/campuses", campusRoutes);
router.use("/scholarships", scholarshipRoutes);
router.use("/dormitories", dormitoryRoutes);
router.use("/admission-methods", admissionMethodRoutes);
router.use("/webhooks", webhookRoutes);
router.use("/auth", authRoutes);
router.use("/hubspot", hubspotRoutes);

export default router;