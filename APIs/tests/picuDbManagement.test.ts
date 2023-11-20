import {describe, expect, test} from '@jest/globals';
import {Picu, editPicu, deletePicus, addPicu, nextPicu, getAllIds} from '../src/picuDbManagement';
import { updateData } from '../src/crud';

describe('Database Functions', () => {
    const dbPassword = 'root';
  
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('editPICU', () => {
         it('should edit the PICUs data', async () => {
                 const dataToEdit: Picu = {
                     hospital_name:'Scunthorpe', 
                     auditor:'John Cheese', 
                     picu_role:'picu',
                     password:'pass1',
                     ward_name:'John',
                     picu_id:'1',
                    overall_compliance:100,
              }
          const role = "admin";

          (updateData as jest.Mock).mockResolvedValueOnce('Success');

          const result = await editPicu(dataToEdit,role)
          expect(result).toEqual('Success');
          expect(updateData).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            dataToEdit,
            ['picu_id'],
            role,
            dbPassword
          );
        })
    })
})