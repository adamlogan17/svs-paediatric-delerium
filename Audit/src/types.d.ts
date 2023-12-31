/**
 * @typedef RoleAutoComplete
 * 
 * @author Adam Logan
 * 
 * Represents a selection for a role in the database. This can be used for
 * autocomplete components or any similar UI elements which need both
 * a user-friendly label and a system-recognized role identifier.
 * 
 * @property {('PICU'|'Admin'|'Field Engineer')} label - The user-friendly display name of the role.
 * @property {Role} role - The internal system identifier for the role.
 */
type RoleAutoComplete = {
  label: 'PICU'|'Admin'|'Field Engineer';
  role: Role;
}

/**
 * Defines the various levels of severity.for the 'Alert' MUI component.
 * 
 * @author Adam Logan
 * 
 * @typedef Role
 * @property {"picu"} - Represents a PICU role.
 * @property {"admin"} - Represents an admin role.
 * @property {"field_engineer"} - Represents a field engineer role.
 */
type Role = 'picu'|'admin'|'field_engineer';

/**
 * Represents the available themes in the application.
 * 
 * @author Adam Logan
 * 
 * @typedef Themes
 * @property {"light"} - Represents a light theme.
 * @property {"dark"} - Represents a dark theme.
 * @property {"contrast"} - Represents a contrast theme.
 */
type Themes = 'light'|'dark'|'contrast' 

/**
 * Represents a key-value pair, where the key is a string label and the value can be of any type.
 * 
 * This type is used throughout the codebase in places where we need to associate a label (a string) with a value (of any type).
 * This is a flexible type that can be used to represent a wide variety of data structures.
 *
 * @author Adam logan
 * 
 * @typedef LabelValuePair
 * @property {string} label - The key of the pair, represented as a string.
 * @property {any} value - The value of the pair, which can be of any type.
 */
type LabelValuePair = {
  label:string,
  value:any
}

/**
 * @typedef Picu
 * 
 * @author Adam Logan
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
 * @property {number|null} [delirium_positive_patients] - Optional average of the number of patients that are delirium positive
 */
type Picu = {
  [key: string]: string|number|null|undefined, // allows the Picu['key'] syntax to work
  hospital_name:string, 
  ward_name:string, 
  picu_role:Role, 
  auditor:string, 
  password?:string, 
  picu_id?:string|number,
  overall_compliance?:number|null,
  delirium_positive_patients?:number|null
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
  entry_date?: Date,
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
 * @typedef Severity
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
 * @typedef BaseAlertProps
 * @property {string} message - The alert message to be displayed.
 * @property {Function} closeAction - Callback function to execute when the close button is clicked.
 * @property {Severity} [severity] - Represents the level of alert severity.
 * @property {React.ReactNode} [icon] - Optional custom icon for the alert.
 */
type BaseAlertProps = {
  message:string;
  closeAction:Function;
  severity?:any;
  icon?:React.ReactNode;
}

/**
 * @typedef PicuIDRole
 * 
 * @author Adam Logan
 * 
 * Represents the combination of PICU ID and Role.
 * 
 * @property {string} picu_id - The identifier for a PICU.
 * @property {Role} picu_role - The role associated with the PICU.
 */
type PicuIDRole = {
  picu_id: string,
  picu_role: Role
}

/**
 * Represents the data structure for a chart.
 * 
 * @author Adam Logan
 * 
 * @typedef ChartData
 * @property {string[]} xValues - The x-axis values for the chart.
 * @property {number[]} yValues - The y-axis values for the chart.
 */
type ChartData = {
  xValues: string[],
  yValues: number[]
}

/**
 * Properties for the Chart components.
 * 
 * @author Adam Logan
 * 
 * @typedef ChartProps
 * @property {ChartData} chartData - The data for the chart.
 * @property {string[]} chartData.xValues - The x-axis values for the chart.
 * @property {number[]} chartData.yValues - The y-axis values for the chart.
 * @property {string} [chartColor] - The color of the chart.
 * @property {string} [textColor] - The color of the text in the chart.
 * @property {string} title - The title of the chart.
 * @property {string} [xAxisLabel] - The label for the x-axis of the chart.
 * @property {string} [yAxisLabel] - The label for the y-axis of the chart.
 * @property {string} [gridColor] - The color of the grid in the chart.
 * @property {(x:string) => number|undefined} [convertXToNumber] - Optional function to convert x-axis values to numbers, which adds a trendline to the chart.
 */
type ChartProps = {
  chartData: ChartData,
  chartColor?: string,
  textColor?:string,
  title: string,
  xAxisLabel?:string,
  yAxisLabel?:string,
  gridColor?:string,
  convertXToNumber?:(x:string) => number|undefined,
}

/**
 * Represents the data type for a chart.
 * 
 * @author Adam Logan
 * 
 * @typedef ChartDataType
 * @property {LabelValuePair} - The label-value pair for the chart.
 * @property {(id:number) => Promise<ChartData>} getData - A function that retrieves the data for the chart based on an ID.
 * @property {(date:string) => number|undefined} [convertXToNums] - An optional function that converts the X-axis values to numbers.
 * @property {Function} [filter] - An optional function used to filter the chart data.
 * @property {string} [xAxisLabel] - The label for the x-axis of the chart.
 * @property {string} [yAxisLabel] - The label for the y-axis of the chart.
 * @property {Function<ChartData>} [downSample] - A function which will down sample the data, to fit within a chart
 */
type ChartDataType = LabelValuePair & {
  getData: (id:number) => Promise<ChartData>,
  convertXToNums?: (date:string) => number|undefined,
  filter?: Function,
  xAxisLabel?:string,
  yAxisLabel?:string,
  downSample?:Function<ChartData>
}