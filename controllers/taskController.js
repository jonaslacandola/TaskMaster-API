import mongoose from "mongoose";
import Project from "../models/projectModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllTasks = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const projectId = req.params.projectId;

  const { tasks } = await Project.findOne({
    _id: projectId,
    user: userId,
  }).select("tasks");

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  });
});

export const createTask = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const projectId = req.params.projectId;

  const project = await Project.findOne({
    _id: projectId,
    user: userId,
  });

  project.tasks.push(req.body);

  await project.save({ runValidators: true });

  const updatedProject = await Project.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId.createFromHexString(projectId),
        user: userId,
      },
    },
    { $unwind: "$tasks" },
    { $sort: { "tasks.createdAt": -1 } },
    {
      $limit: 1,
    },
    { $project: { _id: 0, tasks: 1 } },
  ]);

  res.status(201).json({
    status: "success",
    data: {
      task: updatedProject.at(0)?.tasks,
    },
  });
});

export const getTask = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const projectId = req.params.projectId;
  const taskId = req.params.id;

  const project = await Project.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId.createFromHexString(projectId),
        user: userId,
      },
    },
    {
      $unwind: "$tasks",
    },
    {
      $match: {
        "tasks._id": mongoose.Types.ObjectId.createFromHexString(taskId),
      },
    },
    {
      $project: { _id: 0, tasks: 1 },
    },
  ]);

  if (!project.length)
    throw new Error(`Task with id: ${taskId}, cannot be found`);

  res.status(200).json({
    status: "success",
    data: {
      tasks: project.at(0)?.tasks,
    },
  });
});

export const updateTask = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const projectId = req.params.projectId;
  const taskId = req.params.id;

  const project = await Project.findOne({ _id: projectId, user: userId });

  if (!project) throw new Error(`Project with id ${projectId} does not exists`);

  const { tasks } = project;

  const updatedTasks = tasks.map((el) =>
    el._id === taskId ? { ...el, ...req.body } : el
  );
  project.tasks = updatedTasks;

  project.save({ runValidators: true });

  res.status(200).json({
    status: "success",
    data: {
      task: updatedTasks.find((el) => el._id === taskId),
    },
  });
});

export const deleteTask = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const projectId = req.params.projectId;
  const taskId = req.params.id;

  const project = await Project.findOne({ _id: projectId, user: userId });
  const { tasks } = project;

  const updatedTasks = tasks.filter((el) => el._id != taskId);
  project.tasks = updatedTasks;

  project.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
