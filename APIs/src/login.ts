import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {createPool, createSelect} from './crud';

export function loginTest(request: Request, response: Response): void {
    const POOL = createPool("audit", "admin_role", "password");

    POOL.query(createSelect("picu", "picu_id=1 AND password='pass1'", ["picu_role"]), (error, results) => {
        let role:string = "FAILED";
        if (!error) {
            role = results.rows[0].picu_role;
        }

        const token = jwt.sign(
            {
              userId: 1
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );
        response.send({role});
    });
}