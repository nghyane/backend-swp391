import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { authenticateUser, authorizeRoles } from "../../middlewares/auth.middleware";

const router = Router();

// GET dashboard statistics - Only admin can access
router.get(
  "/stats", 
  authenticateUser, 
  authorizeRoles('admin'), 
  dashboardController.getDashboardStats
);

// GET detailed dashboard statistics - Only admin can access
router.get(
  "/detailed-stats", 
  authenticateUser, 
  authorizeRoles('admin'), 
  dashboardController.getDetailedStats
);

// GET statistics by campus - Only admin can access
router.get(
  "/stats/by-campus", 
  authenticateUser, 
  authorizeRoles('admin'), 
  dashboardController.getStatsByCampus
);

// GET statistics by academic year - Only admin can access
router.get(
  "/stats/by-academic-year", 
  authenticateUser, 
  authorizeRoles('admin'), 
  dashboardController.getStatsByAcademicYear
);

export default router; 