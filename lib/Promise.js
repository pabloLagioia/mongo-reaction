var EventEmitter = require("events").EventEmitter;

/**
 * Lightweight promise class
 * @constructor
 */
function Promise() {
    this.events = new EventEmitter;
}
/**
 * Adds a listener to the success event
 * @param callback
 * @returns {Promise}
 */
Promise.prototype.success = function(callback) {
    this.events.addListener("success", callback);
    return this;
};
/**
 * Adds a listener to the error event
 * @param callback
 * @returns {Promise}
 */
Promise.prototype.error = function(callback) {
    this.events.addListener("err", callback);
    return this;
};

module.exports = Promise;