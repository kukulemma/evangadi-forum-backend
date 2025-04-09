const express = require("express");
const router = express.Router();
const { get_answer, post_answer } = require("../controller/answerControllers");

router.get("/get-answer/:question_id", get_answer);

// Post Answer
router.post("/", post_answer);
module.exports = router;
