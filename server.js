import { configDotenv } from "dotenv";
import { connect } from "mongoose";

import app from "./app.js";

configDotenv({ path: "./config.env" });

const database = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

connect(database).then(() => {
  console.log("Database connected successfully");
});

app.listen(process.env.PORT, () => {
  console.log(`App running at port:${process.env.PORT}`);
});
