const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth").auth;
const {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  addParticipant,
  removeParticipant,
  debugGroupAccess,
} = require("../controllers/groupController");

// Protect all routes
router.use(auth);

// Group routes
router.route("/").post(createGroup).get(getGroups);

router.route("/:id").get(getGroup).put(updateGroup).delete(deleteGroup);

// Debug route
router.route("/:id/debug").get(debugGroupAccess);

// Participant routes
router.route("/:id/participants").post(addParticipant);

router.route("/:id/participants/:userId").delete(removeParticipant);

module.exports = router;
