const { Router, request, response } = require('express');
const { Payload } = require('dialogflow-fulfillment');
const {
    sendButtonFileFrecuentRequest,
    sendUserLoginMenu,
    sendCardWithFileLink,
    sendUserAuditoria
} = require('../controllers/bot');

const { check } = require('express-validator');

const { passIntentMapAndAgent } = require('../middlewares/pass-intent-and-agent');
const {
    processMaster,
    processUsers,
    validateFrecuentQuestion

} = require('../controllers');

// Models
const User = require('../models/user');
const ExportAudit = require('../models/export-audit');
const Plan = require('../models/plan');
const Audit = require('../models/audit');



const router = Router();

// ****** Atributos para la lógica ******** //
let data = {};
let userLogued = {};
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
        validateFrecuentQuestion
    ],

    (req = request, res = response) => {

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
                    userLogued = {};
                    data = {};
                } catch (error) {
                    console.error(error);
                }

            });
        }

        /**
         * Despues de que el usuario ingresa su número de cédula, se ejecuta esta función...
         */
        async function findDni() {

            let cc = parseFloat(req.body.queryResult.parameters.dni);
            console.log('CC: ', cc);

            const user = await User.findOne({ 'identification': cc });
            console.log(user);

            let res = `El usuario con identificación ${cc} NO se encuentra registrado, ingresa una identificación válida`;

            if (user) {
                //let text = `Hola ${user.name}, A través de mí podrás consultar la siguiente información:`
                userLogued = user;
                agent.add(new Payload(
                    agent.UNSPECIFIED,
                    sendUserLoginMenu(user),
                    { rawPayload: true, sendAsMessage: true }
                ));
            }
            else {
                userLogued = {};
                agent.add(res);
            }

        };

        /**
         * ****** Opción #1 ******
         * Planeación de auditorías.
         */
        function planeacionAuditorias() {
            let title = "Planeación Auditorías";

            if (userLogued.type === 'SUPERVISOR') {
                let text = "En el siguiente botón podrás encontrar el archivo de planeación de auditorías vigente a la fecha:";
                let url = "https://docs.google.com/spreadsheets/d/1ilTSArBG2wAlsTBQ9ci_N3CXibdbI98v/edit#gid=1996776958";

                agent.add(new Payload(
                    agent.UNSPECIFIED,
                    sendCardWithFileLink(title, new Date().toISOString(), text, [url]),
                    { rawPayload: true, sendAsMessage: true })
                );

                agent.add('¿Te puedo ayudar en algo más?');
            }
            else {
                const text = 'Ingresa "auditoria: " seguido del nombre de la auditoría de la cual quieres ver su planeacion. \n Ej: auditoria: AUD_0102_Cobranza interna cartera propia';

                agent.add(new Payload(
                    agent.UNSPECIFIED,
                    sendCardWithFileLink(title, new Date().toISOString(), text, []),
                    { rawPayload: true, sendAsMessage: true })
                );
            }
        }

        async function planeacionAuditoriasEspecific() {
            const auditoria = req.body.queryResult.parameters.name;
            // Buscar por coincidencia
            const regex = new RegExp(auditoria, 'i');
            const audit = await ExportAudit.findOne({ name: regex });

            if (audit) {
                let title = audit.name;
                let text = audit.description;
                text += '\n Para obtener el informe completo sobre la planeación de la auditoría comunicate con: \n ' + audit.supervisor;

                agent.add(new Payload(
                    agent.UNSPECIFIED,
                    sendCardWithFileLink(title, new Date().toISOString(), text, []),
                    { rawPayload: true, sendAsMessage: true })
                );

                agent.add('¿Te puedo ayudar en algo más?');
                // Para un cambio

            }
            else {
                let title = "Planeación Auditorías";
                const text = 'No se encontraron planeaciones de auditorías para: ' + auditoria + ' intentalo de nuevo';

                agent.add(new Payload(
                    agent.UNSPECIFIED,
                    sendCardWithFileLink(title, new Date().toISOString(), text, []),
                    { rawPayload: true, sendAsMessage: true })
                );
            }
        }

        /**
         * ****** Opción #2 ******
         * Estado de planes de acción.
         */
        async function planesAccion() {
            let urls = [];

            console.log("Planes de acción");

            if (userLogued) {
                if (userLogued.type === 'SUPERVISOR') {
                    urls.push("https://docs.google.com/spreadsheets/d/1Ocp9uqZuot_OeXUu5iDsmwDZwvx74myVFnnxMV2lYv8/edit?usp=sharing");

                    let title = "Planes de Acción";
                    let text = "En el siguiente botón podrás encontrar la carpeta con los planes de acción vigentes a la fecha:";

                    agent.add(new Payload(
                        agent.UNSPECIFIED,
                        sendCardWithFileLink(title, new Date().toISOString(), text, urls),
                        { rawPayload: true, sendAsMessage: true })
                    );

                    agent.add('¿Te puedo ayudar en algo más?');
                }
                else if (userLogued.type === 'CONTROLLER') {
                    const departmentsString = userLogued.code_dependence;
                    const departments = departmentsString.split(',');
                    if (departments) {
                        for (const department of departments) {
                            // urls = [];
                            try {
                                const plans = await Plan.find({ code_dependence: department });
                                if (plans) {
                                    // console.log(plans);
                                    for (const plan of plans) {
                                        urls.push(plan.url);
                                    }
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }

                        let title = "Planes de Acción";
                        let text = "En el siguiente botón podrás encontrar la carpeta con los planes de acción vigentes a la fecha:";

                        agent.add(new Payload(
                            agent.UNSPECIFIED,
                            sendCardWithFileLink(title, new Date().toISOString(), text, urls),
                            { rawPayload: true, sendAsMessage: true })
                        );

                        agent.add('¿Te puedo ayudar en algo más?');
                    }
                }
                else {
                    // const departmentId = '61313d3f7486eb3f9c4dde93';
                    const departmentId = userLogued.code_dependence;
                    console.log(userLogued);
                    // console.log("departamento", departmentId);
                    try {
                        // console.log("DepartmentID", departmentId);
                        // const department = await Department.findById( departmentId );
                        const plans = await Plan.find({ code_dependence: departmentId });
                        if (plans) {
                            console.log(plans);
                            for (const plan of plans) {
                                urls.push(plan.url);
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }

                    let title = "Planes de Acción";
                    let text = "En el siguiente botón podrás encontrar la carpeta con los planes de acción vigentes a la fecha:";
                    // let url = "https://docs.google.com/spreadsheets/d/1A1MvN7mcdgbUvHzetkjQbQz85xSSvHWz0aMA40FWHGA/edit#gid=310663529";

                    agent.add(new Payload(
                        agent.UNSPECIFIED,
                        sendCardWithFileLink(title, new Date().toISOString(), text, urls),
                        { rawPayload: true, sendAsMessage: true })
                    );

                    agent.add('¿Te puedo ayudar en algo más?');
                }
            }
            else {
                agent.add('No puedes acceder a la información sin iniciar sesión');
            }
        }

        /**
         * ****** Opción #3 ******
         * Informes de auditorías.
         */
        async function informesAuditoriasListar() {
            if (userLogued.type === 'CONTROLLER') {
                const departmentsString = userLogued.code_dependence;
                const departments = departmentsString.split(',');
                if (departments) {
                    let auditorias = [];
                    for (const department of departments) {
                        const audits = await Audit.find({ code_dependence: department });

                        for (let i = 0; i < audits.length; i++) {
                            auditorias.push({
                                "widgets": [
                                    {
                                        "buttons": [
                                            {
                                                "textButton": {
                                                    "text": `${i + 1}. ${audits[i].name}`,
                                                    "onClick": {
                                                        "openLink": {
                                                            "url": audits[i].url
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            });
                        }
                    }

                    agent.add(new Payload(
                        agent.UNSPECIFIED,
                        sendUserAuditoria(userLogued, auditorias),
                        { rawPayload: true, sendAsMessage: true })
                    );
                }
            }
            else {
                // mostrar el listado de los informes de auditorías disponibles para el usuario
                const userDependenceCode = userLogued.code_dependence;
                const audits = await Audit.find({ code_dependence: userDependenceCode });

                // Retornar la carta con el listado de nombres de auditorias
                // *******************************

                let auditorias = [];

                for (let i = 0; i < audits.length; i++) {

                    auditorias.push({
                        "widgets": [
                            {
                                "buttons": [
                                    {
                                        "textButton": {
                                            "text": `${i + 1}. ${audits[i].name}`,
                                            "onClick": {
                                                "openLink": {
                                                    "url": audits[i].url
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });

                }

                agent.add(new Payload(
                    agent.UNSPECIFIED,
                    sendUserAuditoria(userLogued, auditorias),
                    { rawPayload: true, sendAsMessage: true })
                );

            }
        }

        async function informesAuditorias() {
            const auditoria = req.body.queryResult.parameters.name;
            const name = '' + auditoria;

            const auditReport = await ExportAudit.find({ name });

            if (auditReport === null) {
                agent.add('No se encontró: ' + name);
            }
            else {
                agent.add(auditReport);
            }
            // else {
            //     const title = auditReport.name;
            //     const subtitle = auditReport.code_dependence;
            //     const text = 'Descarga el informe de la auditoría en el siguiente botón:';
            //     const url = auditReport.url;
            //     const buttonText = 'Descargar';
            //     agent.add(new Payload(
            //         agent.UNSPECIFIED,
            //         sendCardWithFileLink(title, subtitle, text, [url], buttonText),
            //         { rawPayload: true, sendAsMessage: true })
            //     );
            //     agent.add('¿Te puedo ayudar en algo más?');
            // }
        }

        /**
         * Establece el fin de la conversación o si quiere 
         * que se le vuelva a mostrar el menu del bot.
         * SI => Quiero mostrar el menu.
         * NO => Quiero Salir.
         */
        function finConversacion() {
            const desicion = req.body.queryResult.parameters.desicion;

            if (desicion == 'si') {
                agent.add(new Payload(
                    agent.UNSPECIFIED,
                    sendUserLoginMenu(userLogued),
                    { rawPayload: true, sendAsMessage: true })
                );
            }
            else {
                userLogued = {};
                agent.add('Hasta luego, que estés bien!');
            }
        };


        function despedidaAction() {

            userLogued = {};
            agent.add('Hasta luego, que tengas un buen día');

        }

        // Run the proper function handler based on the matched Dialogflow intent name
        let intentMap = req.intentMap;

        const action = req.body.queryResult.action;

        switch (action) {
            // Ingresar el número de identificación del usuario que quiere utilizar el bot.
            case 'enterdni.action':
                intentMap.set('Enter Dni Intent', findDni);
                break;

            // 1. Planeación de auditorías
            case 'planeacion.auditorias.action':
                intentMap.set('Planeacion Auditorias Intent', planeacionAuditorias);
                break;

            case 'planeacion.auditorias.especific.action':
                intentMap.set('Especific Planeacion Auditoria Intent', planeacionAuditoriasEspecific);
                break;

            // 2. Estado de Planes de acción
            case 'planes.accion.action':
                intentMap.set('Planes Accion Intent', planesAccion);
                break;

            // 3. Informes de auditorias
            case 'informe.auditoria.list.action': //Listar los nombres de las auditorias
                intentMap.set('Informes Auditorias Intent', informesAuditoriasListar);
                break;

            case 'informe.auditoria.action': //Mostrar la auditoria en especifico
                intentMap.set('Seleccionar Auditoria Informe Intent', informesAuditorias);
                break;

            // Volver a mostrar menu o finalizar conversación
            case 'fin.action':
                intentMap.set('Fin Conversacion Intent', finConversacion);
                break;

            // Mensaje de despedida
            case 'despedida.action':
                intentMap.set('Despedida Intent', despedidaAction);
                break;

            default:
                // intentMap.set();
                break;
        }

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
