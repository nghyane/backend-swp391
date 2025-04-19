import { query } from "express-validator";
import { validateCustomQueries } from "./common.validator";

export const validateDormitoryQueries = () => {
  const customValidators = [
    query("campusId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Campus ID must be a positive integer")
      .toInt(),
    
    query("priceMin")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Minimum price must be a non-negative integer")
      .toInt(),
    
    query("priceMax")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Maximum price must be a non-negative integer")
      .toInt(),
    
    query("priceMax")
      .optional()
      .custom((value, { req }) => {
        const priceMin = req.query?.priceMin;
        if (priceMin !== undefined && Number(value) < Number(priceMin)) {
          throw new Error("Maximum price must be greater than or equal to minimum price");
        }
        return true;
      })
  ];

  return validateCustomQueries(customValidators);
};
