const Business = require('../models/businessModel');
const Lead = require('../models/leadModel');

const broadcastRFQ = async (req, res, next) => {
    try {
        const { 
            category_id, subcategory, customer_name, customer_email, customer_phone, 
            message, address, lat, lng 
        } = req.body;
        
        const user_id = req.user ? req.user.id : null;

        // 1. Find businesses in this category (optionally within distance if lat/lng provided)
        const searchParams = { lat, lng };
        const businesses = await Business.getByCategory(category_id, subcategory);
        
        if (!businesses || businesses.length === 0) {
            return res.status(404).json({ success: false, message: 'No businesses found in this category' });
        }

        const leadIds = [];
        const io = req.app.get('io');

        // 2. Create a lead for each business
        for (const business of businesses) {
            try {
                const leadId = await Lead.create({
                    business_id: business.id,
                    category_id,
                    user_id,
                    customer_name,
                    customer_email: customer_email || null,
                    customer_phone,
                    message: message || `RFQ broadcast for ${business.name || 'service'}`,
                    address: address || null,
                    payment_method: 'Pay After Service',
                    payment_status: 'Pending'
                });
                leadIds.push(leadId);

                // 3. Notify each provider in real-time
                if (business.provider_id || business.user_id) {
                    const targetRoom = (business.provider_id || business.user_id).toString();
                    io.to(targetRoom).emit('new_lead', {
                        id: leadId,
                        businessId: business.id,
                        customerName: customer_name,
                        message: message,
                        isRFQ: true,
                        createdAt: new Date()
                    });
                }
            } catch (err) {
                console.error(`[BROADCAST FAIL] Business #${business.id}:`, err.message);
            }
        }

        if (leadIds.length === 0) {
            return res.status(500).json({ success: false, message: 'Failed to broadcast to any vendors.' });
        }

        // 4. Notify Admin
        io.to('admin_room').emit('log_activity', {
            action: `RFQ Broadcast sent to ${leadIds.length} businesses`,
            timestamp: new Date()
        });

        res.status(201).json({ 
            success: true, 
            message: `RFQ broadcasted to ${leadIds.length} businesses`,
            leadCount: leadIds.length 
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    broadcastRFQ
};
