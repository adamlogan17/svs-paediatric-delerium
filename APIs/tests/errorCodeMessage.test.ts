import {describe, expect, test} from '@jest/globals';
import errorCodeMessage from '../src/errorCodeMessage';

describe('errorCodeMessage', () => {
  it('should return "Table does not exist" for error code "42P01"', () => {
    const result = errorCodeMessage('42P01');
    expect(result).toBe('ERROR: Table does not exist');
  });

  it('should return "Database does not exist" for error code "3D000"', () => {
    const result = errorCodeMessage('3D000');
    expect(result).toBe('ERROR: Database does not exist');
  });

  it('should return "Invalid data attempted to be added to database" for error code "23514"', () => {
    const result = errorCodeMessage('23514');
    expect(result).toBe('ERROR: Invalid data attempted to be added to database');
  });

  it('should return "Column does not exist in database" for error code "42703"', () => {
    const result = errorCodeMessage('42703');
    expect(result).toBe('ERROR: Column does not exist in database');
  });

  it('should return "Permission Denied" for error code "42501"', () => {
    const result = errorCodeMessage('42501');
    expect(result).toBe('ERROR: Permission Denied');
  });

  it('should return "Foreign Key Violation" for error code "23503"', () => {
    const result = errorCodeMessage('23503');
    expect(result).toBe('ERROR: Foreign Key Violation');
  });

  it('should return "Unknown Error" for an unknown error code', () => {
    const result = errorCodeMessage('unknownCode');
    expect(result).toBe('ERROR: Unknown Error');
  });
});
