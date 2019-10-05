
const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');

const PORT = process.env.PORT || 5000 ;

const app = express();

const { Pool } = require('pg');
const POOL = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use( express.static('public') );




app
	.get('/', (req, res)=> {
		res.sendFile( path.join(__dirname + '/public/index.html') );
	})


	.post('/logic_scene', async (req, res)=> {

		try {

			// temp
			console.log(req.body);

			let client = await POOL.connect();

			client.query(`INSERT INTO scenes
								( color, date, scene ) VALUES (
								'${ req.body.color }',
								'${ Date.now() }',
								${ req.body.sceneGraph }
							)`);

			res.send('ok');
			client.release();

		} catch (err) {
			console.error(err);
		};

	})


	.listen(PORT, ()=> {
		console.log('app listening on port ' + PORT)
	})