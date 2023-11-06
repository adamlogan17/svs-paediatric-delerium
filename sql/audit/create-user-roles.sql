-- Creates the PICU role
CREATE ROLE picu WITH LOGIN PASSWORD 'password';

GRANT USAGE, SELECT ON SEQUENCE compliance_data_comp_id_seq TO picu;
GRANT SELECT, INSERT ON compliance_data TO picu;

-- Creates the admin role
CREATE ROLE admin WITH LOGIN PASSWORD 'password';
ALTER ROLE admin SUPERUSER;

GRANT SELECT, INSERT, UPDATE, DELETE ON compliance_data TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON picu TO admin;

-- Creates the field engineer role
CREATE ROLE field_engineer WITH LOGIN PASSWORD 'password';

GRANT SELECT, UPDATE ON picu TO field_engineer;