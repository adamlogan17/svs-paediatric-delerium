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
  [key: string]: string|number|null|undefined; // allows the Picu['key'] syntax to work
  hospital_name:string, 
  ward_name:string, 
  picu_role:string, 
  auditor:string, 
  password?:string, 
  picu_id?:string|number,
  overall_compliance?:number|null,
}

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