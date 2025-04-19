import { Request, Response } from "express";
import { 
  getAllCampuses as getAllCampusesService,
  getCampusById as getCampusByIdService,
  createCampus as createCampusService,
  updateCampus as updateCampusService,
  deleteCampus as deleteCampusService,
  getCampusMajors as getCampusMajorsService,
  getCampusFacilities as getCampusFacilitiesService
} from "../../services/campus.service";
import { Campus, CampusFilterOptions } from "../../types/campus.types";
import { catch$ } from "../../utils/catch";
import { NotFoundError } from "../../utils/errors";

export const getAllCampuses = catch$(async (req: Request, res: Response): Promise<void> => {
  const { name, address } = req.query;
  
  const filters: CampusFilterOptions = {};
  
  if (name) filters.name = String(name);
  if (address) filters.address = String(address);
  
  const hasFilters = Object.keys(filters).length > 0;
  const campuses = await getAllCampusesService(hasFilters ? filters : undefined);
  
  res.json({
    success: true,
    data: campuses,
    count: campuses.length,
    filters: hasFilters ? filters : undefined
  });
});

export const getCampusById = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const campus = await getCampusByIdService(id);
  res.json({
    success: true,
    data: campus
  });
});

export const createCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  const campusData: Omit<Campus, 'id'> = req.body;
  const newCampus = await createCampusService(campusData);
  res.status(201).json({
    success: true,
    data: newCampus,
    message: 'Campus created successfully'
  });
});

export const updateCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const updateData: Partial<Omit<Campus, 'id'>> = req.body;
  
  const updatedCampus = await updateCampusService(id, updateData);
  res.json({
    success: true,
    data: updatedCampus,
    message: 'Campus updated successfully'
  });
});

export const deleteCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  
  await deleteCampusService(id);
  res.json({
    success: true,
    message: 'Campus deleted successfully'
  });
});

export const getCampusMajors = catch$(async (req: Request, res: Response): Promise<void> => {

  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
});

export const getCampusFacilities = catch$(async (req: Request, res: Response): Promise<void> => {

  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
});



