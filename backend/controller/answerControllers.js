// db connection
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// get All Answer
async function get_answer(req, res) {
  const question_id = req.params.question_id;
  // console.log(question_id);
  if (!question_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Bad Request", message: "Invalid question ID" });
  }
  try {
    // Check if the Question Exists
    const [questions] = await dbConnection.query(
      "SELECT questionid FROM questions WHERE questionid = ?",
      [question_id]
    );
    // console.log(questions);
    // const { questionid } = questions[0];
    // console.log(questionid);
    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }

    // Fetch Answers
    const [answers] = await dbConnection.query(
      `
      SELECT a.answerid AS answer_id, a.answer AS content, a.userid, u.username AS user_name
FROM answers a
JOIN userTable u ON a.userid = u.userid
WHERE a.questionid = ?;
    `,
      [question_id]
    );
    // console.log(answers);
    res.status(StatusCodes.OK).json({
      answers: answers.map((a) => ({
        answer_id: a.answer_id,
        content: a.content,
        user_name: a.user_name,
      })),
    });
  } catch (error) {
    console.log("Error fetching answers:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// Post Answer
async function post_answer(req, res) {
  const { questionid, answer } = req.body;
  console.log(questionid);
  const userid = req.user.userid;

  console.log(userid);

  const currentUserId = userid; // Replace with actual user ID retrieval

  let connection;
  try {
    connection = await dbConnection.getConnection();

    // Check if the question exists (optional, but good practice)
    const [questionRows] = await connection.execute(
      "SELECT id FROM questions WHERE questionid = ?",
      [questionid]
    );

    if (questionRows.length === 0) {
      connection.release();
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Invalid question ID" });
    }

    const [insertResult] = await connection.execute(
      "INSERT INTO answers (answer, userid, questionid) VALUES (?, ?, ?)",
      [answer, currentUserId, questionid]
    );
    connection.release();

    console.log("Answer inserted successfully:", insertResult);

    return res.status(201).json({ message: "Answer posted successfully" });
  } catch (error) {
    console.error("Error posting answer:", error);

    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  get_answer,
  post_answer,
};
