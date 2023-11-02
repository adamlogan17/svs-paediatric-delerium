/**
 * @typedef RoleAutoComplete
 * 
 * Represents a selection for a role in the database. This can be used for
 * autocomplete components or any similar UI elements which need both
 * a user-friendly label and a system-recognized role identifier.
 * 
 * @property {('PICU'|'Admin'|'Field Engineer')} label - The user-friendly display name of the role.
 * @property {('picu'|'admin'|'field_engineer')} role - The internal system identifier for the role.
 */
type RoleAutoComplete = {
  label: 'PICU'|'Admin'|'Field Engineer';
  role: 'picu'|'admin'|'field_engineer';
}

type AutoCompleteValues = {
  label:string,
  value:any
}

/**
 * @typedef Picu
 * 
 * Represents a PICU (Paediatric Intensive Care Unit) entity in the system. This can be used for
 * storing information related to a particular PICU.
 * 
 * @property {string} hospital_name - The name of the hospital where the PICU is located.
 * @property {string} ward_name - The specific name of the PICU ward.
 * @property {string} picu_role - Role assigned within the PICU, within the database.
 * @property {string} auditor - The individual responsible for auditing within this PICU.
 * @property {string} password - Password associated with the PICU, possibly for access control.
 * @property {string|number} [picu_id] - Optional unique identifier for the PICU.
 * @property {number|null} [overall_compliance] - Optional overall compliance score for the PICU, which is calculated within the database.
 */
type Picu = {
  [key: string]: string|number|null|undefined, // allows the Picu['key'] syntax to work
  hospital_name:string, 
  ward_name:string, 
  picu_role:string, 
  auditor:string, 
  password?:string, 
  picu_id?:string|number,
  overall_compliance?:number|null,
}

/**
 * @typedef ComplianceData
 * 
 * Represents a compliance record within the system, which is used to store
 * data related to certain standards or metrics of care.
 * 
 * @property {number} [comp_id] - Optional unique identifier for the compliance record.
 * @property {Date} entry_date - The date the record was entered into the system.
 * @property {'SOSPD' | 'CAPD'} method - The method used, either SOSPD or CAPD.
 * @property {number} bed_number - Identifier for the bed associated with the record.
 * @property {boolean} correct_details - Whether the correct details were provided.
 * @property {boolean} comfort_recorded - Whether comfort was recorded for the patient.
 * @property {boolean} comfort_above - Whether the comfort recorded was above a certain threshold.
 * @property {boolean} all_params_scored - Whether all parameters were scored.
 * @property {boolean} totalled_correctly - Whether scores were totalled correctly.
 * @property {boolean} in_score_range - Whether the score was in the acceptable range.
 * @property {boolean} observer_name - Whether the observer's name was provided.
 * @property {number} [score] - Optional score, if applicable.
 * @property {number} picu_id - Identifier for the PICU associated with the record.
 */
type ComplianceData = {
  [key: string]: string|number|null|undefined|boolean|Date,
  comp_id?: number,
  entry_date: Date,
  method: 'SOSPD' | 'CAPD',
  bed_number: number,
  correct_details: boolean,
  comfort_recorded: boolean,
  comfort_above: boolean,
  all_params_scored: boolean,
  totalled_correctly: boolean,
  in_score_range: boolean,
  observer_name: boolean,
  score?: number,
  picu_id: number,
};

/**
 * Defines the various levels of severity.for the 'Alert' MUI component.
 * 
 * @author Adam Logan
 * 
 * @typedef {object} Severity
 * @property {"error"} - Represents an error message.
 * @property {"success"} - Represents a success message.
 * @property {"info"} - Represents an informational message.
 * @property {"warning"} - Represents a warning message.
 * @property {undefined} - Represents an unspecified severity.
 */
type Severity = "error" | "success" | "info" | "warning" | undefined;

/**
 * Defines the properties for the BaseAlert component.
 * 
 * @author Adam Logan
 * 
 * @typedef {object} BaseAlertProps
 * @property {string} message - The alert message to be displayed.
 * @property {Function} closeAction - Callback function to execute when the close button is clicked.
 * @property {any} [severity] - Represents the level of alert severity.
 * @property {React.ReactNode} [icon] - Optional custom icon for the alert.
 */
type BaseAlertProps = {
  message:string;
  closeAction:Function;
  severity?:any;
  icon?:React.ReactNode;
}