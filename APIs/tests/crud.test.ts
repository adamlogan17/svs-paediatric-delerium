import {describe, expect, test} from '@jest/globals';
import { createSelect } from '../src/crud';

describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    
    expect(createSelect("tname")).toBe("SELECT * FROM tname;");
    // this is a test
  });
});