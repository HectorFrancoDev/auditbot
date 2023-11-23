const { Router, request, response } = require('express');

const { check } = require('express-validator');

const { passIntentMapAndAgent } = require('../middlewares/pass-intent-and-agent');
const {
    processMaster,
    processUsers,
    validateEnterDni,
    validateFrecuentQuestion,
    informesAuditorias,
    informesAuditoriasListar,
    planesAccion,
    planeacionAuditorias,
    planeacionAuditoriasEspecificas,
    finConversacion,
    despedidaAction

} = require('../controllers');


const router = Router();

// ****** Atributos para la lógica ******** //
let data = {};
// let userLogued = {};
const timeSession = 5 * 60000;
// const timeSession = 10000;
let session = undefined;


// Endpoint de los intentes de DialogFlow
router.post('/',

    // Middlewares
    [
        // Añadiendo al request los objetos de dialogflow para que esten disponibles por referencia.
        passIntentMapAndAgent,
        // 1. Validar si es una pregunta frecuente lo que se está solicitando
        validateFrecuentQuestion,
        // 2. Validar si se acciona el intent para buscar un usuario por cédula.
        validateEnterDni,

        planesAccion,
        planeacionAuditorias,
        planeacionAuditoriasEspecificas,
        informesAuditorias,
        informesAuditoriasListar,
        finConversacion,
        despedidaAction,

    ],

    (req, res) => {

        // const agent = new WebhookClient({ request: req, response: res });
        const agent = req.agent;

        // ********** Desconección del cliente ************************* //
        if (!session) {
            session = new Promise(function (myResolve, myReject) {
                setTimeout(() => {
                    myResolve("Gracias por consultar al AuditBot, hasta luego :)");
                }, timeSession);
            });

            session.then(function (value) {
                try {
                    req.userLogued = {};
                    data = {};
                } catch (error) {
                    console.error(error);
                }

            });
        }

        // planesAccion(req);

        // Run the proper function handler based on the matched Dialogflow intent name
        let intentMap = req.intentMap;

        agent.handleRequest(intentMap);
    });

// Endpoint para recibir la información de la hoja master desde appscrip
router.post('/master', [
    check('data', 'La información es obligatoria').not().isEmpty(),
], processMaster);

// Endpoint de los usuarios
router.get('/users', [
    // check('data', 'La información es obligatoria').not().isEmpty(),
], processUsers);

module.exports = router;