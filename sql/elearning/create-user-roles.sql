-- Creates the Learner role
CREATE ROLE learner_role WITH LOGIN PASSWORD 'password';

GRANT USAGE, SELECT ON SEQUENCE enrollment_enrollment_id_seq TO learner_role;
GRANT SELECT, INSERT, UPDATE ON enrollment TO learner_role;
GRANT USAGE, SELECT ON SEQUENCE progression_progression_id_seq TO learner_role;
GRANT SELECT, INSERT, UPDATE ON progression TO learner_role;

-- Creates the admin role
CREATE ROLE elearning_admin_role WITH LOGIN PASSWORD 'password';
ALTER ROLE admin_role SUPERUSER;

GRANT SELECT, INSERT, UPDATE, DELETE ON users TO admin_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON courses TO admin_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON chapters TO admin_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON enrollment TO admin_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON progression TO admin_role;

-- Creates the field engineer role
CREATE ROLE elearning_field_engineer_role WITH LOGIN PASSWORD 'password';

GRANT SELECT, UPDATE ON users TO field_engineer_role;