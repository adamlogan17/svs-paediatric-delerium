import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import {createPool, createSelect, updateData} from './crud';
import bcrypt from 'bcrypt';

/**
 * Initial login function that creates a JWT token based on the userId and their role
 * @author Adam Logan
 * @date 2023-04-10
 * @param { Request } request Must contain 'username' and 'password' parameters within the body
 * @param { Response } response If valid, the token, the username and the role of the user, and a error message if not
 * @returns { void }
 * 
 * TODO Generalise this function to work with any db
 */
export function authenticate(request: Request, response: Response): void {
    // the admin role is used to login in users
    const POOL = createPool("audit", "admin_role", "password"); 

    const { username, password } = request.body;

    let condition:string = "picu_id=" + username;

    POOL.query(createSelect("picu", condition, ["picu_role", "password"]), async (error:any, results:any) => {
      if (error || results.rows.length === 0) {
        response.send("Invalid User");
      }
      else {
        // compares the hashed password with the plaintext one which is provided
        console.log(results);
        bcrypt
        .compare(password, results.rows[0].password)
        .then(res => {
          if(res) {
            // adds the userID and role to the JWT token
            const userToken = jwt.sign(
              {
                userId: username,
                role: results.rows[0].picu_role
              },
              "REPLACE-WITH-PRIVATE-KEY",
              {expiresIn: "1d"}
            );
            response.send({
              token: userToken,
              role: results.rows[0].picu_role,
              username: username
            });

          } else {
            response.status(401).send("Invalid User");
          }
        })
        .catch(err => response.send(err))
      }
        
    });
}

/**
 * Used to authorise a user for an endpoint, by checking the JWT 
 * @author Adam Logan
 * @date 2023-04-10
 * @param { any } request
 * @param { Response } response
 * @param { NextFunction } next
 * @returns { void }
 */
export function authorise(request: Request, response: Response, next:NextFunction, level:string = 'picu'):void {
  try {
    // get the token from the authorization header
    const authHeader:string|undefined = request.headers.authorization === undefined ? "error" : request.headers.authorization;
    const token:string = authHeader.includes("Bearer") ? authHeader.split(" ")[1] : authHeader;

    // retrieve the user details of the logged in user
    const user:JwtPayload|string = jwt.verify(token, "REPLACE-WITH-PRIVATE-KEY");
    console.log(user);

    // pass the user down to the endpoints here
    if(typeof user === 'string') {
      request.params.user = user;
      next();

      // As an admin can do everything 
    } else if (user.role === level || user.role === "admin") { 
      request.params.username =  user.userId;
      request.params.role =  user.role;
      next();
    } else {
      response.status(401).json("ERROR: Permission Denied");
    }

    
  } catch (err) {
    response.status(401).json("ERROR: Permission Denied");
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
export async function hashPassword(password:string) {
  const SALTROUNDS = 10;

  // Checks the password is valid
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return "Error: Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.";
  }

  const hash = await bcrypt.hash(password , SALTROUNDS);

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
 */
export async function updatePicuPassword(id:string, newPassword:string, role:string) {
  const hashedPassword = await hashPassword(newPassword);

  if(hashedPassword.length !== 60 || hashedPassword.includes("Error")) {
    return hashedPassword;
  }

  const result = updateData("audit", "picu", {password: hashedPassword}, `picu_id=${id}`);

  return result;
}