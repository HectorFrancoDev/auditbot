const { Schema, model } = require('mongoose');

const PlanSchema = Schema({
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

module.exports = model( 'Plan', PlanSchema );