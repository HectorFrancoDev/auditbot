const { response, request } = require('express');
const User = require('../models/user');

const ICON_AUDITBOT = "https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/logo_auditbot.png?alt=media&token=9e54aec1-c136-4b87-9478-168e9118b239";
const ICONS_USERS = {
    supervisor: "https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/icono_supervisor.png?alt=media&token=f3a59143-ecc2-401e-8279-ace7a6d33434",
    consultor: "https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/icono_consulta.png?alt=media&token=18d5a360-6c79-4cf0-8350-be044b763ac1",
    gestor: "https://firebasestorage.googleapis.com/v0/b/auditbot-c41e4.appspot.com/o/Icono_gestor.png?alt=media&token=68d5a69a-bc11-4ac4-94ed-134864765204"
};

/**
 * Muestra la interacción cuando un usuario hace una pregunta frecuente al BOT.
 * @param {string} title Titulo de la carta -> ¿Qué es una auditoria? | ¿Visita del auditor?
 * @param {string} url Link del archivo -> PDF con la respuesta a la pregunta.
 * @returns Payload
 */
const sendButtonFileFrecuentRequest = (title, subtitle, url) => {
    return {
        "hangouts": {
            "header": {
                title,
                "subtitle": convertDate(subtitle),
                "imageUrl": ICON_AUDITBOT,
            },
            "sections": [
                {
                    "widgets": [
                        {
                            "textParagraph": {
                                "text": "En el siguiente botón podrás encontrar la información solicitada:"
                            }
                        },
                        {
                            "buttons": [
                                {
                                    "textButton": {
                                        "text": "Ver Información",
                                        "onClick": {
                                            "openLink": {
                                                url
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };
};

/**
 * Permite enviar el menu de opciones al usuario logueado.
 * @param {User} user Usuario que se logueo.
 * @returns Payload
 */
const sendUserLoginMenu = (user) => {

    let name = user.name.split(' ');
    name = `${capitalize(name[0])} ${capitalize(name[1])}`

    const userType = user.type;
    let imageUrl = '';
    switch (userType) {
        case 'SUPERVISOR':
            imageUrl = ICONS_USERS.supervisor;
            break;
        case 'USER':
            imageUrl = ICONS_USERS.consultor;
            break;
    }

    return {
        "hangouts": {
            "header": {
                "title": name,
                "subtitle": user.type,
                imageUrl,
            },
            "sections": [
                {
                    "widgets": [
                        {
                            "textParagraph": {
                                "text": `Hola ${name}, A través de mí podrás consultar información sobre Auditorías, ¿Qué deseas ver?`
                            }
                        },
                        {
                            "keyValue": {
                                "content": "Planeación de auditorías",
                                "icon": "STAR"
                            }
                        },
                        {
                            "keyValue": {
                                "content": "Estado planes de acción",
                                "icon": "STAR"
                            }
                        },
                        {
                            "keyValue": {
                                "content": "Informes de auditorías",
                                "icon": "STAR"
                            }
                        },
                        {
                            "textParagraph": {
                                "text": "<p>¿Qué deseas consultar?</p>"
                            }
                        }
                    ]
                }
            ]
        }
    };

};

/**
 * Permite enviar el menu de opciones al usuario logueado.
 * @param {User} user Usuario que se logueo.
 * @returns Payload
 */
const sendUserAuditoria = (user, auditorias = []) => {

    let name = user.name.split(' ');
    name = `${capitalize(name[0])} ${capitalize(name[1])}`

    const userType = user.type;
    let imageUrl = '';
    switch (userType) {
        case 'SUPERVISOR':
            imageUrl = ICONS_USERS.supervisor;
            break;
        case 'USER':
            imageUrl = ICONS_USERS.consultor;
            break;
    }

    return {
        "hangouts": {
            "header": {
                "title": name,
                "subtitle": user.type,
                imageUrl,
            },
            "sections": auditorias
        }
    };

};

/**
 * Permite enviar una carta que contiene un enlace a un archivo final.
 * @param {string} title 
 * @param {string} subtitle 
 * @param {string} text 
 * @param {string} url 
 * @returns 
 */
const sendCardWithFileLink = (title, subtitle, text, urls = [], buttonText = '') => {

    let showUrls = [];

    for (const url of urls) {
        showUrls.push(
            {
                "textButton": {
                    "text": buttonText ? buttonText : 'Ver Información',
                    "onClick": {
                        "openLink": {
                            url
                        }
                    }
                }
            }
        );
    }

    return {
        "hangouts": {
            "header": {
                title,
                "subtitle": convertDate(subtitle),
                "imageUrl": ICON_AUDITBOT
            },
            "sections": [
                {
                    "widgets": [
                        {
                            "textParagraph": {
                                text
                            }
                        },
                        {
                            "buttons": showUrls
                        }
                    ]
                }
            ]
        }
    };
};

/**
 * Convierte una palabra cualquiera en una palabra Capitalizada
 * @param {String} word 
 * @returns {String} retorna la palabra Capitalizada
 */
function capitalize(word) {
    return word[0].toUpperCase() + word.substring(1).toLowerCase();
}

/**
 * Convierte una fecha en formato Date() en una fecha legible formato estandar
 * @param {Date} date 
 * @returns {String} fecha en formato dd/mm/AAAA
 */
function convertDate(date = '') {

    if (date.length > 0) {
        const fecha = date.substring(0, 10).split('-');
        return `${fecha[2]}/${fecha[1]}/${fecha[0]}`
    }
    return null;
}

module.exports = {
    sendButtonFileFrecuentRequest,
    sendUserLoginMenu,
    sendCardWithFileLink,
    sendUserAuditoria
}