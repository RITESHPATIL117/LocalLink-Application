const Lead = require('../models/leadModel');

const Business = require('../models/businessModel');

const sendLead = async (req, res, next) => {
    try {
        const { business_id, category_id, customer_name, customer_email, customer_phone, message } = req.body;
        const user_id = req.user ? req.user.id : null;
        
        const leadId = await Lead.create({ 
            business_id, 
            category_id,
            user_id,
            customer_name, 
            customer_email: customer_email || null, 
            customer_phone, 
            message 
        });

        // Real-time notification
        const business = await Business.getById(business_id);
        if (business && business.provider_id) {
            const io = req.app.get('io');
            io.to(business.provider_id.toString()).emit('new_lead', {
                id: leadId,
                businessId: business_id,
                customerName: customer_name,
                message: message,
                createdAt: new Date()
            });
            console.log(`Real-time lead emitted to provider ${business.provider_id}`);
        }

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

const getLeadsByUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const leads = await Lead.getByUser(userId);
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
    getLeadsByUser,
    updateLeadStatus
};
