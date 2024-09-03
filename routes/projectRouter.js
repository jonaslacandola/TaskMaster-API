import { Router } from "express";

import {
  aliasHighPriority,
  createProject,
  deleteProject,
  getAllProjects,
  getProject,
  getProjectsOverview,
  updateProject,
} from "../controllers/projectController.js";
import protect from "../utils/protect.js";

const router = Router();

router.use(protect);

router.route("/projects-overview").get(getProjectsOverview);
router.route("/high-priority-projects").get(aliasHighPriority, getAllProjects);

router.route("/").get(getAllProjects).post(createProject);
router.route("/:id").get(getProject).patch(updateProject).delete(deleteProject);

export default router;
