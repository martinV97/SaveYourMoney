var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var pg  = require('pg');
var conString   = process.env.DATABASE_URL;
//var conString = 'postgres://martin:123@localhost:5432/SaveYourMoney';
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

//-----------------------------------------------------------------------------------------

app.get('/profiles', function(req, res, next) {
	var results = {};
		var query = client.query('SELECT * FROM PROFILES', 
				function(err, result) {
	        if(err) {return console.error(err);}
	         results.Profiles = result.rows;
	         return res.json(results);
	    });
});


app.get('/createProfile', function(req, res, next) {
	var name = req.param('name');
	var career = req.param('career');
	var queryInsert = client.query(
				'INSERT INTO public.profiles (name, career) VALUES (' +
				 name + ',' + career + ')');
	var results = {};
	var query = client.query('SELECT last_value FROM id_profile_sequence', 
			function(err, result) {
        if(err) {return console.error(err);}
         results.IdProfile = result.rows;
         return res.json(results);
    });
});

app.get('/searchProfile', function(req, res, next) {
	var id = req.param('id');
	var results = {};
		var query = client.query('SELECT * FROM PROFILES WHERE ID = ' + id, 
				function(err, result) {
	        if(err) {return console.error(err);}
	         results.Profile = result.rows;
	         return res.json(results);
	    });
});

app.get('/cleanProfiles', function(req, res, next) {
	var results = {};
	var success = 'sucess';
		var query = client.query('DELETE FROM public.profiles WHERE ID > 0', 
				function(err, result) {
	        if(err) {return console.error(err);}
	         results.Expenses = success;
	         return res.json(results);
	    });
});

//-----------------------------------------------------------------------------------------

app.get('/budgets', function(req, res, next) {
	var results = {};
		var query = client.query('SELECT * FROM BUDGETS', 
				function(err, result) {
	        if(err) {return console.error(err);}
	         results.Budgets = result.rows;
	         return res.json(results);
	    });
});

app.get('/createBudget', function(req, res, next) {
	var cash = req.param('cash');
	var days = req.param('days');
	var savings = req.param('savings');
	var activated = req.param('activated'); 
	var id_profile = req.param('id_profile');
	var queryInsert = client.query('INSERT INTO public.budgets (cash, days, savings, activated, id_profile) VALUES (' + 
				 cash + ',' + days + ',' + savings + ','+ activated + ',' + id_profile +')');
	var results = {};
	var query = client.query('SELECT last_value FROM id_budget_sequence', 
			function(err, result) {
        if(err) {return console.error(err);}
         results.IdBudget = result.rows;
         return res.json(results);
    });
	
});

app.get('/updateSavingsBudget', function(req, res, next) {
	var id = req.param('id');
	var savings = req.param('savings'); 
	var results = {};
	var query = client.query('UPDATE public.budgets  SET savings = ' +
			savings + 'WHERE ID = ' + id,  
				function(err, result) {
	        if(err) {return console.error(err);}
	         results.Budget = result.rows;
	         return res.json(results);
	    });
});


app.get('/updateStateBudget', function(req, res, next) {
	var id = req.param('id');
	var results = {};
	var query = client.query('UPDATE public.budgets  SET activated = false ' +
				'WHERE ID = ' + id, 
				function(err, result) {
	        if(err) {return console.error(err);}
	         results.Budget = result.rows;
	         return res.json(results);
	    });
});

app.get('/searchBudget', function(req, res, next) {
	var id = req.param('id');
	var results = {};
	var query = client.query('SELECT * FROM BUDGETS WHERE ID = ' + id, 
			function(err, result) {
		if(err) {return console.error(err);}
		results.Budget = result.rows;
		return res.json(results);
	});
});

app.get('/searchBudgetsOfProfile', function(req, res, next) {
	var id_profile = req.param('id_profile');
	var results = {};
		var query = client.query('SELECT * FROM BUDGETS WHERE ID_PROFILE = ' + id_profile + 'AND ACTIVATED = TRUE', 
				function(err, result) {
	        if(err) {return console.error(err);}
	         results.Budgets = result.rows;
	         return res.json(results);
	    });
});

app.get('/cleanBudgets', function(req, res, next) {
	var results = {};
	var success = 'sucess';
		var query = client.query('DELETE FROM BUDGETS WHERE ID > 0', 
				function(err, result) {
	        if(err) {return console.error(err);}
	         results.Budgets = success;
	         return res.json(results);
	    });
});

//-----------------------------------------------------------------------------------------

app.get('/expenses', function(req, res, next) {
	var results = {};
		var query = client.query('SELECT * FROM EXPENSES', 
				function(err, result) {
	        if(err) {return console.error(err);}
	         results.Expenses = result.rows;
	         return res.json(results);
	    });
});

app.get('/createExpense', function(req, res, next) {
	var name = req.param('name');
	var type = req.param('type');
	var price = req.param('price');
	var id_budget = req.param('id_budget');
	var queryInsert = client.query('INSERT INTO public.expenses(name, type, price, id_budget) VALUES (' + 
				name + ',' + type + ',' + price + ',' + id_budget +')');
	var results = {};
	var query = client.query('SELECT last_value FROM id_expense_sequence', 
			function(err, result) {
        if(err) {return console.error(err);}
         results.IdExpense = result.rows;
         return res.json(results);
    });
	
});

app.get('/searchExpenses', function(req, res, next) {
	var id = req.param('id_budget');
	var results = {};
		var query = client.query('SELECT * FROM EXPENSES WHERE ID_BUDGET = ' + id, 
				function(err, result) {
	        if(err) {return console.error(err);}
	         results.Expense = result.rows;
	         return res.json(results);
	    });
});

app.get('/cleanExpenses', function(req, res, next) {
	var results = {};
	var success = 'sucess';
		var query = client.query('DELETE FROM EXPENSES WHERE ID > 0', 
				function(err, result) {
	        if(err) {return console.error(err);}
	         results.Expenses = success;
	         return res.json(results);
	    });
});
