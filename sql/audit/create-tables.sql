CREATE TABLE IF NOT EXISTS picu (
  picu_id SERIAL PRIMARY KEY,
  password CHAR(60) NOT NULL,
  ward_name VARCHAR NOT NULL,
  hospital_name VARCHAR NOT NULL,
  auditor VARCHAR NOT NULL,
  picu_role VARCHAR NOT NULL 
    DEFAULT 'picu'
    CHECK(picu_role IN ('picu', 'admin', 'field_engineer')),
  overall_compliance DECIMAL
);

-- TODO: Add a primary key to this table
CREATE TABLE IF NOT EXISTS api_log (
    date DATE,
    time TIME,
    method VARCHAR(10),
    url VARCHAR(255),
    status INT,
    userIP VARCHAR(50),
    userAgent VARCHAR(255),
    username VARCHAR(50),
    userRole VARCHAR(50)
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

CREATE TABLE IF NOT EXISTS compliance_data_backup(
    comp_id SERIAL PRIMARY KEY,
  entry_date DATE NOT NULL,
  method VARCHAR(5) 
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

CREATE TABLE IF NOT EXISTS picu_backup(
    picu_id SERIAL PRIMARY KEY,
  password CHAR(60) NOT NULL,
  ward_name VARCHAR NOT NULL,
  hospital_name VARCHAR NOT NULL,
  auditor VARCHAR NOT NULL,
  picu_role VARCHAR NOT NULL 
    DEFAULT 'picu'
    CHECK(picu_role IN ('picu', 'admin', 'field_engineer')),
  overall_compliance DECIMAL
);

CREATE TABLE IF NOT EXISTS api_log_backup(
      date DATE,
    time TIME,
    method VARCHAR(10),
    url VARCHAR(255),
    status INT,
    userIP VARCHAR(50),
    userAgent VARCHAR(255),
    username VARCHAR(50),
    userRole VARCHAR(50)
);