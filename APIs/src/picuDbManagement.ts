import { Request, Response } from 'express';
import { createInsert, createPool } from './crud';
import { hashPassword } from './login';

const DATABASE = "audit";
const DBPASSWORD:string = "password";

/**
 * 
 * @param request 
 * @param response 
 * TODO make it possible for a field engineer to do this as well
 * TODO do not allow a field engineer to create an admin account
 */
export async function addPicu(request: Request, response: Response): Promise<undefined> {
  const TABLENAME:string = 'picu';
  const COLUMNS:string[] = ['hospital_name', 'auditor', 'picu_role', 'password', 'ward_name'];
  const ROLE_OPTIONS:string[] = ['picu', 'admin', 'field_engineer'];
  if (!ROLE_OPTIONS.includes(request.body.picu_role)) {
    response.send("Invalid picu_role given.");
    return undefined;
  }

  request.body.password = await hashPassword("pass1");
  
  const data:string[] = COLUMNS.map((column) => request.body[column]);
  console.log(data);
  
  const USER = "admin_role";

  const POOL = createPool(DATABASE, USER, DBPASSWORD);

  const sqlStatement:string = createInsert(TABLENAME, COLUMNS, data);

  POOL.query(sqlStatement, (error:any, results:any) => {
    if(error === undefined) {
      console.log(results);
      response.send({
        id: results.rows[0].picu_id
      });
    } 
    else {
      response.send(error);
    }
  });

  return undefined;
}