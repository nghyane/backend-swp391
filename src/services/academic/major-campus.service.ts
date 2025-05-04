/**
 * Major-Campus Service
 * Provides functions to manage relationships between majors and campuses
 */

import { eq, and } from 'drizzle-orm';
import { db } from '@db/index';
import {
  majors,
  campuses,
  academicYears,
  majorCampusAdmission
} from '@db/schema';
import { NotFoundError } from '@utils/errors';
import { createNamespace } from '@utils/pino-logger';

const logger = createNamespace('major-campus-service');

// ===== HELPER FUNCTIONS =====

/**
 * Get academic year ID from calendar year
 * @param year Academic year (e.g., 2024 for 2024-2025)
 * @returns Academic year ID or null if not found
 */
const getAcademicYearId = async (year: number): Promise<number | null> => {
  const record = await db.query.academicYears.findFirst({
    where: eq(academicYears.year, year),
    columns: { id: true }
  });
  return record ? record.id : null;
};

// ===== EXPORTED SERVICE FUNCTIONS =====

/**
 * Get all campus admissions for a major
 * @param majorId Major ID
 * @param academicYear Optional academic year filter
 * @returns Array of campus admissions for the major
 * @throws NotFoundError if major not found
 */
export const getMajorCampusAdmissions = async (majorId: number, academicYear?: number) => {
  // Check if major exists
  const major = await db.query.majors.findFirst({
    where: eq(majors.id, majorId),
    columns: { id: true, name: true }
  });
  
  if (!major) throw new NotFoundError('Major', majorId);

  // Build query conditions
  const conditions = [eq(majorCampusAdmission.major_id, majorId)];
  
  // Add academic year filter if provided
  if (academicYear) {
    const yearId = await getAcademicYearId(academicYear);
    if (!yearId) return []; // Year not found, return empty array
    conditions.push(eq(majorCampusAdmission.academic_year_id, yearId));
  }

  // Get campus admissions
  return await db.query.majorCampusAdmission.findMany({
    where: and(...conditions),
    with: {
      campus: true,
      academicYear: true
    }
  });
};

/**
 * Add a campus admission for a major
 * @param majorId Major ID
 * @param campusId Campus ID
 * @param academicYear Academic year (calendar year)
 * @param quota Optional quota for this major at this campus
 * @param tuitionFee Optional tuition fee for this major at this campus
 * @returns Created campus admission
 * @throws NotFoundError if major or campus not found
 * @throws Error if academic year not found or link already exists
 */
export const addMajorCampusAdmission = async (
  majorId: number,
  campusId: number,
  academicYear: number,
  quota?: number,
  tuitionFee?: number
) => {
  // Check if major exists
  const major = await db.query.majors.findFirst({
    where: eq(majors.id, majorId),
    columns: { id: true, name: true }
  });
  if (!major) throw new NotFoundError('Major', majorId);

  // Check if campus exists
  const campus = await db.query.campuses.findFirst({
    where: eq(campuses.id, campusId),
    columns: { id: true, name: true }
  });
  if (!campus) throw new NotFoundError('Campus', campusId);

  // Get academic year ID
  const yearId = await getAcademicYearId(academicYear);
  if (!yearId) throw new Error(`Academic year ${academicYear} not found`);

  // Check if link already exists
  const existingLink = await db.query.majorCampusAdmission.findFirst({
    where: and(
      eq(majorCampusAdmission.major_id, majorId),
      eq(majorCampusAdmission.campus_id, campusId),
      eq(majorCampusAdmission.academic_year_id, yearId)
    )
  });

  if (existingLink) {
    throw new Error(`Major ${major.name} is already linked to campus ${campus.name} for academic year ${academicYear}`);
  }

  // Insert new link
  const [newLink] = await db.insert(majorCampusAdmission).values({
    major_id: majorId,
    campus_id: campusId,
    academic_year_id: yearId,
    quota: quota,
    tuition_fee: tuitionFee
  }).returning();

  logger.info(`Linked major ${major.name} to campus ${campus.name} for academic year ${academicYear}`);

  // Return the created link with relations
  return await db.query.majorCampusAdmission.findFirst({
    where: eq(majorCampusAdmission.id, newLink.id),
    with: {
      major: true,
      campus: true,
      academicYear: true
    }
  });
};

/**
 * Update a campus admission for a major
 * @param majorId Major ID
 * @param campusId Campus ID
 * @param academicYear Academic year (calendar year)
 * @param quota Optional quota for this major at this campus
 * @param tuitionFee Optional tuition fee for this major at this campus
 * @returns Updated campus admission
 * @throws NotFoundError if major, campus, or link not found
 * @throws Error if academic year not found
 */
export const updateMajorCampusAdmission = async (
  majorId: number,
  campusId: number,
  academicYear: number,
  quota?: number,
  tuitionFee?: number
) => {
  // Get academic year ID
  const yearId = await getAcademicYearId(academicYear);
  if (!yearId) throw new Error(`Academic year ${academicYear} not found`);

  // Check if link exists
  const existingLink = await db.query.majorCampusAdmission.findFirst({
    where: and(
      eq(majorCampusAdmission.major_id, majorId),
      eq(majorCampusAdmission.campus_id, campusId),
      eq(majorCampusAdmission.academic_year_id, yearId)
    ),
    with: {
      major: { columns: { name: true } },
      campus: { columns: { name: true } }
    }
  });

  if (!existingLink) {
    throw new NotFoundError('Major-Campus link', `Major ID ${majorId}, Campus ID ${campusId}, Year ${academicYear}`);
  }

  // Update link
  const [updatedLink] = await db.update(majorCampusAdmission)
    .set({
      quota: quota !== undefined ? quota : existingLink.quota,
      tuition_fee: tuitionFee !== undefined ? tuitionFee : existingLink.tuition_fee
    })
    .where(eq(majorCampusAdmission.id, existingLink.id))
    .returning();

  logger.info(`Updated link between major ${existingLink.major.name} and campus ${existingLink.campus.name} for academic year ${academicYear}`);

  // Return the updated link with relations
  return await db.query.majorCampusAdmission.findFirst({
    where: eq(majorCampusAdmission.id, updatedLink.id),
    with: {
      major: true,
      campus: true,
      academicYear: true
    }
  });
};

/**
 * Delete a campus admission for a major
 * @param majorId Major ID
 * @param campusId Campus ID
 * @param academicYear Academic year (calendar year)
 * @throws NotFoundError if link not found
 * @throws Error if academic year not found
 */
export const deleteMajorCampusAdmission = async (
  majorId: number,
  campusId: number,
  academicYear: number
) => {
  // Get academic year ID
  const yearId = await getAcademicYearId(academicYear);
  if (!yearId) throw new Error(`Academic year ${academicYear} not found`);

  // Check if link exists
  const existingLink = await db.query.majorCampusAdmission.findFirst({
    where: and(
      eq(majorCampusAdmission.major_id, majorId),
      eq(majorCampusAdmission.campus_id, campusId),
      eq(majorCampusAdmission.academic_year_id, yearId)
    ),
    with: {
      major: { columns: { name: true } },
      campus: { columns: { name: true } }
    }
  });

  if (!existingLink) {
    throw new NotFoundError('Major-Campus link', `Major ID ${majorId}, Campus ID ${campusId}, Year ${academicYear}`);
  }

  // Delete link
  await db.delete(majorCampusAdmission).where(eq(majorCampusAdmission.id, existingLink.id));

  logger.info(`Deleted link between major ${existingLink.major.name} and campus ${existingLink.campus.name} for academic year ${academicYear}`);
};
