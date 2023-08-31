export {}; // this is to ensure this file is parsed as a module, not a global script

/**
 * Retrieves a string value associated with a key from FormData. 
 * If the value doesn't exist or is falsy, an empty string is returned.
 * 
 * @author Adam Logan
 * @function getStringValue
 * 
 * @param {string} key - The key to retrieve the value for from FormData.
 * @param {FormData} data - The FormData object from which the value should be retrieved.
 * @returns {string} The string value associated with the key, or an empty string if it doesn't exist.
 */
export function getStringValue(key: string, data:FormData):string {
  let value = data.get(key);
  value = value ? value.toString().trim() : "";
  return value;
}

/**
 * Checks a given condition and sets an error message if the condition is true.
 * It also sets a loading state to false, typically used to stop loading spinners.
 * 
 * @author Adam Logan
 * @function checkAndSetError
 * 
 * @param {boolean} condition - The condition to check. If true, an error message is set.
 * @param {Function} setErrorFunction - Function to set the error message.
 * @param {string} errorMessage - The error message to set if the condition is true.
 * @param {Function} setIsLoading - Function to set the loading state.
 * @returns {boolean} True or false depending on the provided condition.
 */
export function checkAndSetError(condition:boolean, setErrorFunction:Function, errorMessage:string, setIsLoading:Function) {
  if (condition) {
    setErrorFunction(errorMessage);
    setIsLoading(false);
  } else {
    setErrorFunction("");
  }
  return condition;
}