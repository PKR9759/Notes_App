const express = require("express");

const router = express.Router();

const {createNote, getNotes, editNote, deleteNote, pinNote} = require("../controllers/noteContrroller");

const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/", authenticateToken, createNote);
router.get("/", authenticateToken, getNotes);
router.put("/:noteId", authenticateToken, editNote);
router.delete("/:noteId", authenticateToken, deleteNote);
router.patch("/:noteId/pin", authenticateToken, pinNote);

module.exports = router;