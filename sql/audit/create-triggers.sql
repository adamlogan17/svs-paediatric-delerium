-- Triggers for the 'compliance_data' table

-- Calculates the 'score' field within the 'compliance_data' table
CREATE FUNCTION calculate_score() 
RETURNS trigger AS $calculate_score$
BEGIN
    UPDATE compliance_data SET score=(SELECT ((((correct_details::INTEGER + comfort_recorded::INTEGER
        + all_params_scored::INTEGER + totalled_correctly::INTEGER + observer_name::INTEGER)/5.0)* comfort_recorded::INTEGER)*100) 
        FROM compliance_data WHERE comp_id = NEW.comp_id) WHERE comp_id = NEW.comp_id;

    RETURN NEW;
END;
$calculate_score$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sets a update trigger on the fields used to calculate the 'score' field within the 'compliance_comp' table
CREATE TRIGGER update_calc_score
    AFTER UPDATE OF correct_details, comfort_above
    ON compliance_data
    FOR EACH ROW
    EXECUTE PROCEDURE calculate_score();

-- Calculates the score field when data is inserted into the 'compliance_comp' table
CREATE TRIGGER insert_calc_score
    AFTER INSERT
    ON compliance_data
    FOR EACH ROW
    EXECUTE PROCEDURE calculate_score();

-- Triggers to update the total score for picus

-- Calculates the 'overall_compliance' field within the 'picu' table
CREATE FUNCTION calculate_overall_score() 
RETURNS trigger AS $calculate_overall_score$
BEGIN
    UPDATE picu SET overall_compliance=(SELECT AVG(score) FROM compliance_data WHERE picu_id=NEW.picu_id) WHERE picu_id=NEW.picu_id;
    RETURN NEW;
END;
$calculate_overall_score$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculates the 'overall_compliance' field, within the 'picu' table, when data is inserted into the 'compliance_data' table
CREATE TRIGGER insert_overall_score
    AFTER INSERT
    ON compliance_data
    FOR EACH ROW
    EXECUTE PROCEDURE calculate_overall_score();

-- Calculates the 'overall_compliance' field, within the 'picu' table, when the 'score' field is updated in the 'compliance_data' table
CREATE TRIGGER update_overall_score
    AFTER UPDATE OF score
    ON compliance_data
    FOR EACH ROW
    EXECUTE PROCEDURE calculate_overall_score();
