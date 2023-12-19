CREATE TABLE IF NOT EXISTS picu (
    picu_id SERIAL PRIMARY KEY,
    password CHAR(60) NOT NULL,
    ward_name VARCHAR NOT NULL,
    hospital_name VARCHAR NOT NULL,
    auditor VARCHAR NOT NULL,
    delirium_positive_patients DECIMAL,
    picu_role VARCHAR NOT NULL 
        DEFAULT 'picu'
        CHECK(picu_role IN ('picu', 'admin', 'field_engineer')),
    overall_compliance DECIMAL
);

-- A 'NULL' value within the username and user_role, indicate a potential unauthorised user or an endpoint that does not require authentication
-- username is not a foreign key user's who are invalid still need to be recorded for security reasons
-- If user_role is NULL for login, this means the login request was denied (this can also be seen within the status code)
CREATE TABLE IF NOT EXISTS api_log (
    log_id SERIAL PRIMARY KEY,
    datetime TIMESTAMP NOT NULL,
    method VARCHAR(7) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    status_code INT NOT NULL,
    user_ip VARCHAR(50) NOT NULL,
    user_agent VARCHAR(255) NOT NULL,
    username INTEGER,
    user_role VARCHAR(50)
        CHECK(user_role IN ('picu', 'admin', 'field_engineer'))
);

CREATE TABLE IF NOT EXISTS compliance_data (
    comp_id SERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    method VARCHAR(5) NOT NULL
        CHECK(method IN ('SOSPD', 'CAPD')),
    bed_number INTEGER NOT NULL,
    correct_details BOOLEAN NOT NULL,
    comfort_recorded BOOLEAN NOT NULL,
    comfort_above BOOLEAN NOT NULL,
    all_params_scored BOOLEAN NOT NULL,
    totalled_correctly BOOLEAN NOT NULL,
    in_score_range BOOLEAN NOT NULL,
    observer_name BOOLEAN NOT NULL,
    score DECIMAL,
    picu_id INTEGER NOT NULL,
    CONSTRAINT fk_picu
        FOREIGN KEY (picu_id) 
	        REFERENCES picu (picu_id)
	        ON DELETE CASCADE
);