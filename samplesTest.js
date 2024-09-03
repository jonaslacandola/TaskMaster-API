import { readFile } from "fs/promises";

import Project from "./models/projectModel.js";

export async function createSampleProjects() {
  const projects = await readFile(`./samples.json`);

  await Project.create(JSON.parse(projects));
}
