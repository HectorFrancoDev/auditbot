const { Payload } = require('dialogflow-fulfillment');
// const { request, response } = require("express");

const info = { rawPayload: true, sendAsMessage: true };

const despedidaAction = (req, res, next) => {

    const agent = req.agent;
    const action = req.action;
    
    if (action === 'despedida.action')
        req.intentMap.set('Despedida Intent', () => {
            req.userLogued = {};
            agent.add('Hasta luego, que tengas un buen día');
        });

    next();
};

module.exports = { despedidaAction };
