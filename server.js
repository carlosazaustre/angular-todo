//server.js

var express 	= require('express');
var app 		= express();
var mongoose 	= require('mongoose');

// Conexión con la base de datos
mongoose.connect('mongodb://localhost:27017/angular-todo');

// Definición de modelos
var Todo = mongoose.model('Todo', {
	text: String
});

// Configuración
app.configure(function() {
	app.use(express.static(__dirname + '/public'));		// Localización de los ficheros estáticos
	app.use(express.logger('dev'));						// Muestra un log de todos los request en la consola
	app.use(express.bodyParser());						// Permite cambiar el HTML con el método POST
	app.use(express.methodOverride());					// Simula DELETE y PUT
});

// Rutas de nuestro API
app.get('/api/todos', function(req, res) {				// GET de todos los TODOs
	Todo.find(function(err, todos) {
		if(err) {
			res.send(err);
		}
		res.json(todos);
	});
});

app.post('/api/todos', function(req, res) {				// POST que crea un TODO y devuelve todos tras la creación
	Todo.create({
		text: req.body.text,
		done: false
	}, function(err, todo){
		if(err) {
			res.send(err);
		}

		Todo.find(function(err, todos) {
			if(err){
				res.send(err);
			}
			res.json(todos);
		});
	});
});

app.delete('/api/todos/:todo', function(req, res) {		// DELETE un TODO específico y devuelve todos tras borrarlo.
	Todo.remove({
		_id: req.params.todo
	}, function(err, todo) {
		if(err){
			res.send(err);
		}

		Todo.find(function(err, todos) {
			if(err){
				res.send(err);
			}
			res.json(todos);
		});

	})
});

app.get('*', function(req, res) {						// Carga una vista HTML simple donde irá nuesta Single App Page
	res.sendFile('./public/index.html');				// Angular Manejará el Frontend
});

// Escucha y corre el server
app.listen(8080, function() {
	console.log('App listening on port 8080');
});

