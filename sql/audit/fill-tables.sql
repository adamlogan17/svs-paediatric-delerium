-- Initial 'picu' data

INSERT INTO picu (ward_name, hospital_name, auditor, password) 
    VALUES 
        ('Adamstown','Pitcairn Islands','Iona Thomas', 'pass1'),
        ('Camp Thunder Cove','British Indian Ocean Territory','Paul Candler', 'pass1'),
        ('Maseru','Lesotho','Sam Matekane', 'pass1'),
        ('Rabat','Morocco','Aziz Akhannouch', 'pass1'),
        ('Riga','Latvia','Egils Levits', 'pass1'),
        ('Ulaanbaatar','Mongolia','Luvsannamsrain Oyun-Erdene', 'pass1'),
        ('Vaduz','Liechtenstein','Daniel Risch', 'pass1'),
        ('Caracas','Venezuela','Nicolas Maduro', 'pass1'),
        ('Riyadh','Saudi Arabia','Mohammed bin Salman', 'pass1'),
        ('Riyadh','El Salvador','Nayib Bukele', 'pass1'),
        ('Skopje','North Macedonia','Stevo Pendarovski', 'pass1'),
        ('South Tarawa','Kiribati','Taneti Maamau', 'pass1'),
        ('Port of Spain','Trinidad and Tobago','Keith Rowley', 'pass1'),
        ('Philipsburg','Sint Maarten','Silveria Jacobs', 'pass1'),
        ('Port Louis','Mauritius','Pravind Jugnauth', 'pass1'),
        ('NDjamena','Chad','Saleh Kebzabo', 'pass1'),
        ('Muscat','Oman','Haitham bin Tariq', 'pass1'),
        ('Pago Pago','American Samoa','Lemanu Peleti Mauga', 'pass1'),
        ('Papeete','French Polynesia','Edouard Fritch', 'pass1'),
        ('Nuuk','Greenland','Julie Prast Wilche', 'pass1'),
        ('Ottawa','Canada','Justin Trudeau', 'pass1'),
        ('Monrovia','Liberia','George Weah', 'pass1'),
        ('Nassau','Bahamas','Philip Davis', 'pass1');

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
        (now(), 'SOSPD', 1, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, 1),
        (now(), 'SOSPD', 1, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, 1);