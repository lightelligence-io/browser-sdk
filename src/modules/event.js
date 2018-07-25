import ApiService from '../tools/apiService';

/**
 * Methods for device event operations
 */
export default class Event {
  /**
   * Retrieve the last days events.
   * @param {string} deviceId
   * @param {object} params
   * @param {string} [eventTypes=undefined] A comma separated list of event types used as a filter. So only events with one of this events assigned will be returned.
   * @returns {Promise}
   */
  static getEvents(deviceId, params) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(`/devices/${deviceId}/events?${urlParams.toString()}`);
  }

  /**
   * Push a event, to add it to the devices events.
   * @param {string} deviceId
   * @param {object} event
   * @returns {Promise}
   */
  static createEvent(deviceId, event) {
    const post = { ...event, deviceId };
    return ApiService.call('/event-ingest', 'POST', post);
  }
}
