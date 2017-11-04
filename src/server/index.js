import compression from 'compression';
import express from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';

import { APP_NAME, STATIC_PATH, WEB_PORT, MONGO_URI } from '../shared/config';
import { isProd } from '../shared/util';
import renderApp from './render-app';

import api from './api';

const app = express();

app.use(compression());
app.use(STATIC_PATH, express.static('dist'));
app.use(STATIC_PATH, express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/*', (req, res) => {
  res.send(renderApp(APP_NAME));
});

app.listen(WEB_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${WEB_PORT} ${isProd ? '(production)' :
  '(development).\nKeep "yarn dev:wds" running in an other terminal'}.`);
  MongoClient.connect(isProd ? MONGO_URI : 'mongodb://localhost:27017/test', function(err, db) {
  	console.log("DB Connected");
  	api(app, db);
	});
});
