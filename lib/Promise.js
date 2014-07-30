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
    if ( this._needsToCatchUp ) {
        callback(this._needsToCatchUp);
    } else {
        this.events.addListener("success", callback);
    }
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
Promise.prototype.succeed = function(data) {
    if ( !this.events.success ) {
        this._needsToCatchUp = data;
    }
    this.events.emit("success", data);
    return this;
};
Promise.prototype.found = function(callback) {
    this.events.addListener("found", callback);
    return this;
};
Promise.prototype.notFound = function(callback) {
    this.events.addListener("notFound", callback);
    return this;
};

module.exports = Promise;