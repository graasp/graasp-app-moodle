/* eslint no-unused-vars: off */
/* eslint class-methods-use-this: off */
/**
 * An abstract class representing the interaction with a specific LMS for data import.
 *
 * As part of a strategy pattern, this class takes the role of the AbstractStrategy class.
 *
 * Each implementation of this class is responsible of storing the lmsBaseUrl and
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
   * @param {string} lmsBaseUrl which should be used to send this and the following requests to
   * @param {string} username used for authentication
   * @param {string} password used for authentication
   * @returns {boolean} true if succeeded and false if not
   */
  async getToken(lmsBaseUrl, username, password) {
    throw new Error("Method 'getToken()' must be implemented.");
  }

  /**
   * Get a list of all available courses for this user.
   * @returns {*} a list of of available courses containing at least their ids
   */
  async getAvailableCourses() {
    throw new Error("Method 'getAvailableCourses()' must be implemented.");
  }

  /**
   * Load data for selected courses through API.
   * @param {(string|number)[]} selectedCoursesIds
   * @returns {*} the exported data
   */
  async getCourseData(selectedCoursesIds) {
    throw new Error("Method 'getCourseData()' must be implemented.");
  }
}

export default ApiRequests;
