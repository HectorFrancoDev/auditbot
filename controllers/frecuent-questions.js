const { sendButtonFileFrecuentRequest } = require("./bot");
const { Payload } = require('dialogflow-fulfillment');

const LINK_PDF = [
    // 0: QUE ES UNA AUDITORIA INTERNA
    'https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/frecuent_requests%2F%C2%BFQue%CC%81%20es%20Auditori%CC%81a%20Interna_.pdf?alt=media&token=99cb0ce1-abab-4792-b071-4932e84c6768',

    // 1: CONDICIONES PARA UNA PRORROGA
    'https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/frecuent_requests%2FCondiciones%20para%20una%20Pro%CC%81rroga.pdf?alt=media&token=53e21953-0410-49f9-9b83-f24000bdc66d',

    // 2: CONDICIONES PARA UN PLAN DE ACCIÓN EFECTIVO
    'https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/frecuent_requests%2FDesarrollo%20de%20planes%20de%20accio%CC%81n.pdf?alt=media&token=73675322-256f-4997-be02-c76fb0a5d972',

    // 3: ¿QUÉ NECESITO PARA PREPARAR LA VISITA DEL AUDITOR?
    'https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/frecuent_requests%2F%C2%BFQue%CC%81%20necesito%20para%20preparar%20la%20visita%20del%20auditor_.pdf?alt=media&token=ebbaae2d-3bb4-4bfb-9331-9df0ccf67b9b',

    // 4: RESPONSABILIDAD DE UN PLAN DE ACCIÓN
    'https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/frecuent_requests%2FResponsabilidad%20de%20la%20gestio%CC%81n%20del%20plan%20de%20accio%CC%81n.pdf?alt=media&token=b9302cad-6c71-4521-84eb-8a9dda97eb75',

    // 5: PLAZOS DE ENTREGA DE INFORMACIÓN
    'https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/frecuent_requests%2FPlazos%20para%20entrega%20de%20informacio%CC%81n%20y%20limitacio%CC%81n%20al%20alcance.pdf?alt=media&token=cc1a10c7-42a1-4fa7-b8d9-2514b9cb9dbf',

    // 6: ACUERDOS DE SERVICIO
    'https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/frecuent_requests%2FAcuerdos%20de%20servicios%20en%20la%20ejecucio%CC%81n%20de%20la%20Auditori%CC%81a.pdf?alt=media&token=f42e038a-3963-496a-ae30-d8022f4671ec',

    // 7: ¿CÓMO USAR OPEN PAGES?
    'https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/frecuent_requests%2F%C2%BFCo%CC%81mo%20usar%20OpenPages_.pdf?alt=media&token=8f60dab5-4746-4fe1-8032-4e7ac9e8396d',

    // 8: ¿COMO CALIFICO AL AUDITOR?
    'https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/frecuent_requests%2F%C2%BFCo%CC%81mo%20califico%20al%20auditor%20que%20me%20realizo%CC%81%20la%20Auditori%CC%81a_.pdf?alt=media&token=428b3dfa-e733-4225-b57d-7da2e388d10b'
];

const actionsFrecuentQuestions = {
    // 0: QUE ES UNA AUDITORIA INTERNA
    'frequent.question.auditoria.action': {
        intentName: 'Frecuente - ¿Qué es una Auditoría Interna? Intent',
        cardTitle: 'Qué es una Auditoría?',
        linkPDF: LINK_PDF[0]
    },
    // 1: CONDICIONES PARA UNA PRORROGA
    'frequent.question.prorroga.action': {
        intentName: 'Frecuente - Condiciones para una Prórroga Intent',
        cardTitle: 'Prórrogas',
        linkPDF: LINK_PDF[1]
    },
    // 2: CONDICIONES PARA UN PLAN DE ACCIÓN EFECTIVO
    'frequent.question.condiciones.plan.accion.efectivo.action': {
        intentName: 'Frecuente - Desarrollo de planes de accion',
        cardTitle: 'Planes de Acción',
        linkPDF: LINK_PDF[2]
    },
    // 3: ¿QUÉ NECESITO PARA PREPARAR LA VISITA DEL AUDITOR?
    'frequent.question.visitia.auditor.action': {
        intentName: 'Frecuente - ¿Que necesito para preparar la visita visita del auditor?',
        cardTitle: 'Visita del Auditor',
        linkPDF: LINK_PDF[3]
    },
    // 4: RESPONSABILIDAD DE UN PLAN DE ACCIÓN
    'frequent.question.gestion.plan.accion.action': {
        intentName: 'Frecuente - Responsabilidad de la gestión del plan de accion',
        cardTitle: 'Gestión del Plan de Acción',
        linkPDF: LINK_PDF[4]
    },
    // 5: PLAZOS DE ENTREGA DE INFORMACIÓN
    'frequent.question.plazos.entrega.informacion.action': {
        intentName: 'Frecuente - Plazos para entrega de informacion y limitación al alcance',
        cardTitle: 'Plazos de entrega de información y limitación al alcance',
        linkPDF: LINK_PDF[5]
    },
    // 5: PLAZOS DE ENTREGA DE INFORMACIÓN
    'frequent.question.acuerdos.servicio.action': {
        intentName: 'Frecuente - Acuerdos de servicio',
        cardTitle: 'Acuerdos de servicios en la ejecución de la Auditoría',
        linkPDF: LINK_PDF[6]
    },
    // 7: ¿CÓMO USAR OPEN PAGES?
    'frequent.question.como.usar.openpages.action': {
        intentName: 'Frecuente - ¿Como usar OpenPages?',
        cardTitle: '¿Cómo usar OpenPages?',
        linkPDF: LINK_PDF[7]
    },
    // 8: ¿COMO CALIFICO AL AUDITOR?
    'frequent.question.como.calificar.auditor.action': {
        intentName: 'Frecuente - ¿Como califico al auditor?',
        cardTitle: '¿Cómo califico al auditor que me realizó la auditoría?',
        linkPDF: LINK_PDF[8]
    }
};

const nowDate = new Date().toISOString();
const info = { rawPayload: true, sendAsMessage: true };

const validateFrecuentQuestion = (req, res, next) => {
    const action = req.action;
    const frecuentsDb = actionsFrecuentQuestions;
    const keysActions = Object.keys(frecuentsDb);

    for (const key of keysActions) {
        if (action === key) {
            req.intentMap.set(
                frecuentsDb[action].intentName,
                () => {
                    req.agent.add(
                        new Payload(
                            req.agent.UNSPECIFIED,
                            sendButtonFileFrecuentRequest(
                                frecuentsDb[action].cardTitle,
                                nowDate,
                                frecuentsDb[action].linkPDF
                            ),
                            info
                        ),
                    );
                }
            );
        }
    }

    next();
};

module.exports = {
    validateFrecuentQuestion
};