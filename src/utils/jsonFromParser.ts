import { IS_PROD } from '../config';
import logger from '../config/logger';

/**
 * Safely parses a JSON string into a value of type `T`.
 *
 * - If the input string is falsy, it returns the provided `fallbackValue`.
 * - On parsing failure, it logs a warning in non-production environments
 *   and returns the provided `fallbackValue`.
 *
 * @template T - The expected return type. Typically an `object` or `array`.
 * @param {string | null | undefined} jsonString - The JSON string to parse.
 * @param {T} [fallbackValue={}] - The fallback value if parsing fails.
 * @default {}
 * @returns {T} The parsed value if successful, otherwise `fallbackValue`.
 */
export function parseJson<T extends object | unknown[]>(
  jsonString: string | null | undefined,
  fallbackValue: T = {} as T
): T {
  try {
    if (!jsonString) return fallbackValue;
    return JSON.parse(jsonString);
  } catch (error) {
    if (!IS_PROD) logger.warn('Failed to parse JSON string:', error);
    return fallbackValue;
  }
}

/**
 * Safely stringifies a JavaScript value into a JSON string.
 *
 * - If the value is `null`, `undefined`, or stringification fails,
 *   it logs a warning in non-production environments
 *   and returns the provided `fallbackValue`.
 *
 * @template T - The type of the value to stringify.
 * @param {T} data - The value to stringify.
 * @param {string} [fallbackValue="{}"] - The fallback string if stringification fails.
 * @default "{}"
 * @returns {string} The JSON string if successful, otherwise `fallbackValue`.
 */
export function stringifyJson<T = unknown>(data: T, fallbackValue: string = '{}'): string {
  try {
    if (data === null || data === undefined) throw new Error('No data to stringify');
    return typeof data === 'string' ? data : JSON.stringify(data);
  } catch (error) {
    if (!IS_PROD) logger.warn('Failed to stringify object:', error);
    return fallbackValue;
  }
}
