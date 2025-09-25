import express, { Application } from "express";
import cors from "cors";
import { errorHandler } from "./src/middlewares/ErrorHandler.ts";
import { logger } from "./src/middlewares/Logger.ts";
import userRoutes from "./src/routes/UserRoutes.ts";
import { AppDataSource } from "./src/config/DataSource.ts";
import courseRoutes from "./src/routes/CourseRoutes.ts";
import lessonRoutes from "./src/routes/LessonRoutes.ts";
import paymentRoutes from "./src/routes/PaymentRoutes.ts";
import progressRoutes from "./src/routes/ProgressRoutes.ts";
import vocabularyRoutes from "./src/routes/VocabularyRoutes.ts";                
import exerciseOptionRoutes from "./src/routes/ExerciseOptionRoutes.ts";
import exerciseRoutes from "./src/routes/ExcerciseRoutes.ts";
import { authenticate } from "./src/middlewares/Authenticate.ts";
import { authorize } from "./src/middlewares/Authorize.ts";

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
