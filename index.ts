import { env } from "./src/config/env.ts";
import app from "./app.ts";

app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});
