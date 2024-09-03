import Project from "../models/projectModel.js";
import catchAsync from "../utils/catchAsync.js";
import APIFeatures from "../utils/apiFeatures.js";

export function aliasHighPriority(req, res, next) {
  req.query.priority = "high";
  next();
}

export const getAllProjects = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const features = new APIFeatures(Project.find({ user: userId }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const projects = await features.query;

  res.status(200).json({
    status: "success",
    results: projects.length,
    data: {
      projects,
    },
  });
});

export const createProject = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const project = await Project.create({ ...req.body, user: userId });

  res.status(201).json({
    status: "success",
    data: {
      project,
    },
  });
});

export const getProject = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const projectId = req.params.id;

  const project = await Project.findOne({ _id: projectId, user: userId });

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});

export const updateProject = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const projectId = req.params.id;

  const updatedProject = await Project.findOneAndUpdate(
    { _id: projectId, user: userId },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      project: updatedProject,
    },
  });
});

export const deleteProject = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const projectId = req.params.id;

  await Project.findOneAndDelete({ _id: projectId, user: userId });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getProjectsOverview = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const overview = await Project.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $addFields: { status: "$_id" },
    },
    { $project: { _id: 0 } },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      overview,
    },
  });
});
