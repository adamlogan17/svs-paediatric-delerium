-- Triggers for the 'compliance_data' table

-- Calculates the 'score' field within the 'compliance_data'
CREATE FUNCTION calculate_score() 
RETURNS trigger AS $calculate_score$
BEGIN
    UPDATE compliance_data SET score=(SELECT (correct_details::INTEGER + comfort_above::INTEGER) FROM compliance_data WHERE comp_id = NEW.comp_id) WHERE comp_id = NEW.comp_id;

    RETURN NEW;
END;
$calculate_score$ LANGUAGE plpgsql;

-- Sets a update trigger on the fields used to calculate the 'score' field
CREATE TRIGGER update_calc_score
    AFTER UPDATE OF correct_details, comfort_above
    ON compliance_data
    FOR EACH ROW
    EXECUTE PROCEDURE calculate_score();

-- Calculates the score field when data is inserted into the 'compliance_comp' field
CREATE TRIGGER insert_calc_score
    AFTER INSERT
    ON compliance_data
    FOR EACH ROW
    EXECUTE PROCEDURE calculate_score();