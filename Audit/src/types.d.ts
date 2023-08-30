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
 * @property {string} [picu_id] - Optional unique identifier for the PICU.
 */
type Picu = {
  hospital_name:string, 
  ward_name:string, 
  picu_role:string, 
  auditor:string, 
  password:string, 
  picu_id?:string
}