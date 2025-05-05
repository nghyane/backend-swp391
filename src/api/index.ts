import { Router } from "express";
import majorRoutes from "./routes/major.route";
import majorCampusRoutes from "./routes/major-campus.route";
import campusRoutes from "./routes/campus.route";
import scholarshipRoutes from "./routes/scholarship.route";
import dormitoryRoutes from "./routes/dormitory.route";
import admissionMethodRoutes from "./routes/admission-method.route";
import webhookRoutes from "./routes/webhook.route";
import authRoutes from "./routes/auth.route";
import hubspotRoutes from "./routes/hubspot.route";
import sessionRoutes from "./routes/session.route";
import academicYearRoutes from "./routes/academic-year.route";
import dashboardRoutes from "./routes/dashboard.route";

const router = Router();

router.use("/majors", majorRoutes);
router.use("/majors", majorCampusRoutes);
router.use("/campuses", campusRoutes);
router.use("/scholarships", scholarshipRoutes);
router.use("/dormitories", dormitoryRoutes);
router.use("/admission-methods", admissionMethodRoutes);
router.use("/webhooks", webhookRoutes);
router.use("/auth", authRoutes);
router.use("/hubspot", hubspotRoutes);
router.use("/sessions", sessionRoutes);
router.use("/academic-years", academicYearRoutes);
// Add dashboard routes with debug logging
console.log('Registering dashboard routes');
router.use("/dashboard", (req, res, next) => {
  console.log(`Dashboard route accessed: ${req.method} ${req.path}`);
  next();
}, dashboardRoutes);

export default router;