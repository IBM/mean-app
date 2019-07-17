/*
  Licensed to the Apache Software Foundation (ASF) under one
  or more contributor license agreements.  See the NOTICE file
  distributed with this work for additional information
  regarding copyright ownership.  The ASF licenses this file
  to you under the Apache License, Version 2.0 (the
  "License"); you may not use this file except in compliance
  with the License.  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing,
  software distributed under the License is distributed on an
  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, either express or implied.  See the License for the
  specific language governing permissions and limitations
  under the License.
 */

'use strict';

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//Sample Model
const Comment = require('../model/comments');

// user set constiables
const mongoURL = process.env.MONGO_URL || 'localhost';
const mongoUser = process.env.MONGO_USER || '';
const mongoPass = process.env.MONGO_PASS || '';
const mongoDBName = process.env.MONGO_DB_NAME || 'comments';

module.exports = function(app){

	// set up other middleware
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	const options = {
		useMongoClient: true,
		ssl: false,
		sslValidate: false,
		poolSize: 1,
		reconnectTries: 1
	};

	// connect to the MongoDB
	let mongoConnect = 'mongodb://localhost:27017';
	if (mongoURL !== '' && mongoUser !== '' && mongoPass != '') {
  		mongoConnect = `mongodb://${mongoUser}:${mongoPass}@${mongoURL}/${mongoDBName}`;
	} else if (mongoURL !== '') {
  		mongoConnect = `mongodb://${mongoURL}/${mongoDBName}`;
	}

	mongoose.Promise = global.Promise;
	mongoose.connect(mongoConnect, options)
  		.catch((err) => {
    		if (err) console.error(err);
  	});

	var db = mongoose.connection;
	db.on('error', (error) => {
        console.error(error);
	});

	var sess = {
	  store: new MongoStore({ mongooseConnection: mongoose.connection }),
	  name: 'mean example',
	  secret: 'ninpocho',
	  resave: false,
	  saveUninitialized: true,
	  cookie: {}
	};

	app.use(session(sess));

	console.info('Connection established with mongodb');
	console.info(`Connection details: ${mongoConnect}`);
};

