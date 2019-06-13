import ApiService from '../tools/apiService';

/**
 * Methods for client operations
 */
export default class Consumption {
  /**
   * Get summary of consumption during period.
   *
   * @param {object} params
   * @param {string} [params.startTime] start time for the requested summary
   * @param {string} [params.endTime] end time for the requested summary
   * @param {array} [params.unit] the units to return, available values: devices, storageSamples, users
   *
   * @returns {Promise}
   */
  static getSummary(params) {
    const urlParams = new URLSearchParams({
      startTime: params.startTime,
      endTime: params.endTime,
    });

    // append unit array to search params
    if (params && params.unit) {
      params.unit.forEach(value => {
        urlParams.append('unit', value);
      });
    }

    return ApiService.call(`/consumption/summary?${urlParams.toString()}`);
  }
}
