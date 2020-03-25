export abstract class IFormat {
  /**
     * Converts an object into a string representation
     * @param object Object to marshal
     * @param color Use color to highlight keys and values
     * @param compact Use a more spaced out version or a as small a possible representation
     */
  abstract Marshal(object: any, color: boolean, compact: boolean): string;

  /**
     * Converts an object from a string representation back into an object
     * @param object 
     */
  abstract Unmarshal(object: string): any;

  /**
     * States if the parameter is of this type
     * @param object The object in question
     */

  abstract IsOfType(object: string): boolean;
}
