import express from "express";
import {
  checkUser,
  getMembers,
  addMember,
  removeMember,
  updateMemberPriority,
  bulkAddMembers,
} from "../controllers/teamController.js";

const router = express.Router();

router.get("/check-user", checkUser);
router.get("/members", getMembers);
router.post("/add", addMember);
router.delete("/members/:id", removeMember);
router.patch("/members/:id/priority", updateMemberPriority);
router.post("/bulk-add", bulkAddMembers);

export default router;
