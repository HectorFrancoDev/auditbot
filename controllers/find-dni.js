const { Payload } = require('dialogflow-fulfillment');
const User = require('../models/user');
// const { request, response } = require("express");
const { sendUserLoginMenu } = require('./bot');

const info = { rawPayload: true, sendAsMessage: true };

const validateEnterDni = async (req, res, next) => {

    const action = req.action;
    const agent = req.agent;

    if (action === 'enterdni.action') {

        try {

            let cc = parseFloat(req.body.queryResult.parameters.dni);
            const user = await User.findOne({ 'identification': cc });
            req.intentMap.set('Enter Dni Intent', async () => {

                if (user)
                    agent.add(new Payload(req.agent.UNSPECIFIED, sendUserLoginMenu(user), info));
                else
                    agent.add(`El usuario con identificación ${cc} NO se encuentra registrado, ingresa una identificación válida`);
            });

        } catch (error) {
            throw error;
        }
    }
    
    next();
};

module.exports = { validateEnterDni };
