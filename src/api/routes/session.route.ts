import { Router } from "express";
import { sessionController } from "../controllers/session.controller";
import { validateId, validateCommonQueries, validateBody } from "../../middlewares/validators";
import { body } from "express-validator";

const router = Router();

// Session routes
router.get("/facebook/:facebookUserId", 
  (req, res, next) => {
    // Check if facebookUserId is in correct format
    if (!/^\d+$/.test(req.params.facebookUserId)) {
      res.status(400).json({
        success: false,
        message: "Invalid Facebook User ID format"
      });
    } else {
      next();
    }
  },
  sessionController.getSessionByFacebookId
);
router.put("/:id", 
  validateId(),
  validateBody([
    body('state').isString().notEmpty().withMessage('State is required'),
    body('context').optional().isString().withMessage('Context must be a string'),
    body('lastInteraction').optional().isString().withMessage('Last interaction must be a string')
  ]),
  sessionController.updateSession
);
router.get("/", validateCommonQueries(), sessionController.getAllSessions);

export default router;
