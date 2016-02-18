import { MongoClient, ObjectID } from 'mongodb';
import _ from 'lodash';

class DB {
    constructor() {
        this.url = 'mongodb://localhost:27017/garkbit';
        this.toResponse = this.toResponse.bind(this)
    }
    
    connect(callback) {
        MongoClient.connect(this.url, function(err, db) {
            return callback(err, db);
        });
    }
    
    objectId(id) {
        return new ObjectID(id);
    }
    
    toResponse(data) {
        if (_.isArray(data)) {
            return _.map(data, d => {
                return this.mapId(d);
            });
        } else {
            return this.mapId(data);
        }
    }
    
    mapId(object) {
        return _.mapKeys(object, function(value, key) {
            if (key === '_id') {
                return 'id';
            } else {
                return key;
            }
        });
    }
}

export default new DB();