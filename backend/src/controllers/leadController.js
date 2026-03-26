const Lead = require('../models/leadModel');

const sendLead = async (req, res, next) => {
    try {
        const { business_id, customer_name, customer_email, customer_phone, message } = req.body;
        const leadId = await Lead.create({ business_id, customer_name, customer_email, customer_phone, message });
        res.status(201).json({ success: true, leadId });
    } catch (err) {
        next(err);
    }
};

const getLeadsByBusiness = async (req, res, next) => {
    try {
        const leads = await Lead.getByBusiness(req.params.businessId);
        res.json(leads);
    } catch (err) {
        next(err);
    }
};

const updateLeadStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        await Lead.updateStatus(req.params.id, status);
        res.json({ success: true, message: 'Status updated' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    sendLead,
    getLeadsByBusiness,
    updateLeadStatus
};
