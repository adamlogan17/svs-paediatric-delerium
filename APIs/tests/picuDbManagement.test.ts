import {describe, expect, test} from '@jest/globals';
import {editPicu, deletePicus, addPicu, nextPicu, getAllIds, Picu} from '../src/picuDbManagement';
import * as crud from '../src/crud';
import { hashPassword } from '../src/login';

jest.mock('../src/crud');
jest.mock('../src/login');
const insertData = jest.fn();

// /**
//  * @typedef Picu
//  * 
//  * Represents a PICU (Paediatric Intensive Care Unit) entity in the system. This can be used for
//  * storing information related to a particular PICU.
//  * 
//  * @property {string} hospital_name - The name of the hospital where the PICU is located.
//  * @property {string} ward_name - The specific name of the PICU ward.
//  * @property {string} picu_role - Role assigned within the PICU database.
//  * @property {string} auditor - The individual responsible for auditing within this PICU.
//  * @property {string} [password] - Password associated with the PICU, possibly for access control.
//  * @property {string} [picu_id] - Optional unique identifier for the PICU.
//  */
// type Picu = {
//   hospital_name:string, 
//   auditor:string, 
//   picu_role:'picu'|'admin'|'field_engineer',
//   password?:string
//   ward_name:string,
//   picu_id?:string,
//   overall_compliance?:number,
// }

describe('Picu Functions', () => {
  const db = 'audit'; //db name
  const dbPassword = 'password';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addPicu', () => {
    it('should add a new PICU record to the database', async () => {
      const dataToAdd: Picu = {
        hospital_name:'Test Hospital', 
        auditor:'Test Auditor', 
        picu_role:'picu',
        password:'testPassword',
        ward_name:'Test Ward'
      };

      (crud.insertData as jest.Mock).mockResolvedValueOnce({ picu_id: 1 });
      (hashPassword as jest.Mock).mockResolvedValueOnce('hashedPassword');

      const result = await addPicu(dataToAdd, 'admin');

      expect(crud.insertData).toHaveBeenCalledWith(
        db,
        'picu',
        {
          auditor: 'Test Auditor',
          hospital_name: 'Test Hospital',
          password: 'hashedPassword',
          picu_role: 'picu',
          ward_name: 'Test Ward',
        },
        ['picu_id'],
        'admin',
        dbPassword
      );
      expect(result).toEqual({ picu_id: 1 });
    });

    // need to add more
  });

  describe('deletePicus', () => {
    it('should delete PICUs from the database', async () => {
      const ids = [1, 2, 3];

      (crud.deleteData as jest.Mock).mockResolvedValueOnce('Success');

      const result = await deletePicus(ids, 'admin');

      expect(crud.deleteData).toHaveBeenCalledWith(
        db,
        'picu',
        'picu_id IN (1,2,3)',
        'admin',
        dbPassword
      );
      expect(result).toEqual('Success');
    });

    // Add more test cases for error scenarios
  });

  describe('editPicu', () => {
    it('should edit a PICU record in the database', async () => {
      const dataToEdit: Picu = {
        picu_id: '1',
        hospital_name: 'Updated Hospital',
        ward_name: 'Updated Ward',
        auditor: 'Updated Auditor',
        picu_role: 'picu',
      };

      (crud.updateData as jest.Mock).mockResolvedValueOnce('Success');

      const result = await editPicu(dataToEdit, 'admin');

      expect(crud.updateData).toHaveBeenCalledWith(
        db,
        'picu',
        {
          hospital_name: 'Updated Hospital',
          ward_name: 'Updated Ward',
          auditor: 'Updated Auditor',
          picu_role: 'picu',
        },
        'picu_id = 1',
        'admin',
        dbPassword
      );
      expect(result).toEqual('Success');
    });

    // Add more test cases for error scenarios
  });

  describe('nextPicu', () => {
    it('should retrieve the next PICU ID from the database', async () => {
      (crud.createPool as jest.Mock).mockReturnValueOnce({
        query: jest.fn().mockResolvedValueOnce({ rows: [{ nextval: 1 }] }),
      });

      const result = await nextPicu('admin');

      expect(result).toEqual(1);
      expect(crud.createPool).toHaveBeenCalledWith(db, 'admin', dbPassword);
      expect((crud.createPool(db, 'admin', dbPassword).query as jest.Mock)).toHaveBeenCalledWith(
        "SELECT nextval('picu_picu_id_seq');"
      );
    });

    // Add more test cases for error scenarios
  });

  describe('getAllIds', () => {
    it('should retrieve all PICU IDs based on a given role', async () => {
      (crud.createPool as jest.Mock).mockReturnValueOnce({
        query: jest.fn().mockResolvedValueOnce({
          rows: [
            { picu_id: '1', picu_role: 'picu' },
            { picu_id: '2', picu_role: 'admin' },
            // Add more rows as needed
          ],
        }),
      });

      const result = await getAllIds('admin');

      expect(result).toEqual([
        { picu_id: '1', picu_role: 'picu' },
        { picu_id: '2', picu_role: 'admin' },
      ]);
      expect(crud.createPool).toHaveBeenCalledWith(db, 'admin', dbPassword);
      expect((crud.createPool(db, 'admin', dbPassword).query as jest.Mock)).toHaveBeenCalledWith(
        expect.any(String)
      );
    });

    // Add more test cases for error scenarios
  });
});
function makeApp(arg0: { createUser: jest.Mock<any, any, any>; }) {
  throw new Error('Function not implemented.');
}

