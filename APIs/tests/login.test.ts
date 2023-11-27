import {describe, expect, test} from '@jest/globals';
import * as login from '../src/login';
import { Request, Response } from 'express';
import * as crud from '../src/crud';

jest.mock('../src/crud', () => ({
    createPool: jest.fn(),
    createSelect: jest.fn()
    }));
jest.mock('../src/login', () => ({
    authenticate: jest.fn()
}))
  
  jest.mock('bcrypt', () => ({
    compare: jest.fn()
  }));
  
  jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
  }));
  
  describe('authenticate method', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
  
    beforeEach(() => {
      mockRequest = {
        body: {
          username: 'testUsername',
          password: 'testPassword'
        }
      };
  
      mockJson = jest.fn();
      mockResponse = {
        send: mockJson
      };
    });
  
    it('should authenticate a user with correct credentials', async () => {
        (crud.createPool as jest.Mock).mockReturnValueOnce({
            query: jest.fn().mockImplementationOnce(() => ({
          rows: [
            {
              picu_role: 'admin',
              password: 'hashedPassword'
            }
          ]
        }))
      });
  
      (require('bcrypt') as any).compare.mockReturnValueOnce(true);

      (require('jsonwebtoken') as any).sign.mockReturnValueOnce('mockToken');

      await login.authenticate(mockRequest as Request, mockResponse as Response);
  
      expect(login.authenticate).toHaveBeenCalledWith({
        role: 'admin',
        token: 'mockToken',
        username: 'testUsername'
      });
    });
  
    it('should deny access for incorrect credentials', async () => {
      (crud.createPool as jest.Mock).mockReturnValueOnce({
      query: jest.fn().mockImplementationOnce(() => ({
        rows: []
      }))
    });
  
    (require('bcrypt') as any).compare.mockReturnValueOnce(false);

    (require('jsonwebtoken') as any).sign.mockReturnValueOnce('mockToken');
  
      expect(mockJson).toHaveBeenCalledWith('ERROR: Permission Denied');
    });
  
    // Add more test cases to cover edge cases and error scenarios
  });