/* eslint no-unused-vars: off */
/* eslint class-methods-use-this: off */
/**
 * An abstract class representing the interaction with a specific LMS for data import.
 *
 * Each implementation of this class is responsible of storing the apiEndpoint and
 * apiToken retrieved in getToken internally in the class.
 */
class ApiRequests {
  constructor() {
    if (this.constructor === ApiRequests) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  /**
   * Get a token for future authentication and store it locally.
   * @param {string} apiEndpoint which should be used to send this and the following requests to
   * @param {string} username used for authentication
   * @param {string} password used for authentication
   * @returns {boolean} true if succeeded and false if not
   */
  async getToken(apiEndpoint, username, password) {
    throw new Error("Method 'getToken()' must be implemented.");
  }

  /**
   * Get a list of all available courses for this user.
   * The result is stored in the state of the component.
   * @returns {(string|number)[]} a list of ids of available courses
   */
  async getAvailableCourses() {
    throw new Error("Method 'getAvailableCourses()' must be implemented.");
  }

  /**
   * Load data for selected courses through API.
   * Calls the callback passed in by the parant component.
   * @param {(string|number)[]} selectedCourses
   * @returns {*} the exported data
   */
  async getCourseData() {
    throw new Error("Method 'getCourseData()' must be implemented.");
  }
}

export default ApiRequests;
