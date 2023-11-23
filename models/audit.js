const { Schema, model } = require('mongoose');

const AuditSchema = Schema({
    name: {
        type: String,
        required: [true, 'Nombre obligatorio']
    },
    code_dependence: {
        type: String,
        required: [true, 'Código dependencia obligatorio']
    },
    url: {
        type: String,
        required: [true, 'Url obligatorio']
    }
});

// UsuarioSchema.methods.toJSON = function() {
//     const { __v, password, ...usuario  } = this.toObject();
//     return usuario;
// }

module.exports = model( 'Audit', AuditSchema );