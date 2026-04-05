import api from './api';

const leadService = {
  sendLead: async (data) => {
    const response = await api.post('/leads', data);
    return { data: response };
  },
  broadcastRFQ: async (data) => {
    const response = await api.post('/rfq/broadcast', data);
    return { success: true, count: response.leadCount };
  },
  getLeadsByBusiness: async (businessId) => {
    const response = await api.get(`/leads/business/${businessId}`);
    return { data: response || [] };
  },
  getUserLeads: async () => {
    try {
      const response = await api.get(`/leads/user`);
      const sanitized = (response || []).map(lead => ({
          ...lead,
          id: lead.id.toString(),
          status: lead.status || 'Pending'
      }));
      return { data: sanitized };
    } catch (e) {
      console.error('API getUserLeads failed', e);
      return { data: [] };
    }
  },
  updateLeadStatus: async (leadId, status) => {
    try {
      const response = await api.patch(`/leads/${leadId}/status`, { status });
      return { success: true, data: response };
    } catch (e) {
      console.error('API updateLeadStatus failed', e);
      return { success: false };
    }
  }
};

export default leadService;
