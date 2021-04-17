import { Router } from "express";
import { createRouter } from "src/libs/router-builder";
import { signUpHandler } from "./sign-up";
import { signInHandler } from "./sign-in";

export const authRouter = createRouter()
  .addEndpoint("/sign-up", "post", signUpHandler)
  .addEndpoint("/sign-in", "post", signInHandler)
  .build();
