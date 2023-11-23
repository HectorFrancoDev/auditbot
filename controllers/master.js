const { response, request } = require('express');

const Dependence = require('../models/dependence');
const Plan = require('../models/plan');
const Audit = require('../models/audit');
const ExportAudit = require('../models/export-audit');

const User = require('../models/user');

/**
 * Procesa el documento master para que cree los planes de acción 
 * y los asocie a las dependencias a las que le corresponden
 * @param {Request} req 
 * @param {Response} res 
 */
const processMaster = async(req, res = response) => {

    const dataAudits = req.body.auditorias;
    const dataPlans = req.body.planesAccion;
    const dataExportAudits = req.body.exportAuditorias;

    await Audit.deleteMany();
    await Plan.deleteMany();
    await ExportAudit.deleteMany();

    let planDependence;
    let planLink;
    let matchDependence;
    let newPlan;

    for (const key in dataPlans) 
    {
        planDependence = dataPlans[key].llave; // Nombre dependencia
        // planDependence = planDependence.toUpperCase();
        planLink = dataPlans[key].valor;  // Enlace dependencia
        
        // regex = new RegExp( planDependence, 'i' );

        matchDependence = await Dependence.findOne({ name: planDependence });
        if(matchDependence)
        {
            newPlan = new Plan({ url: planLink, code_dependence: matchDependence.code });
            await newPlan.save();
        }        
    }

    let auditDependence;
    let auditLink;
    let newAudit;
    let auditName;

    for (const key in dataAudits) 
    {
        auditDependence = dataAudits[key].llave; // Nombre dependencia
        // auditDependence = auditDependence.toUpperCase();
        auditLink = dataAudits[key].valor;  // Enlace archivo
        auditName = dataAudits[key].nombre;  /// Nombre de la auditoria
        
        // regex = new RegExp( auditDependence, 'i' );

        matchDependence = await Dependence.findOne({ name: auditDependence });
        if(matchDependence)
        {
            newAudit = new Audit({
                                    url: auditLink, 
                                    code_dependence: matchDependence.code, 
                                    name: auditName
                                });
                                
            await newAudit.save();
        }        
    }

    let auditDescription = '';
    let auditResponsable = '';

    for (const key in dataExportAudits) 
    {
        auditName = dataExportAudits[key].llave; // Nombre 
        auditDescription = dataExportAudits[key].valor;  // Drecripción
        auditResponsable = dataExportAudits[key].nombre;  /// Responsable
        
        // regex = new RegExp( auditDependence, 'i' );
        newAudit = new ExportAudit({
            name: auditName, 
            description: auditDescription, 
            supervisor: auditResponsable
        });

        await newAudit.save(); 
    }

    const plansResult = await Plan.find();
    const auditsResult = await Audit.find();
    const exportAuditsResult = await ExportAudit.find();

    res.json({
        plans: plansResult,
        audits: auditsResult,
        exportAudits: exportAuditsResult
    });
};

const processUsers = async(req, res = response) => {
    let finalUsers = [];
    let dependence = {};
    // Buscar todos los usuarios cuya dependencia exista en la base de datos.
    const users = await User.find();
    for (const user of users) 
    {
        dependence = await Dependence.findOne({ $and: [ {'code': user.code_dependence} ] });
        if(dependence)
        {
            finalUsers.push( { name: user.name, email: user.email } );
            console.log( user.code_dependence );
        }

        dependence = {};
    }

    console.log("Total: " + finalUsers.length);

    res.json( finalUsers );
};

module.exports = {
    processMaster,
    processUsers
};