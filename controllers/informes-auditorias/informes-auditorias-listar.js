const { Payload } = require('dialogflow-fulfillment');
const { request, response } = require("express");
const Audit = require('../../models/audit');

const info = { rawPayload: true, sendAsMessage: true };

const informesAuditoriasListar = (req = request, res = response, next) => {

    const action = req.action;
    const userLogued = req.userLogued;
    const agent = req.agent;

    if (action === 'informe.auditoria.list.action')

        req.intentMap.set('Informes Auditorias Intent', async () => {

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
                        info)
                    );
                }
            }
            else if (userLogued.type === 'USER') {
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
                    info)
                );

            }
            else {
                agent.add('Ingresa el nombre de la auditoría');
            }

        });

    next();
};

module.exports = { informesAuditoriasListar };