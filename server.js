const { Nuxt, Builder } = require('nuxt')

const app = require('express')(),
			mongoose = require('mongoose'),
			path = require('path'),
			favicon = require('serve-favicon'),
			logger = require('morgan'),
			cookieParser = require('cookie-parser'),
			session = require('express-session'),
			bodyParser = require('body-parser'),
			port = process.env.PORT || 5000

//set the global path
global.__base = __dirname + '/';

let MongoStore = require('connect-mongo')(session);

// app.use(favicon(path.join(__dirname,'static','favicon.ico')));
app.use(bodyParser.json());
// app.use(cookieParser());
app.disable('x-powered-by');

mongoose.connect('mongodb://@localhost:27017/nuxt')
mongoose.Promise = global.Promise;

app.use(session({
	secret: 'supa_secret',
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	resave: false,
	saveUninitialized: false,
}));

app.use(require('./controllers'));


// We instantiate nuxt.js with the options
const isProd = process.env.NODE_ENV === 'production'
const config = require('./nuxt.config.js')
config.dev = !isProd
const nuxt = new Nuxt(config)

app.use(nuxt.render)

function listen() {
	app.listen(port, () => console.log('Server listening on port:',port) );
}

if (!isProd) {
	const builder = new Builder(nuxt)
  builder.build()
		.then(listen)
		.catch( e => {
			console.log(e)
			process.exit(1)
		})
} else {
	listen()
}

