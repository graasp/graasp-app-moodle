import ApiRequests from './ApiRequests';
import { buildUrlWithQueryParams } from '../utils/url';

const TOKEN_ENDPOINT = 'login/token.php';
const WEB_SERVICE_ENDPOINT = 'webservice/rest/server.php';

/**
 * Will be set once the connection is established.
 */
class MoodleApiRequests extends ApiRequests {
  /**
   * Get a token for future authentication and store it locally.
   * @param {string} lmsBaseUrl which should be used to send this and the following requests to
   * @param {string} username used for authentication
   * @param {string} password used for authentication
   * @returns {boolean} true if succeeded and false if not
   */
  async getToken(lmsBaseUrl, username, password) {
    const url = `${lmsBaseUrl}/${TOKEN_ENDPOINT}`;
    const params = {
      username,
      password,
      service: 'wafed_webservices',
    };
    const moodleTokenEndpoint = buildUrlWithQueryParams(url, params);
    return fetch(moodleTokenEndpoint)
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          // Only store the current apiToken and lmsBaseUrl when a token could have been retrieved
          this.currentApiToken = data.token;
          this.currentLmsBaseUrl = lmsBaseUrl;
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
   * @returns {*} a list of of available courses containing at least their ids
   */
  async getAvailableCourses() {
    const url = `${this.currentLmsBaseUrl}/${WEB_SERVICE_ENDPOINT}`;
    const params = {
      wstoken: this.currentApiToken,
      wsfunction: 'local_wafed_moodle_webservice_plugin_get_available_courses',
      moodlewsrestformat: 'json',
    };
    const moodleAvailableCoursesEndpoint = buildUrlWithQueryParams(url, params);
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
   * @param {(string|number)[]} selectedCoursesIds
   * @returns {*} the exported data
   */
  async getCourseData(selectedCoursesIds) {
    const url = `${this.currentLmsBaseUrl}/${WEB_SERVICE_ENDPOINT}`;
    const params = {
      wstoken: this.currentApiToken,
      wsfunction: 'local_wafed_moodle_webservice_plugin_get_course_data',
      courseids: selectedCoursesIds, // only take the course id from the object
      moodlewsrestformat: 'json',
    };
    const moodleDataExportEndpoint = buildUrlWithQueryParams(url, params);
    const sourceUrl = this.currentLmsBaseUrl; // store in local variable because this is not accessible from promise
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
