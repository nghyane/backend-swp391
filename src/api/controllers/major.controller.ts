import { Request, Response } from "express";
import * as majorService from "../../services/major.service";
import { Major, MajorFilterOptions } from "../../types/major.types";
import { catch$ } from "../../utils/catch";
import { NotFoundError } from "../../utils/errors";

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

export const getMajorById = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const major = await majorService.getMajorById(id);
  res.json({
    success: true,
    data: major
  });
});



export const getMajorsByCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet'
  });
});


