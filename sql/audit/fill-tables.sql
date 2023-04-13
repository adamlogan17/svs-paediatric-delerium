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
        (now(), 'SOSPD', 1, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, 1),
        (now(), 'SOSPD', 1, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, 1);