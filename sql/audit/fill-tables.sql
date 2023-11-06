-- Initial 'picu' data

INSERT INTO picu (ward_name, hospital_name, auditor, password) 
    VALUES 
        ('Adamstown','Pitcairn Islands','Iona Thomas', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Camp Thunder Cove','British Indian Ocean Territory','Paul Candler', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Maseru','Lesotho','Sam Matekane', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Rabat','Morocco','Aziz Akhannouch', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Riga','Latvia','Egils Levits', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Ulaanbaatar','Mongolia','Luvsannamsrain Oyun-Erdene', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Vaduz','Liechtenstein','Daniel Risch', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Caracas','Venezuela','Nicolas Maduro', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Riyadh','Saudi Arabia','Mohammed bin Salman', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Riyadh','El Salvador','Nayib Bukele', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Skopje','North Macedonia','Stevo Pendarovski', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('South Tarawa','Kiribati','Taneti Maamau', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Port of Spain','Trinidad and Tobago','Keith Rowley', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Philipsburg','Sint Maarten','Silveria Jacobs', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Port Louis','Mauritius','Pravind Jugnauth', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('NDjamena','Chad','Saleh Kebzabo', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Muscat','Oman','Haitham bin Tariq', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Pago Pago','American Samoa','Lemanu Peleti Mauga', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Papeete','French Polynesia','Edouard Fritch', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Nuuk','Greenland','Julie Prast Wilche', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Ottawa','Canada','Justin Trudeau', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Monrovia','Liberia','George Weah', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi'),
        ('Nassau','Bahamas','Philip Davis', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi');

INSERT INTO picu (ward_name, hospital_name, auditor, password, picu_role)
    VALUES
        ('Adamstown','Pitcairn Islands','Iona Thomas', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi', 'admin'),
        ('Adamstown','Pitcairn Islands','Iona Thomas', '$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi', 'field_engineer');

-- Initial 'compliance_data'
INSERT INTO compliance_data (entry_date, method, bed_number, correct_details, 
    comfort_recorded, comfort_above, all_params_scored, totalled_correctly, 
    in_score_range, observer_name, picu_id)
    VALUES
        (now(), 'SOSPD', 1, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 2),
        (now(), 'SOSPD', 1, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 2),
        (now(), 'CAPD', 1, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 2),
        (now(), 'SOSPD', 1, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 1),
        (now(), 'SOSPD', 1, FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, 22),
        (now(), 'SOSPD', 1, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, 1);


INSERT INTO compliance_data (entry_date, method, bed_number, picu_id, correct_details, comfort_recorded, comfort_above, all_params_scored, totalled_correctly, in_score_range, observer_name)
	VALUES
		('1985-06-12 10:31:47','CAPD',361,1,False,True,False,True,True,False,True),
		('2005-11-26 02:59:00','CAPD',365,1,True,False,False,True,True,False,True),
		('1980-12-30 15:34:42','CAPD',166,1,True,False,True,False,False,False,True),
		('1998-03-14 02:16:52','CAPD',181,1,True,False,False,True,False,False,False),
		('1970-05-21 08:21:44','SOSPD',235,1,False,False,False,False,True,False,True),
		('1981-11-17 12:39:36','SOSPD',266,1,False,True,False,True,True,True,False),
		('1991-10-17 02:03:43','CAPD',211,1,True,True,False,False,True,True,False),
		('2022-04-22 19:02:57','SOSPD',120,1,False,True,False,True,False,False,False),
		('2015-02-08 14:22:39','SOSPD',86,1,True,False,True,False,True,True,True),
		('2005-10-15 07:21:44','SOSPD',143,1,True,False,False,True,False,True,True),
		('1987-10-07 11:09:24','SOSPD',303,1,True,False,False,False,False,False,False),
		('1993-04-26 23:24:22','CAPD',143,1,True,False,True,False,True,False,False),
		('2002-03-30 07:08:48','SOSPD',176,1,True,False,True,True,False,False,True),
		('1973-01-19 09:22:29','CAPD',151,1,True,False,False,True,False,True,True),
		('2015-10-25 08:28:56','CAPD',381,1,True,True,False,False,False,True,False),
		('1972-01-16 20:31:59','SOSPD',159,1,True,False,False,True,False,False,True),
		('1970-11-07 20:05:23','SOSPD',82,1,False,True,False,True,True,False,False),
		('1979-12-30 05:38:50','SOSPD',382,1,False,False,False,True,False,False,True),
		('2017-11-26 14:33:24','CAPD',219,1,False,True,False,False,False,True,True),
		('2005-02-06 02:13:56','CAPD',19,1,True,False,False,False,True,True,False);
