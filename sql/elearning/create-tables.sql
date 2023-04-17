CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  forename VARCHAR NOT NULL,
  surname VARCHAR NOT NULL,
  profession VARCHAR NOT NULL,
  country VARCHAR NOT NULL,
  user_role VARCHAR NOT NULL
    DEFAULT 'lerner'
    CHECK(user_role IN ('learner', 'admin', 'field_engineer'))
);

CREATE TABLE IF NOT EXISTS courses (
  course_id SERIAL PRIMARY KEY,
  course_name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS chapters (
  chapter_id SERIAL PRIMARY KEY,
  chapter_name VARCHAR NOT NULL,
  pass_score DECIMAL NOT NULL,
  num_pages INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  CONSTRAINT fk_courses
    FOREIGN KEY (course_id) 
	  REFERENCES courses (course_id)
	  ON DELETE CASCADE,
  UNIQUE (chapter_name, course_id)
);

CREATE TABLE IF NOT EXISTS enrollment (
  enrollment_id SERIAL PRIMARY KEY,
  enrollment_date DATE NOT NULL,
  completed_date DATE,
  user_id INTEGER NOT NULL,
  CONSTRAINT fk_users
    FOREIGN KEY (user_id) 
	  REFERENCES users (user_id)
	  ON DELETE CASCADE,
  course_id INTEGER NOT NULL,
  CONSTRAINT fk_courses
    FOREIGN KEY (course_id) 
	  REFERENCES courses (course_id)
	  ON DELETE CASCADE,
  UNIQUE (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS progression (
  progression_id SERIAL PRIMARY KEY,
  score DECIMAL,
  current_page INTEGER NOT NULL,
  completed_date DATE,
  user_id INTEGER NOT NULL,
  CONSTRAINT fk_users
    FOREIGN KEY (user_id) 
	  REFERENCES users (user_id)
	  ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL,
  CONSTRAINT fk_chapters
    FOREIGN KEY (chapter_id) 
      REFERENCES chapters (chapter_id)
      ON DELETE CASCADE,
  UNIQUE (user_id, chapter_id)
);
