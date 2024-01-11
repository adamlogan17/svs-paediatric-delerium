import {describe, expect, test} from '@jest/globals';
import { insertCompData, editCompliance, deleteCompRecords, ComplianceData} from '../src/complianceScores';
import { deleteData, insertData, updateData } from '../src/crud';

// // Mocking the database functions
// jest.mock('your-database-library', () => ({
//   insertData: jest.fn(),
//   updateData: jest.fn(),
//   deleteData: jest.fn(),
// }));

// describe('Database Functions', () => {
//   const dbPassword = 'root';

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('insertCompData', () => {
//     it('should insert compliance data into the database', async () => {
//       const dataToAdd: ComplianceData = {
//           method: 'SOSPD',
//           bed_number: 999999999,
//           correct_details: false,
//           comfort_recorded: false,
//           comfort_above: false,
//           all_params_scored: false,
//           totalled_correctly: false,
//           in_score_range: false,
//           observer_name: false,
//           picu_id: 1
//       };
//       const role = 'picu';

//       // Mock the successful insertData function
//       (insertData as jest.Mock).mockResolvedValueOnce({ comp_id: 99999 });

//       const result = await insertCompData(dataToAdd, role);

//       expect(result).toEqual({ comp_id: 99999 });
//       expect(insertData).toHaveBeenCalledWith(
//         expect.anything(),
//         expect.anything(),
//         dataToAdd,
//         ['comp_id'],
//         role,
//         dbPassword
//       );
//     });
//   });

//   describe('editCompliance', () => {
//     it('should edit compliance data in the database', async () => {
//       const dataToEdit: ComplianceData = {
//           comp_id: 99999,
//           method: 'SOSPD',
//           bed_number: 0,
//           correct_details: false,
//           comfort_recorded: false,
//           comfort_above: false,
//           all_params_scored: false,
//           totalled_correctly: false,
//           in_score_range: false,
//           observer_name: false,
//           picu_id: 0
//       };
//       const role = 'admin';

//       // Mock the successful updateData function
//       (updateData as jest.Mock).mockResolvedValueOnce('Success');

//       const result = await editCompliance(dataToEdit, role);

//       expect(result).toEqual('Success');
//       expect(updateData).toHaveBeenCalledWith(
//         expect.anything(),
//         expect.anything(),
//         expect.objectContaining({ comp_id: expect.anything() }),
//         'comp_id = 99999',
//         role,
//         dbPassword
//       );
//     });
//   });

//   describe('deleteCompRecords', () => {
//     it('should delete compliance records from the database', async () => {
//       const ids: number[] = [1, 2, 3];
//       const role = 'admin';

//       // Mock the successful deleteData function
//       (deleteData as jest.Mock).mockResolvedValueOnce('Success');

//       const result = await deleteCompRecords(ids, role);

//       expect(result).toEqual('Success');
//       expect(deleteData).toHaveBeenCalledWith(
//         expect.anything(),
//         expect.anything(),
//         'comp_id IN (1,2,3)',
//         role,
//         dbPassword
//       );
//     });
//   });
// });