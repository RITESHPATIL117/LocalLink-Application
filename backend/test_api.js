(async () => {
  try {
    const email = `test${Date.now()}@test.com`;
    const regRes = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Testy',
        email: email,
        password: 'password123',
        role: 'user',
        phone: '1234567890'
      })
    });
    const regData = await regRes.json();
    console.log('Registered token:', regData.token);
    
    const leadsRes = await fetch('http://localhost:3000/api/leads/user', {
      method: 'GET',
      headers: { Authorization: `Bearer ${regData.token}` }
    });
    const leadsData = await leadsRes.json();
    console.log('Leads fetched:', leadsRes.status, leadsData);
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
