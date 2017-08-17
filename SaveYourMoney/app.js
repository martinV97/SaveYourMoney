
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var pg  = require('pg');
//var conString   = process.env.DATABASE_URL;
var conString = 'postgres://martin:123@localhost:5432/SaveYourMoney';
var client = new pg.Client(conString);
client.connect();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/expenses', function(req, res, next) {
	var results = {};
	results.Expenses = [];
	var data = [];
		var query = client.query('SELECT * FROM public.expenses');
	    query.on('row', function (row){
	      results.Expenses.push(row);
	    });
	    query.on('end', function (){
	      return res.json(results);
	    });
});

app.get('/profile', function(req, res, next) {
	var results = {};
	results.Profiles = [];
	var data = [];
		var query = client.query('SELECT * FROM PROFILE');
	    query.on('row', function (row){
	      results.Profiles.push(row);
	    });
	    query.on('end', function (){
	      return res.json(results);
	    });
});

app.get('/expensesProfile', function(req, res, next) {
	var results = {};
	results.ExpensesProfile = [];
	var data = [];
		var query = client.query('SELECT * FROM EXPENSES_PROFILE');
	    query.on('row', function (row){
	      results.ExpensesProfile.push(row);
	    });
	    query.on('end', function (){
	      return res.json(results);
	    });
});
