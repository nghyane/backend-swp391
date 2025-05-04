/**
 * Academic Year Service
 * Provides functions to interact with academic year data
 */

import { eq, SQL } from 'drizzle-orm';
import { db } from '@db/index';
import { academicYears } from '@db/schema';
import { NotFoundError } from '@utils/errors';
import { createNamespace } from '@utils/pino-logger';

const logger = createNamespace('academic-year-service');

/**
 * Get all academic years
 * @returns Array of all academic years
 */
export const getAllAcademicYears = async () => {
  return await db.query.academicYears.findMany({
    orderBy: (academicYears, { desc }) => [desc(academicYears.year)]
  });
};

/**
 * Get academic year by ID
 * @param id Academic year ID
 * @returns Academic year
 * @throws NotFoundError if academic year not found
 */
export const getAcademicYearById = async (id: number) => {
  const result = await db.query.academicYears.findFirst({
    where: eq(academicYears.id, id)
  });

  if (!result) throw new NotFoundError('AcademicYear', id);
  return result;
};

/**
 * Get academic year by calendar year
 * @param year Calendar year (e.g., 2024 for 2024-2025)
 * @returns Academic year
 * @throws NotFoundError if academic year not found
 */
export const getAcademicYearByYear = async (year: number) => {
  const result = await db.query.academicYears.findFirst({
    where: eq(academicYears.year, year)
  });

  if (!result) throw new NotFoundError('AcademicYear', year.toString());
  return result;
};

/**
 * Create a new academic year
 * @param year Calendar year (e.g., 2024 for 2024-2025)
 * @returns Created academic year
 * @throws Error if academic year with the same year already exists
 */
export const createAcademicYear = async (year: number) => {
  // Check if academic year with the same year already exists
  const existingYear = await db.query.academicYears.findFirst({
    where: eq(academicYears.year, year),
    columns: { id: true }
  });

  if (existingYear) {
    throw new Error(`Academic year ${year} already exists`);
  }

  // Insert new academic year into database
  const [newYear] = await db.insert(academicYears).values({ year }).returning();

  logger.info(`Created new academic year: ${newYear.year}`);
  return newYear;
};

/**
 * Delete an academic year
 * @param id Academic year ID
 * @throws NotFoundError if academic year not found
 */
export const deleteAcademicYear = async (id: number): Promise<void> => {
  // Check if academic year exists
  await getAcademicYearById(id);

  // Delete the academic year
  await db.delete(academicYears).where(eq(academicYears.id, id));
  logger.info(`Deleted academic year with ID: ${id}`);
};

/**
 * Get current academic year
 * @returns Current academic year (current calendar year)
 * @throws NotFoundError if current academic year not found
 */
export const getCurrentAcademicYear = async () => {
  const currentYear = new Date().getFullYear();
  return await getAcademicYearByYear(currentYear);
};
