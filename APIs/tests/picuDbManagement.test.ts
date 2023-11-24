import {describe, expect, test} from '@jest/globals';
import {editPicu, deletePicus, addPicu, nextPicu, getAllIds, Picu} from '../src/picuDbManagement';
import * as crud from '../src/crud';
import * as login from '../src/login';

// Mock the login functions
jest.mock('../src/login');
const hashPassword = jest.fn();

// Mock the crud functions
jest.mock('../src/crud', () => ({
  createPool: jest.fn(),
  updateData: jest.fn(),
  createSelect: jest.fn(),
  deleteData: jest.fn(),
  insertData: jest.fn(),
}));

describe('Picu Functions', () => {
  const db = 'audit'; //db name
  const dbPassword = 'password';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addPicu', () => {
    beforeEach(() => {
      // Clear the mock calls before each test
      jest.clearAllMocks();
    });

    it('should return an error if any field is empty', async () => {
      const dataToAdd: Picu = {
        picu_id: '1',
        hospital_name: '',
        picu_role: 'admin',
        auditor: 'Auditor',
        ward_name: 'Ward',
        password: 'password',
      };
      const role = 'admin';

      const result = await addPicu(dataToAdd, role);

      expect(result).toBe('ERROR: hospital_name is empty.');
      // Ensure that the insertData function was not called
      expect(require('../src/crud').insertData).not.toHaveBeenCalled();
    });

    it('should return an error if password is empty', async () => {
      const dataToAdd: Picu = {
        picu_id: '1',
        hospital_name: 'Hospital',
        picu_role: 'admin',
        auditor: 'Auditor',
        ward_name: 'Ward',
        password: '',
      };
      const role = 'admin';

      const result = await addPicu(dataToAdd, role);

      expect(result).toBe('ERROR: password is empty.');
      // Ensure that the insertData function was not called
      expect(require('../src/crud').insertData).not.toHaveBeenCalled();
    });

    it('should return an error if password hashing fails', async () => {
      const dataToAdd: Picu = {
        picu_id: '1',
        hospital_name: 'Hospital',
        picu_role: 'admin',
        auditor: 'Auditor',
        ward_name: 'Ward',
        password: 'password',
      };
      const role = 'admin';

      // Mock the hashPassword function to return an error
      (require('../src/login') as any).hashPassword.mockResolvedValue('Error: Password hashing failed');

      const result = await addPicu(dataToAdd, role);

      expect(result).toBe('Error: Password hashing failed');
      // Ensure that the insertData function was not called
      expect(require('../src/crud').insertData).not.toHaveBeenCalled();
    });

    it('should call insertData with the correct parameters', async () => {
      const dataToAdd: Picu = {
        picu_id: '123',
        hospital_name: 'Success Hospital',
        picu_role: 'admin',
        auditor: 'Auditor',
        ward_name: 'Ward',
        password: 'password',
      };
      const role = 'admin';

      // Mock the hashPassword function to return a hashed password
      (require('../src/login') as any).hashPassword.mockResolvedValue('hashedPassword-hashedPassword-hashedPassword-hashedPassword-');

      // Mock the insertData function to return a success message
      (require('../src/crud') as any).insertData.mockResolvedValue({ picu_id: 123 });

      const result = await addPicu(dataToAdd, role);

      expect(result).toEqual({ picu_id: 123 });
      // Ensure that the insertData function was called with the correct parameters
      expect(require('../src/crud').insertData).toHaveBeenCalledWith(db, 'picu', dataToAdd, ['picu_id'], role, dbPassword);
    });

    // Add more test cases for different scenarios
    // hashed password conditions
  });

