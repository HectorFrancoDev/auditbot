// Fin conversación
const finConversacion = require('./fin-conversacion/fin-conversacion');
const despedidaAction = require('./fin-conversacion/despedida');
// Informes Auditorias
const informesAuditorias = require('./informes-auditorias/informes-auditorias');
const informesAuditoriasListar = require('./informes-auditorias/informes-auditorias-listar');
// Planes de acción
const planesAccion = require('./planes-accion/planes-accion');
// Planeación Auditorias
const planeacionAuditorias = require('./planeacion-auditorias/planeacion-auditorias');
const planeacionAuditoriasEspecificas = require('./planeacion-auditorias/planeacion-auditorias-especifica');
// Frequent Question
const frequentQuestions = require('./frecuent-questions');
// Buscar DNI
const findDNI = require('./find-dni');
// Master
const master = require('./master');

module.exports = {
    // Fin conversación
    ...finConversacion,
    ...despedidaAction,
    // Informes Auditorias
    ...informesAuditorias,
    ...informesAuditoriasListar,
    // Planes de acción,
    ...planesAccion,
    // Planeación auditorias
    ...planeacionAuditorias,
    ...planeacionAuditoriasEspecificas,
    // Preguntas frecuentes
    ...frequentQuestions,
    // Buscar cédula
    ...findDNI,
    // Master
    ...master
}