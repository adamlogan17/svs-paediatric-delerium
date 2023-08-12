/**
 * Converts error codes into a more descriptive error message.
 * 
 * This function maps specific database error codes to their corresponding messages.
 * If the code is not recognized, it defaults to "Unknown Error".
 * 
 * @author Adam Logan
 * @function addPicu
 * @param {string} code - The error code from the database.
 * @returns {string} A descriptive error message.
 */
export default function errorCodeMessage(code:string):string {
  let result:string = "ERROR: ";

  // Logs the error code for debugging purposes.
  console.log(code);
  
  switch (code) {
    case '42P01':
      result += "Table does not exist";
      break;
    case '3D000':
      result += "Database does not exist";
      break;
    case '23514':
      result += "Invalid data attempted to be added to database";
      break;
    case '42703':
      result += "Column does not exist in database";
      break;
    default:
      result += "Unknown Error";
  }
  return result;
}
