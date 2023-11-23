const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    identification: {
        type: String,
        required: [true, 'La cédula es obligatoria'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },    
    job: {
        type: String,
        required: [true, 'El cargo es obligatorio'],
    },
    ubication: {
        type: String,
        required: [true, 'La ubicación es obligatoria'],
    },
    type: {
        type: String,
        required: [true, 'La ubicación es obligatoria'],
    },    
    branch_office: {
        type: String,
        required: [true, 'La ubicación es obligatoria'],
    },
    code_dependence: {
        type: String,
        required: [true, 'El código de dependencia es obligatorio'],
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
    }
});



// UsuarioSchema.methods.toJSON = function() {
//     const { __v, password, ...usuario  } = this.toObject();
//     return usuario;
// }

module.exports = model( 'User', UserSchema );
