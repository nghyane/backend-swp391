import { eq, ilike, or, SQL, and } from 'drizzle-orm';
import { db } from '@db/index';
import { campuses, majorCampusAdmission } from '@db/schema';
import { Campus, CampusQueryParams } from '@/types/campus.types';
import { NotFoundError } from '@utils/errors';
import { createNamespace } from '@utils/pino-logger';
import { dormitories, academicYears } from '@db/schema';

const logger = createNamespace('campus-service');

const DEFAULT_QUERY_OPTIONS = {
  orderBy: campuses.name
};

export const getAllCampuses = async (filters?: CampusQueryParams) => {
  if (!filters || Object.keys(filters).length === 0) {
    return db.query.campuses.findMany(DEFAULT_QUERY_OPTIONS);
  }

  const conditions: SQL[] = [
    filters.name && ilike(campuses.name, `%${filters.name}%`),
    filters.campus_code && eq(campuses.code, filters.campus_code),
    filters.address && ilike(campuses.address, `%${filters.address}%`)
  ].filter(Boolean) as SQL[];

  if (conditions.length === 0) {
    return db.query.campuses.findMany(DEFAULT_QUERY_OPTIONS);
  }

  return db.query.campuses.findMany({
    ...DEFAULT_QUERY_OPTIONS,
    where: or(...conditions)
  });
};

export const getCampusById = async (id: number): Promise<Campus> => {
  const result = await db.query.campuses.findFirst({
    where: eq(campuses.id, id)
  });
  if (!result) throw new NotFoundError('Campus', id);
  return result;
};

/**
 * Create a new campus
 * @param data Campus data without id
 * @returns Created campus
 */
export const createCampus = async (data: Omit<Campus, 'id'>): Promise<Campus> => {
  // Check if campus with the same code already exists
  const existingCampus = await db.query.campuses.findFirst({
    where: eq(campuses.code, data.code),
    columns: { id: true }
  });

  if (existingCampus) {
    throw new Error(`Campus with code '${data.code}' already exists`);
  }

  // Handle contact data - ensure it's in the correct format
  if (typeof data.contact === 'string') {
    try {
      data.contact = JSON.parse(data.contact);
    } catch (error) {
      logger.error('Error parsing contact JSON:', error);
      throw new Error('Invalid contact data format');
    }
  }

  // Insert new campus into database
  const [newCampus] = await db.insert(campuses).values(data).returning();

  logger.info(`Created new campus: ${newCampus.name} (${newCampus.code})`);
  return newCampus;
};

/**
 * Update an existing campus
 * @param id Campus ID
 * @param data Updated campus data
 * @returns Updated campus
 * @throws NotFoundError if campus not found
 */
export const updateCampus = async (id: number, data: Partial<Omit<Campus, 'id'>>): Promise<Campus> => {
  // Check if campus exists
  const existingCampus = await db.query.campuses.findFirst({
    where: eq(campuses.id, id)
  });

  if (!existingCampus) {
    throw new NotFoundError('Campus', id);
  }

  // If updating code, check if the new code already exists (and it's not this campus)
  if (data.code && data.code !== existingCampus.code) {
    const codeExists = await db.query.campuses.findFirst({
      where: eq(campuses.code, data.code),
      columns: { id: true }
    });

    if (codeExists && codeExists.id !== id) {
      throw new Error(`Campus with code '${data.code}' already exists`);
    }
  }

  // Handle contact data - ensure it's in the correct format
  if (data.contact && typeof data.contact === 'string') {
    try {
      data.contact = JSON.parse(data.contact);
    } catch (error) {
      logger.error('Error parsing contact JSON:', error);
      throw new Error('Invalid contact data format');
    }
  }

  // Update campus in database
  const [updatedCampus] = await db
    .update(campuses)
    .set(data)
    .where(eq(campuses.id, id))
    .returning();

  logger.info(`Updated campus: ${updatedCampus.name} (${updatedCampus.code})`);
  return updatedCampus;
};

/**
 * Delete a campus
 * @param id Campus ID
 * @throws NotFoundError if campus not found
 * @throws Error if campus has related records
 */
export const deleteCampus = async (id: number): Promise<void> => {
  // Check if campus exists
  const existingCampus = await db.query.campuses.findFirst({
    where: eq(campuses.id, id),
    columns: { id: true, name: true, code: true }
  });

  if (!existingCampus) {
    throw new NotFoundError('Campus', id);
  }

  // Check for related records in majorCampusAdmission
  const relatedMajors = await db.query.majorCampusAdmission.findFirst({
    where: eq(majorCampusAdmission.campus_id, id),
    columns: { id: true }
  });

  if (relatedMajors) {
    throw new Error(`Cannot delete campus with ID ${id} because it has related major admissions`);
  }

  // Check for related records in dormitories
  const relatedDormitories = await db.query.dormitories.findFirst({
    where: eq(dormitories.campus_id, id),
    columns: { id: true }
  });

  if (relatedDormitories) {
    throw new Error(`Cannot delete campus with ID ${id} because it has related dormitories`);
  }

  // Delete campus from database
  await db.delete(campuses).where(eq(campuses.id, id));

  logger.info(`Deleted campus: ${existingCampus.name} (${existingCampus.code})`);
};

/**
 * Get majors offered at a specific campus with optional academic year filter
 * @param campusId Campus ID
 * @param academicYear Optional academic year (calendar year)
 * @returns Array of majors with admission details for the specified campus
 * @throws NotFoundError if campus not found
 */
export const getCampusMajors = async (campusId: number, academicYear?: number) => {
  // Check if campus exists
  const existingCampus = await db.query.campuses.findFirst({
    where: eq(campuses.id, campusId),
    columns: { id: true }
  });

  if (!existingCampus) {
    throw new NotFoundError('Campus', campusId);
  }

  // Build query conditions
  const conditions: SQL[] = [eq(majorCampusAdmission.campus_id, campusId)];

  // Add academic year filter if provided
  if (academicYear) {
    // Find academic year ID
    const academicYearRecord = await db.query.academicYears.findFirst({
      where: eq(academicYears.year, academicYear),
      columns: { id: true }
    });

    if (!academicYearRecord) {
      // Return empty array if academic year not found
      return [];
    }

    conditions.push(eq(majorCampusAdmission.academic_year_id, academicYearRecord.id));
  }

  // Query majors with admission details
  return await db.query.majorCampusAdmission.findMany({
    where: and(...conditions),
    with: {
      major: {
        with: { careers: true }
      },
      campus: true,
      academicYear: true
    }
  });
};
