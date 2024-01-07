import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { retrieveData, updateData } from './crud';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { config } from 'dotenv';

config();

// Sets the secret key for the JWT token, and provides a default value if the environment variable is not set
const jwtSecret:string = process.env.JWT_SECRET || "034A55E873E4CCD1B601E08B2EC2EB9BF0A569CA8C87F1A572D0AF16C404C988";
const db:string = process.env.DATABASE || "No database found";
const dbPassword:string = process.env.DBPASSWORD || "No password found";
const userTable:string = 'picu';

const permissionDeniedResponse = "ERROR: Permission Denied";

/**
 * Initial login function that creates a JWT token based on the userId and their role
 * @author Adam Logan
 * @param { Request } request Must contain 'username' and 'password' parameters within the body
 * @param { Response } response If valid, the token, the username and the role of the user, and a error message if not
 * @returns { void }
 */
export async function authenticate(request: Request, response: Response): Promise<void> {
  const { username, password } = request.body;

  // this is for logging purposes
  request.params.username = username;

  const condition:any[] = [{
    column: "picu_id",
    operation: "=",
    value: username
  }];

  const results = await retrieveData(db, userTable, "admin", dbPassword, condition, ["picu_role", "password"]);

  if (results.length === 0 || typeof results === 'string') {
    response.send(permissionDeniedResponse);
  }
  else {
    // compares the hashed password with the plaintext one which is provided
    bcrypt
    .compare(password, results[0].password)
    .then(res => {
      if(res) {
        request.params.role = results[0].picu_role;

        // adds the userID and role to the JWT token
        const userToken = jwt.sign(
          {
            userId: username,
            role: results[0].picu_role
          },
          jwtSecret,
          {expiresIn: "1d"}
        );
        response.status(201).send({
          token: userToken,
          role: results[0].picu_role,
          username: username
        });

      } else {
        response.status(401).send(permissionDeniedResponse);
      }
    })
    }
}

/**
 * Used to authorise a user for an endpoint, by checking the JWT 
 * @author Adam Logan
 * @param { any } request
 * @param { Response } response
 * @param { NextFunction } next
 * @param { string } [level] - The role required to access the endpoint
 * @returns { void } 
 */
export async function authorise(request: Request, response: Response, next:NextFunction, level:'admin'|'picu'|'field_engineer' = 'picu'):Promise<void> {
  try {
    // get the token from the authorization header
    const authHeader:string|undefined = request.headers.authorization === undefined ? "error" : request.headers.authorization;
    const token:string = authHeader.includes("Bearer" || "bearer") ? authHeader.split(" ")[1] : authHeader;

    // retrieve the user details of the logged in user
    const user:JwtPayload|string = jwt.verify(token, jwtSecret);

    // pass the user down to the endpoints here
    if(typeof user === 'string') {
      request.params.user = user;
      next();
      // As an admin can do everything 
    } else if (user.role === level || user.role === "admin") {
      const condition:any[] = [{
        column: "picu_id",
        operation: "=",
        value: user.userId
      }];

      const dbResult = await retrieveData(db, userTable, "admin", dbPassword, condition, ["picu_role"]);
      
      if(typeof dbResult === "string") response.status(401).json(permissionDeniedResponse);

      if(dbResult[0].picu_role !== user.role) response.status(401).json(permissionDeniedResponse);

      request.params.username =  user.userId;
      request.params.role =  user.role;
      next();
    } else {
      response.status(401).json(permissionDeniedResponse);
    }

    
  } catch (err) {
    response.status(401).json(permissionDeniedResponse);
  }
}

/**
 * Hashes a password using bcrypt.
 * 
 * This function checks whether a given password is valid according to 
 * a predefined regex pattern, and then hashes the password if valid.
 * 
 * The regex pattern requires the password to be at least 8 characters 
 * long and contain at least one uppercase letter, one lowercase letter 
 * and one number.
 * 
 * @function hashPassword
 * @author Adam Logan
 * @param {string} password - The plaintext password to be hashed.
 * @returns {Promise<string>} - The hashed password or an error message if the input password is not valid.
 */
export async function hashPassword(password:string):Promise<string> {
  const saltRounds = 10;

  // Checks the password is valid
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return "Error: Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.";
  }

  const hash = await bcrypt.hash(password , saltRounds);

  return hash;
}

/**
 * Updates the password for a specified PICU user.
 * 
 * This function first hashes the new password and then proceeds to update the
 * password in the database if the hash is valid.
 * 
 * @function updatePicuPassword
 * @author Adam Logan
 * @param {string} id - The ID of the PICU user whose password is to be updated.
 * @param {string} newPassword - The new plaintext password to be set.
 * @param {string} role - The role of the user.
 * @returns {Promise<string>} - A message indicating the result of the update operation.
 * 
 * @todo Incorporate the role parameter into the function.
 */
export async function updatePicuPassword(id:string, newPassword:string, role:string):Promise<string> {
  const hashedPassword = await hashPassword(newPassword);

  if(hashedPassword.length !== 60 || hashedPassword.includes("Error")) {
    return hashedPassword;
  }

  const condition:any[] = [{
    column: "picu_id",
    operation: "=",
    value: id
  }];

  const result = updateData(db, userTable, {password: hashedPassword}, condition);

  return result;
}

/**
 * Verifies the provided CAPTCHA token with Google's reCAPTCHA service.
 * 
 * This must be done server side, as the domain must be registered [here]{@link [https://www.google.com/recaptcha/admin/site/678042304]}.
 * When registering, ensure 'Challenge (v2) and "I'm not a robot" Checkbox' is selected.
 * The secret key is then generated and stored in the .env file.
 * The site key is then used in the client side code.
 * 
 * @function verifyCaptcha
 * 
 * @author Adam Logan
 * 
 * @param {string} token - The CAPTCHA token generated client-side after a user completes a CAPTCHA challenge.
 * @returns {Promise<boolean>} - A promise that resolves to true if the CAPTCHA token is valid and false otherwise.
 * 
 */
export async function verifyCaptcha(token:string):Promise<boolean> {
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  const verifyResponse = await axios.post(url);
  const captchaValidation = verifyResponse.data;

  return captchaValidation.success;
}