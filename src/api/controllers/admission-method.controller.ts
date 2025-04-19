import { Request, Response } from "express";
import { admissionMethodService } from "../../services/admission-method.service";
import { AdmissionMethod, AdmissionMethodFilterOptions } from "../../types/admission-method.types";
import { catch$ } from "../../utils/catch";
import { NotFoundError } from "../../utils/errors";


export const getAllAdmissionMethods = catch$(async (req: Request, res: Response): Promise<void> => {
  const filters: AdmissionMethodFilterOptions = {};
  
  if (req.query.name && typeof req.query.name === 'string') {
    filters.name = req.query.name;
  }
  
  const admissionMethods = await admissionMethodService.getAllAdmissionMethods(filters);
  res.status(200).json({
    success: true,
    data: admissionMethods,
    count: admissionMethods.length
  });
});

export const getAdmissionMethodById = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const admissionMethod = await admissionMethodService.getAdmissionMethodById(id);
  res.status(200).json({
    success: true,
    data: admissionMethod
  });
});

export const getAdmissionMethodRequirements = catch$(async (req: Request, res: Response): Promise<void> => {

  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
});

export const getAdmissionMethodsByMajor = catch$(async (req: Request, res: Response): Promise<void> => {

  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
});

export const createAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const admissionMethodData: Omit<AdmissionMethod, 'id'> = req.body;
  
  const newAdmissionMethod = await admissionMethodService.createAdmissionMethod(admissionMethodData);
  res.status(201).json({
    success: true,
    data: newAdmissionMethod,
    message: 'Admission method created successfully'
  });
});

export const updateAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const updateData: Partial<Omit<AdmissionMethod, 'id'>> = req.body;
  
  const updatedAdmissionMethod = await admissionMethodService.updateAdmissionMethod(id, updateData);
  res.status(200).json({
    success: true,
    data: updatedAdmissionMethod,
    message: 'Admission method updated successfully'
  });
});

export const deleteAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  
  await admissionMethodService.deleteAdmissionMethod(id);
  res.status(200).json({
    success: true,
    message: 'Admission method deleted successfully'
  });
});



