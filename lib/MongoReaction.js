var Promise = require('./Promise'),
    EventEmitter = require("events").EventEmitter,
    MongoClient = require('mongodb').MongoClient;

/**
 * Lightweight MongoDB promise driven library
 * @author Pablo Lagioia <plagioia@tbxnet.com>
 */
var MongoReaction = {
    /**
     * Default path for mongo db.
     * In case there is no mappings for a given db at the time MongoReaction.db(dbName) is called then the folliwing
     * path will be used and add a mapping
     */
    defaultMongoPath: "mongodb://127.0.0.1/",
    /**
     * @private
     */
    _storedDBs: {
    },
    /**
     * @private
     */
    _mappings: {
    },
    /**
     *
     * @param path
     * @returns {*}
     * @private
     */
    _getFromMapping: function(path) {
        for ( var i in this._mappings ) {
            if ( this._mappings[i] == path ) {
                return i;
            }
        }
        return null;
    },
    /**
     * Returns an array containing the names of the dbs that were allocated in the pool
     * @returns {Array}
     */
    getStoredDBNames: function() {
        return Object.keys(this._storedDBs);
    },
    /**
     * Returns an array containing the names of the dbs which have a mapping
     * @returns {Array}
     */
    getMappedDBNames: function() {
        return Object.keys(this._mappings);
    },
    /**
     *
     * @param dbName
     * @param collectionName
     * @param callback
     * @returns {Promise}
     * @private
     */
    _proxy: function(dbName, collectionName, callback) {

        var eventEmitter = new EventEmitter(),
            promise = new Promise(),
            dbName = arguments[0],
            collectionName = arguments[1],
            mappedDBName,
            storedDB,
            self = this;

        eventEmitter.addListener("connected", function(db) {
            eventEmitter.emit("collectionGot", db.collection(collectionName));
        });

        eventEmitter.addListener("collectionGot", function(collection) {
            callback(collection, promise);
        });

        mappedDBName = dbName;

        dbName = this._mappings[dbName] || dbName;

        storedDB = self._storedDBs[mappedDBName || dbName];

        if ( storedDB ) {

            eventEmitter.emit("connected", self._storedDBs[dbName]);

        } else {

            if ( !storedDB && dbName == mappedDBName ) {
                dbName = "mongodb://127.0.0.1/" + dbName;
                this._mappings[mappedDBName] = dbName;
            }

            MongoClient.connect(dbName, function(err, db) {

                self._storedDBs[mappedDBName || dbName] = db;

                eventEmitter.emit("connected", db);

            });

        }

        return promise;

    },
    getDB: function(dbName) {
        return this._storedDBs[dbName];
    },
    close: function() {
        if ( arguments.length == 0 ) {
            this.close.apply(this, this.getStoredDBNames());
        } else {
            for ( var i in arguments ) {
                var db = this.getDB(arguments[i]);
                if ( db ) {
                    db.close();
                }
            }
        }
    },
    getConnectionCount: function(dbName) {
        var db = this.getDB(dbName);
        if ( db ) {
            return db.serverConfig.connectionPool.openConnections.length;
        }
        return 0;
    },
    /**
     * Maps the name of the database to a path to mongo
     * @param {String} dbName
     * @param {String} mongoPath
     * @example MongoReaction.map("myDatabase", "mongodb://127.0.01/myDatabase");
     */
    map: function(dbName, mongoPath) {
        this._mappings[dbName] = mongoPath;
    },
    /**
     * Returns a connection to the database
     * @param dbName
     * @returns {{collection: collection}}
     */
    db: function(dbName) {
        return {
            collection: function(collectionName) {

                return {

                    find: function(query) {
                        return MongoReaction._proxy(dbName, collectionName, function(collection, promise) {
                            collection.find(query).toArray(function (err, docs) {
                                if ( err ) {
                                    promise.events.emit("err", err);
                                } else {
                                    promise.events.emit("success", docs);
                                }
                            });
                        });
                    },
                    findOne: function(query) {
                        return MongoReaction._proxy(dbName, collectionName, function(collection, promise) {
                            collection.findOne(query).toArray(function (err, docs) {
                                if ( err ) {
                                    promise.events.emit("err", err);
                                } else {
                                    promise.events.emit("success", docs);
                                }
                            });
                        });
                    },
                    findEach: function(query) {
                        return MongoReaction._proxy(dbName, collectionName, function(collection, promise) {
                            collection.find(query).each(function (err, docs) {
                                if ( err ) {
                                    promise.events.emit("err", err);
                                } else {
                                    promise.events.emit("success", docs);
                                }
                            });
                        });
                    },
                    findCursor: function(query) {
                        return MongoReaction._proxy(dbName, collectionName, function(collection, promise) {
                            promise.events.emit("success", collection.find(query));
                        });
                    },
                    remove: function(query) {
                        return MongoReaction._proxy(dbName, collectionName, function(collection, promise) {
                            collection.remove(query, function (err, docs) {
                                if ( err ) {
                                    promise.events.emit("err", err);
                                } else {
                                    promise.events.emit("success", docs);
                                }
                            });
                        });
                    },
                    findAndRemove: function(query) {
                        return MongoReaction._proxy(dbName, collectionName, function(collection, promise) {
                            collection.findAndRemove(query, function (err, docs) {
                                if ( err ) {
                                    promise.events.emit("err", err);
                                } else {
                                    promise.events.emit("success", docs);
                                }
                            });
                        });
                    },
                    drop: function() {
                        return MongoReaction._proxy(dbName, collectionName, function(collection, promise) {
                            collection.drop(function (err, docs) {
                                if ( err ) {
                                    promise.events.emit("err", err);
                                } else {
                                    promise.events.emit("success", docs);
                                }
                            });
                        });
                    },
                    insert: function(query) {
                        return MongoReaction._proxy(dbName, collectionName, function(collection, promise) {
                            collection.insert(query, function (err, docs) {
                                if ( err ) {
                                    promise.events.emit("err", err);
                                } else {
                                    promise.events.emit("success", docs);
                                }
                            });
                        });
                    },
                    findAndModify: function(criteria) {
                        return MongoReaction._proxy(dbName, collectionName, function(collection, promise) {
                            collection.findAndModify(criteria, function (err, docs) {
                                if ( err ) {
                                    promise.events.emit("err", err);
                                } else {
                                    promise.events.emit("success", docs);
                                }
                            });
                        });
                    },
                    findAndUpdate: function (criteria, updatedElement) {
                        return MongoReaction._proxy(dbName, collectionName, function(collection, promise) {
                            collection.update(criteria, {
                                "$set": updatedElement
                            }, function (err, docs) {
                                if ( err ) {
                                    promise.events.emit("err", err);
                                } else {
                                    promise.events.emit("success", docs);
                                }
                            });
                        });
                    },
                    update: function (criteria, updatedElement, options) {
                        return MongoReaction._proxy(dbName, collectionName, function(collection, promise) {
                            collection.update(criteria, updatedElement, options, function (err, docs) {
                                if ( err ) {
                                    promise.events.emit("err", err);
                                } else {
                                    promise.events.emit("success", docs);
                                }
                            });
                        });
                    },
                    count: function(query) {
                        return MongoReaction._proxy(dbName, collectionName, function(collection, promise) {
                            collection.count(query, function (err, count) {
                                if ( err ) {
                                    promise.events.emit("err", err);
                                } else {
                                    promise.events.emit("success", count);
                                }
                            });
                        });
                    }

                };

            }
        }
    }
};

module.exports = MongoReaction;