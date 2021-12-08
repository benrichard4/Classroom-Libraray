//const path = require("path");
const morgan = require("morgan");
const express = require("express");
const cors = require("cors");

const PORT = 8000;

express()
  .use(morgan("tiny"))
  .use(express.json())
  .use(cors())

  //routes
  .use(require("./routes/teachers"))
  .use(require("./routes/students"))
  .use(require("./routes/libraries"))
  .use(require("./routes/classrooms"))

  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  .listen(PORT, function () {
    console.info("🌍 Listening on port " + PORT);
  });
