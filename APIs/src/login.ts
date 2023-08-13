import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import {createPool, createSelect} from './crud';
import bcrypt from 'bcrypt';

/**
 * Initial login function that creates a JWT token based on the userId and their role
 * @author Adam Logan
 * @date 2023-04-10
 * @param { Request } request Must contain 'username' and 'password' parameters within the body
 * @param { Response } response If valid, the token, the username and the role of the user, and a error message if not
 * @returns { void }
 */
export function authenticate(request: Request, response: Response): void {
    // the admin role is used to login in users
    const POOL = createPool("audit", "admin_role", "password"); 

    console.log(request.body);

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
            response.send("Invalid User");
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
    console.log(level);
    console.log(request.params.role);
    console.log(request.params.role === level);
    if(typeof user === 'string') {
      request.params.user = user;
      next();
    } else if (user.role === level || user.role === "admin") {
      // As an admin can do everything 
      request.params.username =  user.userId;
      request.params.role =  user.role;
      next();
    } else {
      response.status(401).json("Invalid request!");
    }

    
  } catch (err) {
    response.status(401).json("Invalid request!");
  }
}

export async function hashPassword(password:string) {
  const SALTROUNDS = 10;

  const hash = await bcrypt.hash(password , SALTROUNDS);

  return hash;
}