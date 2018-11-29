/**
 * @private
 * Holds environment information
 */
class EnvironmentProvider {
  constructor() {
    this.envs = {
      dev: 'dev.olt-dev.io',
      int: 'int.olt-dev.io',
      preview: 'olt-preview.io',
      prod: 'lightelligence.io',
    };
  }

  /**
   * Returns environment
   */
  get() {
    return this.environment;
  }

  /**
   * Sets environment
   * @param {object} environment
   */
  set(environment) {
    this.environment = environment;
  }

  /**
   * Clears environment
   */
  clear() {
    this.environment = undefined;
  }

  /**
   * Get the base url for one of the existing environments
   * @param {The enviroment to request the url for} environment
   * @returns The url as a string
   */
  getBaseUrlFromEnv(environment) {
    return this.envs[environment];
  }
}

const provider = new EnvironmentProvider();

export default provider;
