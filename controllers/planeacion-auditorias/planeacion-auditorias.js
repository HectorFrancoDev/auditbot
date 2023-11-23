const { Payload } = require('dialogflow-fulfillment');
// const { request, response } = require("express");
const { sendCardWithFileLink } = require('../bot');

const info = { rawPayload: true, sendAsMessage: true };

const planeacionAuditorias = (req, res, next) => {

    const action = req.action;
    const agent = req.agent;

    console.log('USUARIO: ', req.userLogued);

    if (action === 'planeacion.auditorias.action')

        req.intentMap.set('Planeacion Auditorias Intent', () => {

            let title = "Planeación Auditorías";

            if (req.userLogued.type === 'SUPERVISOR') {
                let text = "En el siguiente botón podrás encontrar el archivo de planeación de auditorías vigente a la fecha:";
                let url = "https://docs.google.com/spreadsheets/d/1ilTSArBG2wAlsTBQ9ci_N3CXibdbI98v/edit#gid=1996776958";

                agent.add(new Payload(
                    agent.UNSPECIFIED,
                    sendCardWithFileLink(title, new Date().toISOString(), text, [url]),
                    info)
                );

                agent.add('¿Te puedo ayudar en algo más?');
            }
            else {
                const text = 'Ingresa "auditoria: " seguido del nombre de la auditoría de la cual quieres ver su planeacion. \n Ej: auditoria: AUD_0102_Cobranza interna cartera propia';

                agent.add(new Payload(
                    agent.UNSPECIFIED,
                    sendCardWithFileLink(title, new Date().toISOString(), text, []),
                    info)
                );
            }
        });

    next();
}

module.exports = { planeacionAuditorias };
