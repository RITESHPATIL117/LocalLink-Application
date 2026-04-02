const Lead = require('../models/leadModel');

const Business = require('../models/businessModel');

const sendLead = async (req, res, next) => {
    try {
        const { 
            business_id, category_id, customer_name, customer_email, customer_phone, 
            message, address, booking_date, booking_time, payment_method, payment_status, amount 
        } = req.body;
        
        const user_id = req.user ? req.user.id : null;
        
        const leadId = await Lead.create({ 
            business_id, 
            category_id,
            user_id,
            customer_name, 
            customer_email: customer_email || null, 
            customer_phone, 
            message,
            address,
            booking_date,
            booking_time,
            payment_method,
            payment_status,
            amount
        });

        // Real-time notification
        const business = await Business.getById(business_id);
        const io = req.app.get('io');
        
        // 1. Notify Provider (Specific Room)
        if (business && business.provider_id) {
            io.to(business.provider_id.toString()).emit('new_lead', {
                id: leadId,
                businessId: business_id,
                customerName: customer_name,
                message: message,
                amount: amount,
                createdAt: new Date()
            });
            console.log(`Real-time lead emitted to provider ${business.provider_id}`);
        }

        // 2. Notify Admin (Global Room)
        io.to('admin_room').emit('new_lead_received', {
            id: leadId,
            businessName: business ? business.name : 'Unknown Service',
            customerName: customer_name,
            amount: amount,
            createdAt: new Date()
        });

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
        const leadId = req.params.id;
        await Lead.updateStatus(leadId, status);
        
        // Fetch lead with user info to notify them
        const lead = await Lead.getById(leadId);
        if (lead && lead.user_id) {
            const io = req.app.get('io');
            
            // Notify Customer
            io.to(lead.user_id.toString()).emit('booking_status_updated', {
                leadId,
                newStatus: status,
                timestamp: new Date()
            });

            // Notify Admin
            io.to('admin_room').emit('log_activity', {
                action: `Lead #${leadId} status updated to ${status}`,
                timestamp: new Date()
            });
        }

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
