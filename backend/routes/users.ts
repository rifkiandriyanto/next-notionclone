import express, { Router } from "express";
import { body } from "express-validator";
import isAuth from "../middleware/isAuth";
import * as usersController from "../controllers/users";

const router: Router = express.Router();

const emailValidator = body("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("Email Address is not valid.");
const passwordValidator = body("password")
  .trim()
  .isLength({ min: 6 })
  .withMessage("Password has to be 6 chars or more.");
const nameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required.");

// POST /users/signup
router.post(
  "/signup",
  [emailValidator, passwordValidator, nameValidator],
  usersController.signup
);

// POST /users/login
router.post(
  "/login",
  [emailValidator, passwordValidator],
  usersController.login
);

// POST /users/logout
router.post("/logout", isAuth, usersController.logout);

// GET /users/account
router.get("/account", isAuth, usersController.getUser);

// PUT /users/account
router.put("/account", isAuth, usersController.updateUser);

// POST /users/resetToken
router.post("/resetToken", [emailValidator], usersController.getResetToken);

// POST /users/resetPassword
router.post(
  "/resetPassword",
  [passwordValidator],
  usersController.resetPassword
);

// POST /users/activate
router.post("/activate", usersController.activateAccount);

export = router;