//-----------------------------------------------------------------------------------------------------------------

  describe('deletePicus', () => {
    beforeEach(() => {
      // Clear the mock calls before each test
      jest.clearAllMocks();
    });

    it('should call deleteData with the correct parameters', async () => {
      const ids = [1, 2, 3];
      const role = 'admin';

      // Mock the deleteData function to return a success message
      (require('../src/crud') as any).deleteData.mockResolvedValue('Deletion successful');

      const result = await deletePicus(ids, role);

      expect(result).toBe('Deletion successful');
      // Ensure that the deleteData function was called with the correct parameters
      expect(require('../src/crud').deleteData).toHaveBeenCalledWith(db, 'picu', `picu_id IN (1,2,3)`, role, dbPassword);
    });

    // Add more test cases for different scenarios
  });


  //---------------------------------------------------------------------------------------------------------

  describe('editPicu', () => {
    beforeEach(() => {
      // Clear the mock calls before each test
      jest.clearAllMocks();
    });

    it('should return an error if password field is present', async () => {
      const dataToEdit: Picu = { 
        hospital_name: 'Updated Hospital',
        auditor: 'Updated Auditor',
        picu_role: 'picu',
        password: 'newPassword',
        ward_name: 'Updated Ward',
        picu_id: '1',
      };
      const role = 'admin';

      const result = await editPicu(dataToEdit, role);

      expect(result).toBe('ERROR: password cannot be edited.');
      // Ensure that the updateData function was not called
      expect(require('../src/crud').updateData).not.toHaveBeenCalled();
    });

    it('should return an error if any field is empty', async () => {
      const dataToEdit: Picu = { picu_id: '1', 
        hospital_name: '', 
        picu_role: 'admin', 
        auditor: 'Updated Auditor', 
        ward_name: 'Updated Ward', 
      };
      const role = 'admin';

      const result = await editPicu(dataToEdit, role);

      expect(result).toBe('ERROR: hospital_name is empty.');
      // Ensure that the updateData function was not called
      expect(require('../src/crud').updateData).not.toHaveBeenCalled();
    });

    it('should call updateData with the correct parameters', async () => {
      const dataToEdit: Picu = {
        picu_id: '1',
        hospital_name: 'Hospital',
        picu_role: 'admin',
        auditor: 'Auditor',
        ward_name: 'Ward',
      };
      const role = 'admin';

      // Mock the updateData function to return a success message
      (require('../src/crud') as any).updateData.mockResolvedValue('Update successful');

      const result = await editPicu(dataToEdit, role);

      expect(result).toBe('Update successful');
      // Ensure that the updateData function was called with the correct parameters
      expect(require('../src/crud').updateData).toHaveBeenCalledWith(db, 'picu', dataToEdit, `picu_id = 1`, role, dbPassword);
    });

    // Add more test cases for different scenarios
  });

  //---------------------------------------------------------------------------------------------------------------------------------------

  describe('nextPicu', () => {
    beforeEach(() => {
      // Clear the mock calls before each test
      jest.clearAllMocks();
    });

    it('should return the next PICU sequence value', async () => {
      const mockRows = [{ nextval: 42 }];

      // Mock the database pool query function
      (require('../src/crud') as any).createPool.mockReturnValue({
        query: jest.fn().mockResolvedValue({ rows: mockRows }),
      });

      // Call the function with a role parameter
      const result = await nextPicu('admin');

      // Assert the result based on the expected behavior
      expect(result).toBe(mockRows[0].nextval);

      // Ensure that the createPool function was called with the correct parameters
      expect(require('../src/crud').createPool).toHaveBeenCalledWith(db, 'admin', dbPassword);

      // Ensure that the query function was called with the correct SQL statement
      expect(require('../src/crud').createPool().query).toHaveBeenCalledWith("SELECT nextval('picu_picu_id_seq');");
    });

    // Add more test cases for different scenarios
  });

//---------------------------------------------------------------------------------------------------------------------

describe('getAllIds', () => {
  beforeEach(() => {
    // Clear the mock calls before each test
    jest.clearAllMocks();
  });

  it('should return all IDs for admin role', async () => {
    const mockRows = [
      { picu_id: '1', picu_role: 'admin' }, 
      { picu_id: '2', picu_role: 'picu' }
    ];

    // Mock the database pool query function
    (require('../src/crud') as any).createPool.mockReturnValue({
      query: jest.fn().mockResolvedValue({ rows: mockRows }),
    });

    // Mock the crud createSelect function
    (require('../src/crud') as any).createSelect.mockReturnValue("SELECT picu_id, picu_role FROM picu;");

    // Call the function with an admin role
    const result = await getAllIds('admin');

    // Assert the result based on the expected behavior
    expect(result).toEqual(mockRows);

    // Ensure that the createPool function was called with the correct parameters
    expect(require('../src/crud').createPool).toHaveBeenCalledWith(db, 'admin', dbPassword);

    // Ensure that the query function was called with the correct SQL statement
    expect(require('../src/crud').createPool().query).toHaveBeenCalledWith("SELECT picu_id, picu_role FROM picu;");
  });

  it('should return only picu IDs for field_engineer role', async () => {
    const mockRows = [
      { picu_id: '1', picu_role: 'admin' },
      { picu_id: '2', picu_role: 'picu' }
    ];

    // Mock the database pool query function
    (require('../src/crud') as any).createPool.mockReturnValue({
      query: jest.fn().mockResolvedValue({ rows: mockRows }),
    });

    // Mock the crud createSelect function
    (require('../src/crud') as any).createSelect.mockReturnValue("SELECT picu_id, picu_role FROM picu;");

    // Call the function with a field_engineer role
    const result = await getAllIds('field_engineer');

    // Assert the result based on the expected behavior (filtering out non-picu IDs)
    expect(result).toEqual([{ picu_id: '2', picu_role: 'picu' }]);

    // Ensure that the createPool function was called with the correct parameters
    expect(require('../src/crud').createPool).toHaveBeenCalledWith(db, 'field_engineer', dbPassword);

    // Ensure that the query function was called with the correct SQL statement
    expect(require('../src/crud').createPool().query).toHaveBeenCalledWith("SELECT picu_id, picu_role FROM picu;");
  });

  // Add more test cases for different scenarios
});


function makeApp(arg0: { createUser: jest.Mock<any, any, any>; }) {
  throw new Error('Function not implemented.');
}});
