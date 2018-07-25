/**
 * @private
 * Holds environment information
 */
class EnvironmentProvider {
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
}

const provider = new EnvironmentProvider();

export default provider;
