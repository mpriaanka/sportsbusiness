const axios = require('axios');

async function testSignup() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/signup', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890'
    });
    console.log('Signup Success:', response.data);
  } catch (error) {
    console.error('Signup Failed:', error.response ? error.response.data : error.message);
  }
}

testSignup();
