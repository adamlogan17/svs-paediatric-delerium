import { Request, Response } from "express";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import {createPool, createSelect} from './crud';

export function loginTest(request: Request, response: Response): void {
    const POOL = createPool("audit", "admin_role", "password");

    POOL.query(createSelect("picu", "picu_id=1 AND password='pass1'", ["picu_role"]), (error:any, results:any) => {
        if (error) {
          throw error;
        }

        try {
          const userToken = jwt.sign(
            {
              userId: 1
            },
            "REPLACE-WITH-PRIVATE-KEY",
            {expiresIn: "1d"}
          );
          response.send({
            token: userToken,
            role: results.rows[0].picu_role
          });
        } catch (err) {
          response.send("Invalid User");
        }
        
    });
}

export function authorise(request: any, response: Response, next:any) {
  try {

  
    // get the token from the authorization header
    const token = request.headers.authorization.split(" ")[1];

    // check if the token matches the supposed origin
    const decodedToken = jwt.verify(token, "REPLACE-WITH-PRIVATE-KEY");

    // retrieve the user details of the logged in user
    const user = decodedToken;

    // pass the user down to the endpoints here
    request.user = user;

    // pass down functionality to the endpoint
    next();
  } catch (err) {
    response.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
}