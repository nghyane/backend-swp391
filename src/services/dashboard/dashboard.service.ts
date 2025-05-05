/**
 * Dashboard Service
 * Provides functions to calculate statistics and aggregated data for the dashboard
 */

import { db } from "@db/index";
import { sql, count } from "drizzle-orm";
import {
  majors,
  campuses,
  dormitories,
  scholarships,
  admissionMethods,
  sessions,
  internalUsers,
  majorCampusAdmission,
  academicYears
} from "@db/schema";
import { createNamespace } from "@utils/pino-logger";

const logger = createNamespace('dashboard-service');

/**
 * Overall statistics interface
 */
export interface OverallStats {
  total_majors: number;
  total_campuses: number;
  total_dormitories: number;
  total_scholarships: number;
  total_admission_methods: number;
  total_sessions: number;
  total_users: number;
}

/**
 * Platform statistics interface
 */
export interface PlatformStats {
  platform: string;
  session_count: number;
  percentage: number;
}

/**
 * Academic year statistics interface
 */
export interface AcademicYearStats {
  year: number;
  major_count: number;
  admission_count: number;
}

/**
 * User statistics interface
 */
export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  admin_count: number;
  staff_count: number;
}

/**
 * Get overall statistics for the dashboard
 * @returns Overall statistics
 */
export const getOverallStats = async (): Promise<OverallStats> => {
  try {
    // Get counts from each table
    const [
      majorsCount,
      campusesCount,
      dormitoriesCount,
      scholarshipsCount,
      admissionMethodsCount,
      sessionsCount,
      usersCount
    ] = await Promise.all([
      db.select({ count: count() }).from(majors).then(result => result[0].count),
      db.select({ count: count() }).from(campuses).then(result => result[0].count),
      db.select({ count: count() }).from(dormitories).then(result => result[0].count),
      db.select({ count: count() }).from(scholarships).then(result => result[0].count),
      db.select({ count: count() }).from(admissionMethods).then(result => result[0].count),
      db.select({ count: count() }).from(sessions).then(result => result[0].count),
      db.select({ count: count() }).from(internalUsers).then(result => result[0].count)
    ]);

    return {
      total_majors: Number(majorsCount) || 0,
      total_campuses: Number(campusesCount) || 0,
      total_dormitories: Number(dormitoriesCount) || 0,
      total_scholarships: Number(scholarshipsCount) || 0,
      total_admission_methods: Number(admissionMethodsCount) || 0,
      total_sessions: Number(sessionsCount) || 0,
      total_users: Number(usersCount) || 0
    };
  } catch (error) {
    logger.error(error, 'Error getting overall statistics');
    return {
      total_majors: 0,
      total_campuses: 0,
      total_dormitories: 0,
      total_scholarships: 0,
      total_admission_methods: 0,
      total_sessions: 0,
      total_users: 0
    };
  }
};

/**
 * Get user statistics for the dashboard
 * @returns User statistics
 */
export const getUserStats = async (): Promise<UserStats> => {
  try {
    // Get user counts by status and role
    const [
      totalUsers,
      activeUsers,
      adminCount,
      staffCount
    ] = await Promise.all([
      db.select({ count: count() }).from(internalUsers).then(result => result[0].count),
      db.select({ count: count() }).from(internalUsers)
        .where(sql`${internalUsers.is_active} = true`)
        .then(result => result[0].count),
      db.select({ count: count() }).from(internalUsers)
        .where(sql`${internalUsers.role} = 'admin'`)
        .then(result => result[0].count),
      db.select({ count: count() }).from(internalUsers)
        .where(sql`${internalUsers.role} = 'staff'`)
        .then(result => result[0].count)
    ]);

    return {
      total_users: Number(totalUsers) || 0,
      active_users: Number(activeUsers) || 0,
      inactive_users: Number(totalUsers - activeUsers) || 0,
      admin_count: Number(adminCount) || 0,
      staff_count: Number(staffCount) || 0
    };
  } catch (error) {
    logger.error(error, 'Error getting user statistics');
    return {
      total_users: 0,
      active_users: 0,
      inactive_users: 0,
      admin_count: 0,
      staff_count: 0
    };
  }
};

/**
 * Get platform statistics for the dashboard
 * @returns Platform statistics
 */
export const getPlatformStats = async (): Promise<PlatformStats[]> => {
  try {
    // Get session counts by platform
    const platformCounts = await db
      .select({
        platform: sessions.platform,
        count: count()
      })
      .from(sessions)
      .groupBy(sessions.platform);

    // Calculate total sessions
    const totalSessions = platformCounts.reduce((sum, item) => sum + Number(item.count), 0);

    // Calculate percentages
    return platformCounts.map(item => ({
      platform: item.platform || 'unknown',
      session_count: Number(item.count),
      percentage: totalSessions > 0 ? Number(item.count) / totalSessions * 100 : 0
    }));
  } catch (error) {
    logger.error(error, 'Error getting platform statistics');
    return [];
  }
};

/**
 * Get academic year statistics for the dashboard
 * @returns Academic year statistics
 */
export const getAcademicYearStats = async (): Promise<AcademicYearStats[]> => {
  try {
    // Get all academic years
    const years = await db.select().from(academicYears);

    // Get statistics for each academic year
    const stats = await Promise.all(
      years.map(async (year) => {
        try {
          // Count majors offered in this academic year
          const majorCount = await db
            .select({ count: count() })
            .from(majorCampusAdmission)
            .where(sql`${majorCampusAdmission.academic_year_id} = ${year.id}`)
            .then(result => result[0].count);

          // Count distinct majors in this academic year as a proxy for admission methods
          const admissionCount = await db
            .select({ count: count(sql`DISTINCT ${majorCampusAdmission.major_id}`) })
            .from(majorCampusAdmission)
            .where(sql`${majorCampusAdmission.academic_year_id} = ${year.id}`)
            .then(result => result[0].count);

          return {
            year: year.year,
            major_count: Number(majorCount),
            admission_count: Number(admissionCount)
          };
        } catch (error) {
          logger.error(error, `Error getting statistics for academic year ${year.year}`);
          return {
            year: year.year,
            major_count: 0,
            admission_count: 0
          };
        }
      })
    );

    return stats;
  } catch (error) {
    logger.error(error, 'Error getting academic year statistics');
    return [];
  }
};

/**
 * Get session statistics by date range
 * @param startDate Start date (optional)
 * @param endDate End date (optional)
 * @returns Session counts by date
 */
export const getSessionStatsByDate = async (
  _startDate?: Date,
  _endDate?: Date
): Promise<{ date: string; count: number }[]> => {
  try {
    // We don't use date range since sessions table doesn't have created_at
    // But we keep the parameters for API consistency

    // Since the sessions table doesn't have a created_at field,
    // we'll just count all sessions and return a single data point
    const totalSessions = await db.select({ count: count() }).from(sessions).then(result => result[0].count);

    // Return a single data point with today's date
    return [{
      date: new Date().toISOString().split('T')[0],
      count: Number(totalSessions)
    }];
  } catch (error) {
    logger.error(error, 'Error getting session statistics by date');
    return [];
  }
};
