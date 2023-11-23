const { Schema, model } = require('mongoose');

const DependenceSchema = Schema({
    code: {
        type: String,
        required: [true, 'El código es obligatorio'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    }
});

// UsuarioSchema.methods.toJSON = function() {
//     const { __v, password, ...usuario  } = this.toObject();
//     return usuario;
// }

module.exports = model( 'Dependence', DependenceSchema );
