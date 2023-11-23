const { Schema, model } = require('mongoose');

const ExportAuditSchema = Schema({
    name: {
        type: String,
        required: [true, 'Nombre obligatorio']
    },
    description: {
        type: String,
        required: [true, 'Descripción obligatorio']
    },
    supervisor: {
        type: String,
        required: [true, 'Supervisor obligatorio']
    }
});

// UsuarioSchema.methods.toJSON = function() {
//     const { __v, password, ...usuario  } = this.toObject();
//     return usuario;
// }

module.exports = model( 'ExportAudit', ExportAuditSchema );