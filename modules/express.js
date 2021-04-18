const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const compression = require("compression");

const port = 8085; //API Port

function startwebserver() {
	const _app_folder = "../client/";
	const app = express();
	app.use(compression());

	app.use(cors());
	app.use( bodyParser.json() );       // to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
	}));

	app.get('*.*', express.static(_app_folder, {maxAge: '1y'}));

	app.all('*', function (req, res) {
		res.status(200).sendFile(`/`, {root: _app_folder});
  });
  
  app.use(express.static(_app_folder));
  
/*
  app.use('/style', express.static(__dirname + _app_folder+'/style'));
  app.use('/js', express.static(__dirname + _app_folder+'/js'));
  app.use('/images', express.static(__dirname + _app_folder+'/images'));
  app.use('/ajax', express.static(__dirname + _app_folder+'/ajax'));
  
  app.get('/', function(req, res) {
  res.sendFile(path.resolve('./public/index.html'));
  });

  */





  app.post('/api/V1', (req, res) => {
    var json = {
      "key": req.body.key,
      "select": req.body.select
    }
  

      res.send();

    
  })

  app.listen(port, () => {
    
  })

}

module.exports = {
	startwebserver,
}