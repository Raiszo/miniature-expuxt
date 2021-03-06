const router = require('express').Router(),
			User = require(__base + 'models/users')

router.post('/auth/login', (req,res) => {
	console.log('server',req.body)

	if (req.body.username === 'demo' && req.body.password === 'demo') {
		// where deserializing get a lot of stuff, but send to
		// client little information

		req.session.isAuth = true
		req.session.public_user = { username: 'demo' , email: 'a@as.com' }
		
		res.json({ username: 'demo', email: 'a@as.com' })
		
  } else {
		// to send a 401 and let axios resolve that, add special option
		// maybe in the plugins and then export axios from there
		// res.status(401).json({ status: 'ne', msg: 'Bad credentials' })
		res.json({ status: 'ne', msg: 'Bad credentials' })
	}
})

router.get('/auth/logout', (req,res) => {
  req.session.isAuth = false
	delete req.session.public_user
	
  res.send({ status: 'ok' })
})

function isLogged(req,res,next) {
	if (req.session.isAuth)
		next()
	else
		res.json({ status: 'ne', msg: 'Bad credentials' })
}

router.get('/api/toy', isLogged, (req,res) => {
	// console.log(req.headers)

	console.log('requesting dummy api')
	res.send([
		{
			name: 'cs231n',
			desc: 'Full intro to convNets'
		},
		{
			name: 'cs294',
			desc: 'not ez course on deep reinforcement learning'
		},
		{
			name: 'cs334',
			desc: 'intro to CUDA, coz those suckers at tesla want this shit'
		}
	])
})

router.get('/api/lista_usuarios', (req,res) => {
	User.lista()
		.then( result => res.send({data: result}) )
		.catch( e => {
			console.log(e)
			res.status(401).send({})
		})
})

function validateBody(body, fields) {
	return !fields.some( a => !body[a] );
}

function validator(req,res,next) {
	let emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			passReg = /\s/g;
	let fields = [
		'nombre',
		'apellidos',
		'email',
		'celular',
		'password',
		'password2'
	]
	if ( validateBody(req.body, fields) ) return res.status(401).send('ne')
	
	let emailTest = emailReg.test(req.body.email),
			pass1Test = !passReg.test(req.body.password),
			pass2Test = !passReg.test(req.body.password2),
			lengthPass = req.body.password.length >= 8,
			equalPass = req.body.password == req.body.password2

	function error_handler(msg) {
		return res.status(401).send({status: 'ne', msg})
	}
	
	if (!emailTest) return error_handler('invalid email')
	if (!pass1Test || !pass2Test) return error_handler('no spaces')
	if (!lengthPass) return error_handler('too short')
	if (!equalPass) return error_handler('different')

	return next()
}

router.post('/api/neu', validator, (req,res) => {
	let datos_principales = {
		name: req.body.nombre,
		last_name: req.body.apellidos,
		email: req.body.email,
		phone: req.body.celular
	}

	User.neu_user(datos_principales, req.body.password)
		.then( res => {
			res.send({status: 'ok', message: `User ${datos_principales.email} created .l.`})
		})
		.catch( e => {
			console.log(e)
			res.status(401).send('ne')
		})
})

module.exports = router
