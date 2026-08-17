import { Router } from "express";
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  getAssignees,
} from "../controllers/enquiryController.js";
import { validate } from "../middlewares/validate.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createEnquirySchema,
  updateEnquirySchema,
} from "../validators/enquiryValidator.js";

const router = Router();

router.use(protect);

router.post("/", validate(createEnquirySchema), createEnquiry);
router.get("/", getEnquiries);
router.get("/assignees", getAssignees);
router.get("/:id", getEnquiryById);
router.put("/:id", validate(updateEnquirySchema), updateEnquiry);
router.delete("/:id", deleteEnquiry);

export default router;
