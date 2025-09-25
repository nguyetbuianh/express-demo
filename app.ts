import express, { Application } from "express";
import cors from "cors";
import { errorHandler } from "./src/middlewares/errorHandler.ts";
import { logger } from "./src/middlewares/logger.ts";
import userRoutes from "./src/routes/userRoutes.ts";
import { AppDataSource } from "./src/config/DataSource.ts";
import courseRoutes from "./src/routes/courseRoutes.ts";
import lessonRoutes from "./src/routes/lessonRoutes.ts";
import paymentRoutes from "./src/routes/paymentRoutes.ts";
import progressRoutes from "./src/routes/progressRoutes.ts";
import vocabularyRoutes from "./src/routes/vocabularyRoutes.ts";                
import exerciseOptionRoutes from "./src/routes/exerciseOptionRoutes.ts";
import exerciseRoutes from "./src/routes/excerciseRoutes.ts";
import { authenticate } from "./src/middlewares/authenticate.ts";

const app: Application = express();
app.use(express.json());
app.use(logger);
app.use(cors());
app.use("/users", userRoutes);
app.use(authenticate);
app.use("/courses", courseRoutes);
app.use("/lessons", lessonRoutes);
app.use("/payments", paymentRoutes);
app.use("/progress", progressRoutes);
app.use("/vocabularies", vocabularyRoutes);
app.use("/exercises", exerciseRoutes);
app.use("/exercise-options", exerciseOptionRoutes);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error : Error) => {
    console.error("Database connection error: ", error);
  });

export default app;
