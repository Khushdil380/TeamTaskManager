import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  checkProjectUser,
  getProjectTeamMembers,
  getMemberTeams,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/check-user", checkProjectUser);
router.get("/team-members", getProjectTeamMembers);
router.get("/member-teams", getMemberTeams);
router.get("/", getProjects);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.post("/:id/members", addProjectMember);
router.delete("/:id/members/:userId", removeProjectMember);

export default router;
