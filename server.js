import { config } from "dotenv";
import { connect } from "mongoose";

config({ path: "./config.env" });

import app from "./app.js";

const database = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

connect(database).then(() => {
  console.log("Database connected successfully");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App running at port:${process.env.PORT || 3000}`);
});
