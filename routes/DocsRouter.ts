// @deno-types='npm:@types/express'
import { Router } from "npm:express";
import { Swagger } from "../docs/Swagger.ts";
const DocsRouter = Router();

const apiExpressReservation = new Swagger({
  title: "API Reserva Express",
  version: "1.0.0",
  routerPaths: ["./features/user/UserRouter.ts", "./features/auth/AuthRouter.ts"],
});

DocsRouter.use(
  "/docs/api/express-reservation",
  apiExpressReservation.setupAndServe()
);

export { DocsRouter };
