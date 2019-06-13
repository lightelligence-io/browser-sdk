/**
 * @private
 * Holds environment information
 */
class UserManagerProvider {
  /**
   * Returns environment
   */
  get() {
    return this.userManager;
  }

  /**
   * Sets environment
   * @param {object} userManager oidc UserManagement instance
   */
  set(userManager) {
    this.userManager = userManager;
  }

  /**
   * Clears environment
   */
  clear() {
    this.userManager = undefined;
  }
}

const provider = new UserManagerProvider();

export default provider;
