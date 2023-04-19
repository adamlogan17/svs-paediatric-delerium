-- Creates the PICU role
CREATE ROLE picu_role WITH LOGIN PASSWORD 'password';

GRANT USAGE, SELECT ON SEQUENCE compliance_data_comp_id_seq TO picu_role;
GRANT SELECT, INSERT ON compliance_data TO picu_role;

-- Creates the admin role
CREATE ROLE admin_role WITH LOGIN PASSWORD 'password';
ALTER ROLE admin_role SUPERUSER;

GRANT SELECT, INSERT, UPDATE, DELETE ON compliance_data TO admin_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON picu TO admin_role;

-- Creates the field engineer role
CREATE ROLE field_engineer_role WITH LOGIN PASSWORD 'password';

GRANT SELECT, UPDATE ON picu TO field_engineer_role;