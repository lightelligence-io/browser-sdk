import ApiService from '../tools/apiService';

/**
 * Methods for timeseries operations
 */
export default class Timeseries {
  /**
   * Get data for the last hour reported to the timeseries db by the device with the given uuid in an descending order.
   * @param {string} deviceId
   * @param {object} params
   * @param {string} params.path Path matching to a path defined in the reporting rules of the device's type. (e.g. $.attributes.brightness).
   * @returns {Promise}
   */
  static getDeviceLastTimeseries(deviceId, params) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(`/devices/${deviceId}/last-timeseries?${urlParams.toString()}`);
  }

  /**
   * Delete reported timeseries data of the device belonging to the given uuid.
   * @param {string} deviceId
   * @param {object} params
   * @param {string} params.path Path matching to a path defined in the reporting rules of the device's type. (e.g. $.attributes.brightness).
   * @param {string} params.startTime The start time of the time frame to request. (RFC 3339)
   * @param {string} params.endTime The end time of the time frame to request. (RFC 3339)
   * @returns {Promise}
   */
  static deleteDeviceTimeseries(deviceId, params) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(`/devices/${deviceId}/timeseries?${urlParams.toString()}`, 'DELETE');
  }

  /**
   * Get data for the last hour reported to the timeseries db by the device with the given uuid in an descending order.
   * @param {string} deviceId
   * @param {object} params
   * @param {string} params.path Path matching to a path defined in the reporting rules of the device's type. (e.g. $.attributes.brightness).
   * @param {string} params.startTime The start time of the time frame to request. (RFC 3339)
   * @param {string} params.endTime The end time of the time frame to request. (RFC 3339)
   * @param {number} params.limit The limit of the points returned in one query.
   * @param {string} params.frameSize The time frame size in which the values should be aggregated. In case frameSize is set and the number of points in the response will exceed the limit, an error (400) will be returned. Available values : 1m, 5m, 30m, 1h, 1d
   * @param {string} params.aggregation How should the values be aggregated. Supported values: min, max, mean, sum, count, diff, first, last. Available values : min, max, mean, sum, count, diff, first, last
   * @returns {Promise}
   */
  static getDeviceAggregatedTimeseries(deviceId, params) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(`/devices/${deviceId}/aggregated-timeseries?${urlParams.toString()}`);
  }
}
