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

    const { username, password } = request.body;

    let condition:string = "picu_id=" + username;

    POOL.query(createSelect("picu", condition, ["picu_role", "password"]), async (error:any, results:any) => {
      if (error) {
        response.send("Invalid User");
      }
      else {
        // compares the hashed password with the plaintext one which is provided
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
export function authorise(request: Request, response: Response, next:NextFunction):void {
  try {
    // get the token from the authorization header
    console.log("authorise");
    const authHeader:string|undefined = request.headers.authorization === undefined ? "error" : request.headers.authorization;
    const token:string = authHeader.split(" ")[1];

    // retrieve the user details of the logged in user
    const user:JwtPayload|string = jwt.verify(token, "REPLACE-WITH-PRIVATE-KEY");

    // pass the user down to the endpoints here
    if(typeof user == 'string') {
      request.params.user = user;
    } else {
      request.params.username =  user.userId;
      request.params.role =  user.role;
    }

    // pass down functionality to the endpoint
    next();
  } catch (err) {
    response.json("Invalid request!");
  }
}

/**
 * Used to authorise if a user has a role of admin
 * @author Adam Logan
 * @date 2023-04-28
 * @param { any } request
 * @param { Response } response
 * @param { NextFunction } next
 * @returns { void }
 */
export function adminAuthorise(request: Request, response: Response, next:NextFunction): void {
  if(request.params.role == "admin") {
    next();
  } else {
    response.json("Invalid request!");
  }
}

/**
 * Used to authorise if a user has a role of field engineer
 * @author Adam Logan
 * @date 2023-04-28
 * @param { Request } request
 * @param { Response } response
 * @param { NextFunction } next
 * @returns { void }
 */
export function fieldAuthorise(request: Request, response: Response, next:NextFunction): void {
  if(request.params.role == "field_engineer") {
    next();
  } else {
    response.json("Invalid request!");
  }
}

/**
 * Retrieves the user's userId and role based on the JWT provided
 * @author Adam Logan
 * @date 2023-04-10
 * @param { any } request Must contain the 'token' parameter which should have the argument of a JWT
 * @param { Response } response The userId and role of the user
 * @returns { void }
 */
export function retrieveUserDetails(request: Request, response: Response):void {
  const token = request.params.token;

  const decodedToken = jwt.verify(token, "REPLACE-WITH-PRIVATE-KEY");

  const user:JwtPayload|string = decodedToken;

  if(typeof user == 'string') {
    response.send(user);
  } else {
    response.send({
      username: user.userId,
      role: user.role
    });
  }
}

export async function hashPassword(password:string) {
  const SALTROUNDS = 10;

  const hash = await bcrypt.hash(password , SALTROUNDS);

  return hash;
}