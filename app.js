
const express = require('express');
const app = express();

const path = require('path');
const PORT = process.env.PORT || 5000 ;



app.use( express.static('public') );


app
	.get('/', (req, res)=> {
		res.sendFile( path.join(__dirname + '/public/index.html') );
	})

	.listen(PORT, ()=> {
		console.log('app listening on port ' + PORT)
	})