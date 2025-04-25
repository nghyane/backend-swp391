import { db } from "../db";
import { 
  academicYears, 
  majors, 
  careers, 
  campuses, 
  majorCampusAdmission, 
  scholarships, 
  sessions, 
  admissionMethods, 
  dormitories, 
  admissionMethodApplications, 
  scholarshipAvailability,
  internalUsers
} from "../db/schema";
import { count, eq, SQL } from "drizzle-orm";

export type DashboardStats = {
  total_academic_years: number;
  total_majors: number;
  total_careers: number;
  total_campuses: number;
  total_major_campus_admissions: number;
  total_scholarships: number;
  total_sessions: number;
  total_admission_methods: number;
  total_dormitories: number;
  total_admission_method_applications: number;
  total_scholarship_availabilities: number;
  total_internal_users: number;
};

export type CategoryCount = {
  id: number;
  name: string;
  count: number;
};

/**
 * Lấy thống kê tổng số lượng từng loại dữ liệu trong hệ thống
 * @returns Các số liệu thống kê
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Sử dụng Promise.all để thực hiện tất cả các truy vấn song song để cải thiện hiệu suất
  const [
    totalAcademicYears,
    totalMajors,
    totalCareers,
    totalCampuses,
    totalMajorCampusAdmissions,
    totalScholarships,
    totalSessions,
    totalAdmissionMethods,
    totalDormitories,
    totalAdmissionMethodApplications,
    totalScholarshipAvailabilities,
    totalInternalUsers
  ] = await Promise.all([
    db.select({ value: count() }).from(academicYears),
    db.select({ value: count() }).from(majors),
    db.select({ value: count() }).from(careers),
    db.select({ value: count() }).from(campuses),
    db.select({ value: count() }).from(majorCampusAdmission),
    db.select({ value: count() }).from(scholarships),
    db.select({ value: count() }).from(sessions),
    db.select({ value: count() }).from(admissionMethods),
    db.select({ value: count() }).from(dormitories),
    db.select({ value: count() }).from(admissionMethodApplications),
    db.select({ value: count() }).from(scholarshipAvailability),
    db.select({ value: count() }).from(internalUsers)
  ]);

  return {
    total_academic_years: totalAcademicYears[0].value,
    total_majors: totalMajors[0].value,
    total_careers: totalCareers[0].value,
    total_campuses: totalCampuses[0].value,
    total_major_campus_admissions: totalMajorCampusAdmissions[0].value,
    total_scholarships: totalScholarships[0].value,
    total_sessions: totalSessions[0].value,
    total_admission_methods: totalAdmissionMethods[0].value,
    total_dormitories: totalDormitories[0].value,
    total_admission_method_applications: totalAdmissionMethodApplications[0].value,
    total_scholarship_availabilities: totalScholarshipAvailabilities[0].value,
    total_internal_users: totalInternalUsers[0].value
  };
};

/**
 * Lấy số lượng ngành học theo từng campus
 * @returns Danh sách campus và số lượng ngành học tại mỗi campus
 */
export const getMajorsByCampus = async (): Promise<CategoryCount[]> => {
  const result = await db
    .select({
      id: campuses.id,
      name: campuses.name,
      count: count(majorCampusAdmission.major_id).as('count')
    })
    .from(campuses)
    .leftJoin(
      majorCampusAdmission,
      eq(campuses.id, majorCampusAdmission.campus_id)
    )
    .groupBy(campuses.id, campuses.name);

  return result;
};

/**
 * Lấy số lượng học bổng theo từng campus
 * @returns Danh sách campus và số lượng học bổng tại mỗi campus
 */
export const getScholarshipsByCampus = async (): Promise<CategoryCount[]> => {
  const result = await db
    .select({
      id: campuses.id,
      name: campuses.name,
      count: count(scholarshipAvailability.scholarship_id).as('count')
    })
    .from(campuses)
    .leftJoin(
      scholarshipAvailability,
      eq(campuses.id, scholarshipAvailability.campus_id)
    )
    .groupBy(campuses.id, campuses.name);

  return result;
};

/**
 * Lấy số lượng ký túc xá theo từng campus
 * @returns Danh sách campus và số lượng ký túc xá tại mỗi campus
 */
export const getDormitoriesByCampus = async (): Promise<CategoryCount[]> => {
  const result = await db
    .select({
      id: campuses.id,
      name: campuses.name,
      count: count(dormitories.id).as('count')
    })
    .from(campuses)
    .leftJoin(
      dormitories,
      eq(campuses.id, dormitories.campus_id)
    )
    .groupBy(campuses.id, campuses.name);

  return result;
};

/**
 * Lấy số lượng ngành học theo từng năm học
 * @returns Danh sách năm học và số lượng ngành học có tuyển sinh trong năm đó
 */
export const getMajorsByAcademicYear = async (): Promise<CategoryCount[]> => {
  const result = await db
    .select({
      id: academicYears.id,
      name: academicYears.year,
      count: count(majorCampusAdmission.major_id).as('count')
    })
    .from(academicYears)
    .leftJoin(
      majorCampusAdmission,
      eq(academicYears.id, majorCampusAdmission.academic_year_id)
    )
    .groupBy(academicYears.id, academicYears.year);

  return result.map(item => ({
    ...item,
    name: String(item.name) // Convert number to string for consistency
  }));
};

/**
 * Lấy số lượng phương thức xét tuyển được áp dụng theo từng năm học
 * @returns Danh sách năm học và số lượng phương thức xét tuyển áp dụng trong năm đó
 */
export const getAdmissionMethodsByAcademicYear = async (): Promise<CategoryCount[]> => {
  const result = await db
    .select({
      id: academicYears.id,
      name: academicYears.year,
      count: count(admissionMethodApplications.admission_method_id).as('count')
    })
    .from(academicYears)
    .leftJoin(
      admissionMethodApplications,
      eq(academicYears.id, admissionMethodApplications.academic_year_id)
    )
    .groupBy(academicYears.id, academicYears.year);

  return result.map(item => ({
    ...item,
    name: String(item.name) // Convert number to string for consistency
  }));
}; 