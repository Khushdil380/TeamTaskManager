import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
  getCalendarTasks,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/my-tasks", getMyTasks);
router.get("/calendar", getCalendarTasks);
router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
