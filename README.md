mongo-reaction
==============

Lightweight MongoDB promise driven library.
Most of Mongodb methods are mapped in the library:

  * find
  * findOne
  * update
  * findAndModify
  * findAndRemove
  * remove
  * drop

## Some examples?

### Getting an instance of Mongo Reaction

```javascript
var MongoReaction = require("mongo-reaction");
```

### Mappings

To handle many connections in an easier way, you can map data base names to paths:

```javascript
MongoReaction.map("employees", "mongodb://127.0.0.1/employees");
```

### Getting all documents in a collection
```javascript
MongoReaction.db("employees").collection("employee").find().success(function(docs) {

    console.log("Here are the documents");
    console.log(docs);

}).error(function(err) {
    conosle.error("There was an error!");
    conosle.error(err);
});
```

### Getting all documents in a collection that matches a query
```javascript
MongoReaction.db("employees").collection("employee").find({
    "name": "Josh"
}).success(function(docs) {

    console.log("Here are the documents");
    console.log(docs);

}).error(function(err) {
    conosle.error("There was an error!");
    conosle.error(err);
});
```

### Getting one document in a collection that matches a query
```javascript
MongoReaction.db("employees").collection("employee").findOne({
    "name": "Josh"
}).success(function(doc) {

    console.log("Here's Josh");
    console.log(doc);

}).error(function(err) {
    conosle.error("There was an error!");
    conosle.error(err);
});
```

### Getting a cursor to a collection by a query
```javascript
MongoReaction.db("employees").collection("employee").findCursor({}).success(function(collection) {

    cursor.nextObject(function (err, obj) {
        console.log("Here's the object");
        console.log(obj);
    });

}).error(function(err) {
    conosle.error("There was an error!");
    conosle.error(err);
});

```

### Getting each document from collection by a query
```javascript
MongoReaction.db("employees").collection("employee").findEach({}).success(function(docs) {

    docs.each(function (err, obj) {
        console.log("Here's the object");
        console.log(obj);
    });

}).error(function(err) {
    conosle.error("There was an error!");
    conosle.error(err);
});
```

### By pagination

Parameters
 * query
 * page number
 * number of documents

```javascript
MongoReaction.db("employees").collection("employee").findPage({}, 2, 5).success(function(docs) {

    console.log("Here's the list of elements of the page");
    console.log(doc);

}).error(function(err) {
    conosle.error("There was an error!");
    conosle.error(err);
});
```

### Updating a document's fields
```javascript
MongoReaction.db("employees").collection("employee").findAndUpdate({
    "name": "Josh"
}, {
    "job": "JS Developer"
}).success(function(docs) {

    docs.each(function (err, obj) {
        console.log("Here's the object");
        console.log(obj);
    });

}).error(function(err) {
    conosle.error("There was an error!");
    conosle.error(err);
});
```