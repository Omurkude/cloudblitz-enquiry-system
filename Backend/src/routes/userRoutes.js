import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { validate } from "../middlewares/validate.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/userValidator.js";

const router = Router();

// Enforce admin authentication & authorization on all user routes
router.use(protect, authorizeRoles("admin"));

router.get("/", getUsers);
router.post("/", validate(createUserSchema), createUser);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;
