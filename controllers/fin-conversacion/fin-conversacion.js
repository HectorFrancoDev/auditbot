const { Payload } = require('dialogflow-fulfillment');
const { request, response } = require("express");
const { sendUserLoginMenu } = require('../bot');

const info = { rawPayload: true, sendAsMessage: true };

const finConversacion = (req = request, res = response, next) => {

    const action = req.action;
    const userLogued = req.userLogued;
    const agent = req.agent;

    if (action === 'fin.action')

        req.intentMap.set('Fin Conversacion Intent', () => {

            const desicion = req.body.queryResult.parameters.desicion;

            if (desicion == 'si') {
                agent.add(new Payload(
                    agent.UNSPECIFIED,
                    sendUserLoginMenu(userLogued),
                    info)
                );
            }
            else {
                req.userLogued = {};
                agent.add('Hasta luego, que estés bien!');
            }
        });

    next();
}

module.exports = { finConversacion };
