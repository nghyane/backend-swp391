import { Request, Response } from "express";
import * as scholarshipService from "../../services/scholarship.service";
import { ScholarshipFilterOptions } from "../../types/scholarship.types";
import { catch$ } from "../../utils/catch";


export const getAllScholarships = catch$(async (req: Request, res: Response): Promise<void> => {
  const { name, majorId, campusId, minAmount } = req.query;
  
  const filters: ScholarshipFilterOptions = {};
  
  if (name) filters.name = String(name);
  if (majorId) filters.majorId = Number(majorId);
  if (campusId) filters.campusId = Number(campusId);
  if (minAmount) filters.minAmount = Number(minAmount);
  
  const hasFilters = Object.keys(filters).length > 0;
  const scholarships = await scholarshipService.getAllScholarships(hasFilters ? filters : undefined);
  
  res.json({
    success: true,
    data: scholarships,
    count: scholarships.length,
    filters: hasFilters ? filters : undefined
  });
});


export const getScholarshipById = catch$(async (req: Request, res: Response): Promise<void> => {

  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
});


export const getScholarshipsByEligibility = catch$(async (req: Request, res: Response): Promise<void> => {

  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
});


export const getScholarshipsByMajor = catch$(async (req: Request, res: Response): Promise<void> => {

  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
});



