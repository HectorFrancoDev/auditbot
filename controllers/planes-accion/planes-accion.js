const { Payload } = require('dialogflow-fulfillment');
// const { request, response } = require("express");
const Plan = require('../../models/plan');
const { sendCardWithFileLink } = require('../bot');

const info = { rawPayload: true, sendAsMessage: true };

let userLogued = ['HOLA']

const planesAccion = async (req, res, next) => {

    const action = req.action;
    userLogued = req.userLogued[0];
    const agent = req.agent;

    console.log('USUARIO PLANES ACCION: ', userLogued);

    if (action === 'planes.accion.action')

        req.intentMap.set('Planes Accion Intent', async () => {
            let urls = [];

            if (userLogued) {

                if (userLogued.type === 'SUPERVISOR') {
                    urls.push("https://docs.google.com/spreadsheets/d/1Ocp9uqZuot_OeXUu5iDsmwDZwvx74myVFnnxMV2lYv8/edit?usp=sharing");

                    let title = "Planes de Acción";
                    let text = "En el siguiente botón podrás encontrar la carpeta con los planes de acción vigentes a la fecha:";

                    agent.add(new Payload(
                        agent.UNSPECIFIED,
                        sendCardWithFileLink(title, new Date().toISOString(), text, urls),
                        info)
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

                                    for (const plan of plans) {
                                        urls.push(plan.url);
                                    }
                                } else {
                                    agent.add('No existen planes de acción asociados a tu nombre');
                                }
                            } catch (error) {
                                console.error(error);
                            }
                        }

                        let title = "Planes de Acción";
                        let text = "En el siguiente botón podrás encontrar la carpeta con los planes de acción vigentes a la fecha:";

                        agent.add(new Payload(
                            agent.UNSPECIFIED,
                            sendCardWithFileLink(title, new Date().toISOString(), text, urls),
                            info)
                        );

                        agent.add('¿Te puedo ayudar en algo más?');
                    }
                }

                else {
                    // const departmentId = '61313d3f7486eb3f9c4dde93';
                    const departmentId = userLogued.code_dependence;

                    try {
                        // const department = await Department.findById( departmentId );
                        const plans = await Plan.find({ code_dependence: departmentId });
                        if (plans) {

                            for (const plan of plans) {
                                urls.push(plan.url);
                            }
                        } else {
                            agent.add('No existen planes de acción asociados a tu nombre');
                        }
                    } catch (error) {
                        console.error(error);
                    }

                    let title = "Planes de Acción";
                    let text = "En el siguiente botón podrás encontrar la carpeta con los planes de acción vigentes a la fecha:";
                    // let url = "https://docs.google.com/spreadsheets/d/1A1MvN7mcdgbUvHzetkjQbQz85xSSvHWz0aMA40FWHGA/edit#gid=310663529";

                    agent.add(new Payload(
                        agent.UNSPECIFIED,
                        sendCardWithFileLink(title, new Date().toISOString(), text, urls),
                        info)
                    );

                    agent.add('¿Te puedo ayudar en algo más?');
                }

            }
            else {
                agent.add('No puedes acceder a la información sin iniciar sesión');
            }
        });

    next();

}

module.exports = { planesAccion };
