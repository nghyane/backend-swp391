import { Request, Response } from "express";
import * as majorService from "../../services/major.service";
import { MajorFilterOptions } from "../../types/major.types";
import { catch$ } from "../../utils/catch";

export const getAllMajors = catch$(async (req: Request, res: Response): Promise<void> => {
  const { name, code, description } = req.query;
  
  const filters: MajorFilterOptions = {};
  
  if (name) filters.name = String(name);
  if (code) filters.code = String(code);
  if (description) filters.description = String(description);
  
  const hasFilters = Object.keys(filters).length > 0;
  
  const majors = await majorService.getAllMajors(
    hasFilters ? filters : undefined
  );
  
  res.json({
    success: true,
    data: majors,
    count: majors.length,
    filters: hasFilters ? filters : undefined
  });
});

/**
 * Get major details by code
 * This endpoint retrieves a major by its unique code
 */
export const getMajorByCode = catch$(async (req: Request, res: Response): Promise<void> => {
  const code = req.params.code;
  const major = await majorService.getMajorByCode(code);
  
  res.json({
    success: true,
    data: major
  });
});



export const getMajorsByCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  const campusId = Number(req.params.campusId);
  
  const majors = await majorService.getMajorsByCampusId(campusId);
  
  res.json({
    success: true,
    data: majors,
    count: majors.length
  });
});


