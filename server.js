let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = 8000;
let book = require('./app/routes/book');
let config = require('config'); //we load the db location from the JSON files
let options = { 
	useMongoClient: true,
	socketTimeoutMS: 30000,
	keepAlive: true, 
	connectTimeoutMS : 30000 
}; 
//db options
// let options = { 
// 	useMongoClient: true,
// 	server: { 
// 		socketOptions: { 
// 			keepAlive: 1, connectTimeoutMS: 30000 
// 		} 
// 	}, 
// 	replset: { 
// 		socketOptions: { 
// 			keepAlive: 1, connectTimeoutMS : 30000 
// 		} 
// 	} 
// }; 



// // Use native ES6 promises
mongoose.Promise = global.Promise;

//db connection      
mongoose.connect(config.DBHost, options);
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error');
  process.exit(1);
});
mongoose.connection.once('open', function() {
  console.error('MongoDB Connection successful.');
});
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

app.get("/", (req, res) => res.json({message: "Welcome to our Bookstore!"}));

app.route("/book")
	.get(book.getBooks)
	.post(book.postBook);
app.route("/book/:id")
	.get(book.getBook)
	.delete(book.deleteBook)
	.put(book.updateBook);


app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing