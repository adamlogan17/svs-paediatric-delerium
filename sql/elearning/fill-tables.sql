INSERT INTO users (email, password, forename, surname, profession, country, user_role)
        VALUES
                ('nigelmacdonald@example.org','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Graham','Reynolds','Designer, furniture','Slovenia','admin'),
                ('edwardchapman@example.org','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Nigel','Bishop','Marine scientist','Dominica','learner'),
                ('hughesgraham@example.com','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Kenneth','Fisher','Press photographer','United States Minor Outlying Islands','admin'),
                ('thompsonabdul@example.net','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Marion','Barber','Clinical embryologist','Comoros','field_engineer'),
                ('qhardy@example.com','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Colin','Carroll','Higher education lecturer','Andorra','learner'),
                ('donna51@example.org','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Paula','Bentley','Drilling engineer','Kazakhstan','admin'),
                ('gilesgordon@example.com','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Marie','Berry','Sound technician, broadcasting/film/video','United Kingdom','admin'),
                ('elizabethcook@example.com','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Amelia','Davies','Adult guidance worker','Bosnia and Herzegovina','admin'),
                ('geoffreymckenzie@example.com','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Lydia','Williams','Community development worker','Trinidad and Tobago','learner'),
                ('aimeethompson@example.net','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Joshua','Turner','Accounting technician','Tajikistan','learner'),
                ('kpearson@example.com','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Dominic','Short','Volunteer coordinator','Saint Helena','field_engineer'),
                ('peter66@example.net','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Bethany','Bailey','Speech and language therapist','Micronesia','admin'),
                ('coxjudith@example.org','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Grace','Parkinson','Mental health nurse','Puerto Rico','learner'),
                ('gillian21@example.org','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Charlie','Walker','Research officer, trade union','Pitcairn Islands','learner'),
                ('samantha40@example.com','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Lindsey','Jenkins','Civil engineer, contracting','Panama','field_engineer'),
                ('wdaly@example.org','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Josephine','Alexander','Field trials officer','Palestinian Territory','admin'),
                ('connormichael@example.net','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Tom','Evans','Microbiologist','Niger','learner'),
                ('eileen07@example.net','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Fiona','Shaw','Mechanical engineer','Israel','learner'),
                ('georginamiah@example.org','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Neil','Matthews','Cartographer','Nigeria','field_engineer'),
                ('wboyle@example.org','$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi','Reece','Sims','Designer, blown glass/stained glass','Sweden','field_engineer');

INSERT INTO courses (course_name)
        VALUES
                ('veritatis');

INSERT INTO chapters (chapter_name, pass_score, num_pages, course_id)
        VALUES
                ('in',66.36,26,1),
                ('labore',32.23,10,1),
                ('impedit',30.73,54,1),
                ('ab',35.77,69,1),
                ('quia',26.37,92,1),
                ('incidunt',24.72,72,1);

INSERT INTO enrollment (enrollment_date, user_id, course_id)
        VALUES
                ('2020-11-28',4,1),
                ('2011-08-03',15,1),
                ('2017-11-06',3,1),
                ('2021-04-11',19,1),
                ('2011-06-05',5,1),
                ('2009-05-16',18,1),
                ('2000-10-13',9,1),
                ('2012-03-20',13,1),
                ('2004-01-16',12,1);

-- The data below may not necessarily be consistent with the other data within the database, but is only here to test the database schema

INSERT INTO progression (user_id, chapter_id, current_page, completed_date, score)
	VALUES
		(15,4,37,'2017-12-23 07:40:04',38.27),
		(11,4,41,'1992-12-13 21:07:03',85.03),
		(18,4,19,'2022-03-26 00:08:17',84.23),
		(6,3,21,'1975-07-31 01:02:23',44.72),
		(5,1,47,'1974-05-31 01:05:45',64.4),
		(4,1,13,'1983-12-04 00:56:34',66.05),
		(16,3,31,'2020-03-03 19:51:24',74.05),
		(13,3,60,'2016-03-26 06:44:18',36.63),
		(3,5,40,'1998-11-15 04:26:16',24.04),
		(6,1,12,'1982-07-29 06:31:21',4.16),
		(1,1,33,'1982-08-10 14:17:31',20.51),
		(14,4,13,'1975-06-22 22:39:39',14.46),
		(5,3,49,'2010-05-13 12:19:41',72.99),
		(19,5,21,'1991-06-18 05:04:00',49.85),
		(15,1,8,'1975-07-30 07:53:15',21.7),
		(16,5,28,'2018-06-19 19:48:46',1.49),
		(15,3,63,'1980-01-17 15:35:11',29.27),
		(13,2,44,'1973-01-02 06:40:07',60.54);