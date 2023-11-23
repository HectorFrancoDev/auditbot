const { WebhookClient } = require('dialogflow-fulfillment');

const passIntentMapAndAgent = (req, res, next) => {

    req.agent = new WebhookClient({ request: req, response: res });
    req.intentMap = new Map();
    req.action = req.body.queryResult.action; // La acción de dialogflow

    next();
};

module.exports = {
    passIntentMapAndAgent
};
