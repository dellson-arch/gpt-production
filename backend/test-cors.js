const http = require('http');

// Test CORS preflight request
const testCORS = () => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/socket.io/',
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://localhost:5173',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, Authorization, Cookie',
    }
  };

  const req = http.request(options, (res) => {
    console.log('CORS Preflight Response:');
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response body:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Request error:', error);
  });

  req.end();
};

// Test regular socket.io request
const testSocketIO = () => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/socket.io/?EIO=4&transport=polling',
    method: 'GET',
    headers: {
      'Origin': 'http://localhost:5173',
      'Cookie': 'test=value',
    }
  };

  const req = http.request(options, (res) => {
    console.log('\nSocket.IO Request Response:');
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response body:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Request error:', error);
  });

  req.end();
};

console.log('Testing CORS configuration...\n');
testCORS();

setTimeout(() => {
  console.log('\n' + '='.repeat(50) + '\n');
  testSocketIO();
}, 1000);
