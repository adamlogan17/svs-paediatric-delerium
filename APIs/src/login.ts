import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
import {createPool, createSelect} from './crud';

function loginToAudit(username:string, password:string): string {
    let role:string = "";

    return role;
}

export function loginTest(request: Request, response: Response): void {
    const POOL = createPool("audit", "admin_role", "password");

    console.log(createSelect("picu","picu_id=1 && password=pass1"));

    POOL.query(createSelect("picu", "picu_id=1 AND password='pass1'", ["picu_role"]), (error, results) => {
        let temp;
        if (error) {
          temp="FAILED";
        } else {
            temp = results.rows;
        }
        response.send({temp});
      });
}