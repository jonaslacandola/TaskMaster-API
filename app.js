import express from "express";
import morgan from "morgan";

import projectRouter from "./routes/projectRouter.js";
import userRouter from "./routes/userRouter.js";
import taskRouter from "./routes/taskRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects/:projectId/tasks", taskRouter);
app.use("/api/v1/projects", projectRouter);

app.all("*", (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on this server!`));
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

export default app;
