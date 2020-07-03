import ApiRequests from './ApiRequests';
/**
 * Will be set once the connection is established.
 */
class MoodleApiRequests extends ApiRequests {
  /**
   * Get a token for future authentication and store it locally.
   * @param {string} apiEndpoint which should be used to send this and the following requests to
   * @param {string} username used for authentication
   * @param {string} password used for authentication
   * @returns {boolean} true if succeeded and false if not
   */
  async getToken(apiEndpoint, username, password) {
    // the name of the web service in moodle, which will then be used for the export/import of data
    const moodleService = 'wafed_webservices';
    const moodleTokenEndpoint = `${apiEndpoint}login/token.php?username=${username}&password=${password}&service=${moodleService}`;
    // get the token to be authenticated later
    return fetch(moodleTokenEndpoint)
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          this.currentApiToken = data.token;
          this.currentApiEndpoint = apiEndpoint;
          return true;
        }
        return false;
      })
      .catch((error) => {
        console.error('Error:', error);
        return false;
      });
  }

  /**
   * Get a list of all available courses for this user.
   * @returns {(string|number)[]} a list of ids of available courses
   */
  async getAvailableCourses() {
    const wsFunction =
      'local_wafed_moodle_webservice_plugin_get_available_courses';
    const moodleAvailableCoursesEndpoint = `${this.currentApiEndpoint}/webservice/rest/server.php?wstoken=${this.currentApiToken}&wsfunction=${wsFunction}&moodlewsrestformat=json`;
    return fetch(moodleAvailableCoursesEndpoint)
      .then((res) => res.json())
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error('Error:', error);
        return false;
      });
  }

  /**
   * Load data for selected courses through API.
   * Calls the callback passed in by the parant component.
   * @param {(string|number)[]} selectedCourses
   * @returns {*} the exported data
   */
  async getCourseData(selectedCourses) {
    let courseParams = '';
    selectedCourses.forEach((course, index) => {
      courseParams += `&courseids[${index}]=${course.courseid}`;
    });
    const moodleDataExportEndpoint = `${this.currentApiEndpoint}/webservice/rest/server.php?wstoken=${this.currentApiToken}&wsfunction=local_wafed_moodle_webservice_plugin_get_course_data&moodlewsrestformat=json${courseParams}`;
    const sourceUrl = this.currentApiEndpoint;
    return fetch(moodleDataExportEndpoint)
      .then((response) => response.json())
      .then((data) => {
        return { sourceUrl, data };
      })
      .catch((error) => {
        console.error('Error:', error);
        return false;
      });
  }
}

export default MoodleApiRequests;
