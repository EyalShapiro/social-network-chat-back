/**
 * Safely parses a JSON string into an object.
 *
 * If the input is falsy, it defaults to an empty object string (`{}`).
 * On parsing failure, it logs a warning in non-production environments
 * and returns an empty object.
 *
 * @param {string} str - The JSON string to parse.
 * @returns {object} The parsed object if successful, otherwise an empty object.
 */
export function parseObj(str: any) {
  try {
    return JSON.parse(str || '{}');
  } catch (error) {
    if (!IS_PROD) console.warn('Failed to parse JSON string:', error);
    return {};
  }
}

/**
 * Safely stringifies a JavaScript value into a JSON string.
 *
 * On stringification failure, it logs a warning in non-production environments
 * and returns an empty object string (`{}`).
 *
 * @param {any} value - The value to stringify.
 * @returns {string} The JSON string if successful, otherwise `"{}"`.
 */
export function stringifyObj(value: any) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    if (!IS_PROD) console.warn('Failed to stringify object:', error);
    return '{}';
  }
}
