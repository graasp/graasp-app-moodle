import Qs from 'qs';

export const addQueryParamsToUrl = (obj) => {
  const params = {
    ...Qs.parse(window.location.search, { ignoreQueryPrefix: true }),
    ...obj,
  };
  return `?${Qs.stringify(params)}`;
};

/**
 * Example usage: buildUrlWithQueryParams('google.com/search', {q: 'the search term'})
 *       returns: 'google.com/search?q=the
 * @param {string} url on which the params shall be added
 * @param {*} params object containing key/value pairs that will be added to the url
 * @returns {string} url with unencoded query params
 */
export const buildUrlWithQueryParams = (url, params) => {
  return `${url}?${Qs.stringify(params, { encode: true })}`;
};
