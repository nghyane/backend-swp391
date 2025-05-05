/**
 * Dashboard Controller
 * Handles requests for dashboard statistics and data
 */

import { Request, Response } from "express";
import * as dashboardService from "@/services/dashboard/dashboard.service";
import { catch$ } from "@/utils/catch";
import { reply } from "@/utils/response";

/**
 * Get overall statistics
 * This endpoint returns overall statistics for the dashboard
 */
export const getOverallStats = catch$(async (req: Request, res: Response): Promise<void> => {
  const stats = await dashboardService.getOverallStats();
  reply(res, stats, 'Overall statistics retrieved successfully');
});

/**
 * Get user statistics
 * This endpoint returns user statistics for the dashboard
 */
export const getUserStats = catch$(async (req: Request, res: Response): Promise<void> => {
  const stats = await dashboardService.getUserStats();
  reply(res, stats, 'User statistics retrieved successfully');
});

/**
 * Get platform statistics
 * This endpoint returns platform statistics for the dashboard
 */
export const getPlatformStats = catch$(async (req: Request, res: Response): Promise<void> => {
  const stats = await dashboardService.getPlatformStats();
  reply(res, stats, 'Platform statistics retrieved successfully');
});

/**
 * Get academic year statistics
 * This endpoint returns academic year statistics for the dashboard
 */
export const getAcademicYearStats = catch$(async (req: Request, res: Response): Promise<void> => {
  const stats = await dashboardService.getAcademicYearStats();
  reply(res, stats, 'Academic year statistics retrieved successfully');
});

/**
 * Get session statistics by date
 * This endpoint returns session statistics by date for the dashboard
 */
export const getSessionStatsByDate = catch$(async (req: Request, res: Response): Promise<void> => {
  // Get validated query parameters
  const validatedQuery = req.validatedQuery || {};

  // Parse date parameters
  const startDate = validatedQuery.start_date ? new Date(validatedQuery.start_date as string) : undefined;
  const endDate = validatedQuery.end_date ? new Date(validatedQuery.end_date as string) : undefined;

  const stats = await dashboardService.getSessionStatsByDate(startDate, endDate);
  reply(res, stats, 'Session statistics retrieved successfully');
});
