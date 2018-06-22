let mongoose = require('mongoose'),
		bcrypt = require('bcryptjs');

let userSchema = mongoose.Schema({
	user: {type: String, required: true},
	password: {type: String, required: true},

	datos_principales: {
		name: {type: String, required: true},
		last_name: {type: String, required: true},
		email: {type: String, required: true},
		phone: {type: String, required: true}
	}
})

userSchema.methods.validPass = function (password) {
	return bcrypt.compareSync( password, this.password )
};

userSchema.statics.generateHash = function (password) {
	return bcrypt.hashSync( password,bcrypt.genSaltSync() );
};

userSchema.statics.neu_user = async function(datos_principales, password) {
	let user = {
		password: this.generateHash(password),
		username: datos_principales.email
	}

	user.datos_principales = datos_principales

	return new this(user).save()
}

userSchema.statics.lista = function() {
	return this
		.aggregate()
		.project({
			'nombre': '$datos_principales.name',
			'apellido': '$datos_principales.last_name',
			'email': '$datos_principales.email',
			'celular': '$datos_principales.phone'
		})
		.exec()
}

module.exports = mongoose.model('user', userSchema)
