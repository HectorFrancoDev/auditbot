const { Payload } = require('dialogflow-fulfillment');
const { request, response } = require("express");
const ExportAudit = require('../../models/export-audit');
const { sendCardWithFileLink } = require('../bot');

const info = { rawPayload: true, sendAsMessage: true };

const planeacionAuditoriasEspecificas = (req = request, res = response, next) => {

    const action = req.action;

    if (action === 'planeacion.auditorias.especific.action')

        req.intentMap.set('Especific Planeacion Auditoria Intent', async () => {

            const auditoria = req.body.queryResult.parameters.name;
            // Buscar por coincidencia
            const regex = new RegExp(auditoria, 'i');
            const audit = await ExportAudit.findOne({ name: regex });

            if (audit) {
                let title = audit.name;
                let text = audit.description;
                text += '\n Para obtener el informe completo sobre la planeación de la auditoría comunicate con: \n ' + audit.supervisor;

                req.agent.add(new Payload(
                    req.agent.UNSPECIFIED,
                    sendCardWithFileLink(title, new Date().toISOString(), text, []),
                    info)
                );

                req.agent.add('¿Te puedo ayudar en algo más?');

            } else {
                let title = "Planeación Auditorías";
                const text = 'No se encontraron planeaciones de auditorías para: ' + auditoria + ' intentalo de nuevo';

                req.agent.add(new Payload(
                    req.agent.UNSPECIFIED,
                    sendCardWithFileLink(title, new Date().toISOString(), text, []),
                    info)
                );
            }

        });

    next();
}

module.exports = { planeacionAuditoriasEspecificas };
