import {describe, expect, test} from '@jest/globals';
import { createSelect, createInsert, createUpdate, createDelete} from '../src/crud';

describe('testCreateSelect (Tests the select query on the database, database with default columns and database with default columns and no condition', () => {
  it('returns a valid SELECT query for a given table', () => {
    const table = 'users';
    const condition = 'age > 18';
    const data = ['id', 'name'];

    const query = createSelect(table, condition, data);

    expect(query).toBe('SELECT id,name FROM users WHERE age > 18');
  });

  it('returns a SELECT query for a given table with default columns', () => {
    const table = 'users';
    const condition = 'age > 18';

    const query = createSelect(table, condition);

    expect(query).toBe('SELECT * FROM users WHERE age > 18');
  });

  it('returns a SELECT query for a given table with no condition and default columns', () => {
    const table = 'users';

    const query = createSelect(table);

    expect(query).toBe('SELECT * FROM users');
  });
});

describe('testCreateInsert (tests insert query on database, an invalid insert query on database and if an upsert is on an invalid column', () => {
  it('returns a basic INSERT query for a given table and data', () => {
    const table = 'users';
    const columns = ['name', 'age'];
    const data = ['John', '30'];

    const query = createInsert(table, columns, data);

    expect(query).toBe("INSERT INTO users (name,age) VALUES ('John','30')");
  });

  it('returns a FAILED message if the number of columns and data do not match', () => {
    const table = 'orders';
    const columns = ['id', 'product_name', 'quantity'];
    const data = ['1', 'Computer', '2', '2022-03-15'];

    const query = createInsert(table, columns, data);

    expect(query).toBe("FAILED");
  });

  it('returns a FAILED message if upsertCol is specified but not in columns', () => {
    const table = 'products';
    const columns = ['id', 'name', 'price'];
    const data = ['1', 'Product A', '100'];
    const upsertCol = 'name_uk';

    const query = createInsert(table, columns, data, upsertCol);

    expect(query).toBe("FAILED");
  });
});

describe('testCreateUpdate (valid update statement and invalid update statement', () => {
  it('generates valid SQL query when given valid input', () => {
    const table = 'users';
    const columns = ['name', 'email'];
    const data = ['John Doe', 'johndoe@example.com'];
    const predicate = 'id = 1';
    const expectedQuery = "UPDATE users SET name = 'John Doe',email = 'johndoe@example.com' WHERE id = 1;";

    const result = createUpdate(table, columns, data, predicate);

    expect(result).toEqual(expectedQuery);
  });
  it('returns "FAILED" message when columns and data have different lengths', () => {
    const table = 'users';
    const columns = ['name', 'email'];
    const data = ['John Doe'];
    const predicate = 'id = 1';

    const result = createUpdate(table, columns, data, predicate);

    expect(result).toEqual('FAILED');
  });
});

describe('testCreateDelete (valid delete query and one with a predicate)', () => {
  it('should generate a delete query without a predicate', () => {
    const table = 'users';
    const expectedQuery = 'DELETE FROM users';

    const actualQuery = createDelete(table);

    expect(actualQuery).toEqual(expectedQuery);
  });

  it('should generate a delete query with a predicate', () => {
    const table = 'users';
    const predicate = 'id = 123';
    const expectedQuery = 'DELETE FROM users WHERE id = 123';

    const actualQuery = createDelete(table, predicate);

    expect(actualQuery).toEqual(expectedQuery);
  });
});
