const { Payload } = require('dialogflow-fulfillment');
const { request, response } = require("express");
const Audit = require('../../models/audit');

const info = { rawPayload: true, sendAsMessage: true };

const informesAuditorias = (req = request, res = response, next) => {

    const action = req.action;
    const userLogued = req.userLogued;
    const agent = req.agent;

    if (action === 'informe.auditoria.action')

        req.intentMap.set('Seleccionar Auditoria Informe Intent', async () => {

            const auditoria = req.body.queryResult.parameters.name;
            const name = 'AUD_' + auditoria;

            if (userLogued.type === 'SUPERVISOR') {
                const auditReport = await Audit.findOne({ name });
                if (auditReport === null) {
                    agent.add('No se encontró: ' + name);
                }
                else {
                    // Retornar la carta con el listado de nombres de auditorias
                    // *******************************

                    let auditorias = [];

                    auditorias.push({
                        "widgets": [
                            {
                                "buttons": [
                                    {
                                        "textButton": {
                                            "text": `* ${auditReport.name}`,
                                            "onClick": {
                                                "openLink": {
                                                    "url": auditReport.url
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    });

                    agent.add(new Payload(
                        agent.UNSPECIFIED,
                        sendUserAuditoria(userLogued, auditorias),
                        info)
                    );
                }
            }
            else {
                const auditReport = await ExportAudit.find({ name });

                if (auditReport === null) {
                    agent.add('No se encontró: ' + name);
                }
                else {
                    agent.add(auditReport);
                }
            }
        });

    next();
};

module.exports = { informesAuditorias };
