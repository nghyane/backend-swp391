import { Request, Response } from "express";
import { scholarshipService } from "../../services/scholarship.service";
import { ScholarshipFilterOptions } from "../../types/scholarship.types";
import { catch$ } from "../../utils/catch";


export const getAllScholarships = catch$(async (req: Request, res: Response): Promise<void> => {
  const filters: ScholarshipFilterOptions = {};
  
  if (req.query.name) {
    filters.name = req.query.name as string;
  }
  
  if (req.query.majorId) {
    filters.majorId = parseInt(req.query.majorId as string);
  }
  
  if (req.query.campusId) {
    filters.campusId = parseInt(req.query.campusId as string);
  }
  
  if (req.query.minAmount) {
    filters.minAmount = parseInt(req.query.minAmount as string);
  }
  
  const scholarships = await scholarshipService.getAllScholarships(filters);
  
  res.status(200).json({
    success: true,
    data: scholarships,
    count: scholarships.length
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



