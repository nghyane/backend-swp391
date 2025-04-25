import { Request, Response } from 'express';
import * as dashboardService from '../../services/dashboard.service';
import { catch$ } from '../../utils/catch';
import { reply } from '../../utils/response';

/**
 * Get dashboard statistics
 * Lấy tổng số lượng của tất cả các thực thể trong hệ thống
 */
export const getDashboardStats = catch$(async (req: Request, res: Response): Promise<void> => {
  const stats = await dashboardService.getDashboardStats();
  
  reply(res, stats, 'Lấy thống kê dashboard thành công');
});

/**
 * Get detailed dashboard statistics
 * Lấy thống kê chi tiết cho dashboard
 */
export const getDetailedStats = catch$(async (req: Request, res: Response): Promise<void> => {
  // Get all statistics in parallel to improve performance
  const [
    basicStats,
    majorsByCampus,
    scholarshipsByCampus,
    dormitoriesByCampus,
    majorsByAcademicYear,
    admissionMethodsByAcademicYear
  ] = await Promise.all([
    dashboardService.getDashboardStats(),
    dashboardService.getMajorsByCampus(),
    dashboardService.getScholarshipsByCampus(),
    dashboardService.getDormitoriesByCampus(),
    dashboardService.getMajorsByAcademicYear(),
    dashboardService.getAdmissionMethodsByAcademicYear()
  ]);
  
  reply(res, {
    basic_stats: basicStats,
    by_campus: {
      majors: majorsByCampus,
      scholarships: scholarshipsByCampus,
      dormitories: dormitoriesByCampus
    },
    by_academic_year: {
      majors: majorsByAcademicYear,
      admission_methods: admissionMethodsByAcademicYear
    }
  }, 'Lấy thống kê chi tiết thành công');
});

/**
 * Get statistics by campus
 * Lấy thống kê theo campus
 */
export const getStatsByCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  const [
    majorsByCampus,
    scholarshipsByCampus,
    dormitoriesByCampus
  ] = await Promise.all([
    dashboardService.getMajorsByCampus(),
    dashboardService.getScholarshipsByCampus(),
    dashboardService.getDormitoriesByCampus()
  ]);
  
  reply(res, {
    majors: majorsByCampus,
    scholarships: scholarshipsByCampus,
    dormitories: dormitoriesByCampus
  }, 'Lấy thống kê theo campus thành công');
});

/**
 * Get statistics by academic year
 * Lấy thống kê theo năm học
 */
export const getStatsByAcademicYear = catch$(async (req: Request, res: Response): Promise<void> => {
  const [
    majorsByAcademicYear,
    admissionMethodsByAcademicYear
  ] = await Promise.all([
    dashboardService.getMajorsByAcademicYear(),
    dashboardService.getAdmissionMethodsByAcademicYear()
  ]);
  
  reply(res, {
    majors: majorsByAcademicYear,
    admission_methods: admissionMethodsByAcademicYear
  }, 'Lấy thống kê theo năm học thành công');
}); 