import Express from 'express';
import Async from 'async';
import DB from './lib/db';
import BodyParser from 'body-parser';
import Multer from 'multer';
import Crypto from 'crypto';
import FS from 'fs';
import Lwip from 'lwip';
import _ from 'lodash';
import { ExifImage } from 'exif';

import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import Routes from './app/routes';
import configureStore from './app/store';

import { StyleSheetServer } from 'aphrodite';

const app = Express();

const photoFolder = 'public/images/photos/';

app.use(Express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views'); 

const urlEncodedParser = BodyParser.urlencoded({ extended: false });

function getSubfolder (filename) {
    return Crypto.createHash('md5').update(filename).digest('hex').substr(0, 2);
}

const storage = Multer.diskStorage({
    destination: function (req, file, cb) {
        let subFolder = getSubfolder(file.originalname);
        let folder = photoFolder + subFolder;
        FS.mkdir(folder, function () {
            return cb(null, folder);
        });
    },
    filename: function (req, file, cb) {
        return cb(null, file.originalname);
    }
})

const upload = Multer({ storage: storage });

app.get('/api/galleries', function(req, res) {
    
    DB.connect(function (err, db) {
        if (err) return res.json({'err': err});
        db.collection('galleries').find({}).toArray(function (err, galleries) {
            if (err) return res.json({'err': err});
            return res.json({'galleries': DB.toResponse(galleries)});
        });
    });
});

app.post('/api/galleries', urlEncodedParser, function(req, res) {
    
    const name = req.body.name;
    
    DB.connect(function (err, db) {
        if (err) return res.json({'err': err});
        db.collection('galleries').insertOne({
            name: name
        }, function (err, result) {
            if (err) return res.json({'err': err});
            return res.json({'gallery': {'id': result.insertedId, 'name': name}});
        });
    });
});

app.post('/api/galleries/:id', urlEncodedParser, function(req, res) {
    
    const galleryId = req.params.id;
    const name = req.body.name;
    
    DB.connect(function (err, db) {
        if (err) return res.json({'err': err});
        db.collection('galleries').updateOne({
            '_id':  DB.objectId(galleryId)
        }, {
            '$set': {'name': name}
        }, function (err, result) {
            if (err) return res.json({'err': err});
            return res.json({'gallery': {'id': galleryId, 'name': name}});
        });
    });
});

app.delete('/api/galleries/:id', function(req, res) {
    
    // TODO: Remove gallery id from all photos
    
    const galleryId = req.params.id;
    
    DB.connect(function (err, db) {
        if (err) return res.json({'err': err});
        db.collection('galleries').removeOne({
            '_id': DB.objectId(galleryId)
        }, function (err, result) {
            if (err) return res.json({'err': err});
            return res.json({'success': true});
        });
    });
});

app.get('/api/galleries/:id', function(req, res) {
    
    const galleryId = req.params.id;
    
    DB.connect(function (err, db) {
        if (err) return res.json({'err': err});
        db.collection('galleries').findOne({
            _id: DB.objectId(galleryId)
        }, function (err, gallery) {
            if (err) return res.json({'err': err});
            return res.json({'gallery': DB.toResponse(gallery)});
        });
    });
});

app.get('/api/galleries/:id/photos', function(req, res) {
    
    const galleryId = req.params.id;
    
    DB.connect(function (err, db) {
        if (err) return res.json({'err': err});
        db.collection('photos').find({'galleries.id': DB.objectId(galleryId)}).toArray(function (err, photos) {
            if (err) return res.json({'err': err});
            return res.json({'photos': DB.toResponse(photos)});
        });
    });    
});

app.put('/api/galleries/:galleryId/photo/:photoId', function(req, res) {

    const galleryId = req.params.galleryId;
    const photoId = req.params.photoId;
    
    DB.connect(function (err, db) {
        db.collection('photos').updateOne({'_id': DB.objectId(photoId)}, {$push: {'galleries': {'id': DB.objectId(galleryId)}}}, function (err, result) {
            if (err) return res.json({'err': err});
            return res.json({'success': true});
        });
    });
});

app.get('/api/photos', function(req, res) {
});

app.post('/api/photos', upload.single('photo'), function(req, res) {
    
    const galleryId = req.body.galleryId;
    
    const filename = req.file.filename;
    const filenameParts = _.split(filename, '.');
    const rawFilename = filenameParts[0];
    const fileExt = filenameParts[1];
    const subfolder = getSubfolder(filename);
    
    new ExifImage({'image': req.file.path}, function (err, exifData) {
        if (err) console.log(err);
       
        Lwip.open(req.file.path, function (err, image) {
            
            const newWidth = 150;
            const ratio = image.width() / newWidth;
            const newHeight = image.height() / ratio;
            
            const thumbFilename = rawFilename + '_thumb.' + fileExt;
            const thumbPath = req.file.destination + '/' + thumbFilename;
            
            image.batch()
            .resize(newWidth, newHeight)
            .writeFile(thumbPath, function(err){
                if (err) return res.json({'err': err});
                
                 let photo = {
                    'fn': filename,
                    'path': subfolder,
                    'sizes': {
                        'original': {
                            'uri': subfolder + '/' + filename,
                        },
                        'thumb': {
                            'uri': subfolder + '/' + thumbFilename,
                        },
                    },
                    'galleries': [{'id': DB.objectId(galleryId)}],
                    'exif': exifData,
                };
                
                DB.connect(function (err, db) {
                    if (err) return res.json({'err': err});
                    db.collection('photos').insertOne(photo, function (err, results) {
                        if (err) return res.json({'err': err});
                        return res.json({'photo': DB.toResponse(photo)});
                    });
                });              
            });
        });      
        
    });
});

app.put('/api/photos/:id', urlEncodedParser, function(req, res) {

    const photoId = req.params.id;
});

app.delete('/api/photos/:id', function(req, res) {
    
    const photoId = req.params.id;
    
    DB.connect(function (err, db) {
        if (err) return res.json({'err': err});
        db.collection('photos').findOneAndDelete({'_id': DB.objectId(photoId)}, function (err, photo) {
            if (err) return res.json({'err': err});
            _.each(photo.sizes, function (s) {
                FS.unlink(photoFolder + s.uri);
            });
            return res.json({'photo': DB.toResponse(photo)});
        });
    });   
});

function fetchInitialState (renderProps, callback) {
    
    let data = {};
    
    Async.parallel([
        function (cb) {
            DB.connect(function (err, db) {
                if (err) return cb(err);
                db.collection('galleries').find({}).toArray(function (err, galleries) {
                    if (err) return cb(err);
                    data.galleries = DB.toResponse(galleries);
                    return cb();
                });
            });
        },
        function (cb) {
            if (_.isUndefined(renderProps.params.galleryId)) {
                return cb();
            }
            data.photos = {};
            DB.connect(function (err, db) {
                if (err) return cb(err);
                db.collection('photos').find({'galleries.id': DB.objectId(renderProps.params.galleryId)}).toArray(function (err, photos) {
                    if (err) return cb(err);
                    data.photos.photos = DB.toResponse(photos);
                    data.photos.gallery = { id: renderProps.params.galleryId, name: '' };
                    return cb();
                });
            });
        },        
    ], function (err, results) {
        if (err) return callback(err);
        return callback(null, data);
    });
    
    return;
}

app.use((req, res) => {
    match({routes: Routes, location: req.url}, (err, redirectLocation, renderProps) => {
        if (err) {
            console.error(err);
            return res.status(500).end('Internal server error');
        }
        
        if (!renderProps) return res.status(404).end('Not found.');
        
        fetchInitialState(renderProps, function (err, state) {
            if (err) return res.status(500).end('Internal server error');
            
            const store = configureStore(state);

            //const content = renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>);
            const {content, css} = StyleSheetServer.renderStatic(() => {
                return renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>);
            });
            
            const initialState = store.getState();
            
            res.render('index', { content: content, css: css, initialState: initialState });           
        });     

    });
});

export default app;