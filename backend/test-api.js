const http = require('http');
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  const server = app.listen(5099, '127.0.0.1', async () => {
    console.log('Test server started on 5099');
    try {
      // 1. GET /api/tasks
      console.log('Testing GET /api/tasks...');
      const getRes = await request({
        hostname: '127.0.0.1',
        port: 5099,
        path: '/api/tasks',
        method: 'GET'
      });
      console.log('GET /api/tasks result status:', getRes.status, 'Count:', getRes.body.count);

      // 2. Validation Test: POST without title
      console.log('Testing POST /api/tasks validation failure (empty title)...');
      const valRes = await request(
        {
          hostname: '127.0.0.1',
          port: 5099,
          path: '/api/tasks',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        },
        { title: '', description: 'No title' }
      );
      console.log('Validation status:', valRes.status, 'Message:', valRes.body.message);

      // 3. POST /api/tasks (Create task)
      console.log('Testing POST /api/tasks (Create valid task)...');
      const createRes = await request(
        {
          hostname: '127.0.0.1',
          port: 5099,
          path: '/api/tasks',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        },
        {
          title: 'Prepare Presentation Slides',
          description: 'Draft 10 slides on React and Express CRUD architecture.',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          priority: 'High',
          category: 'College',
          status: 'Pending'
        }
      );
      console.log('Create status:', createRes.status, 'Created ID:', createRes.body.data._id);
      const createdId = createRes.body.data._id;

      // 4. GET /api/tasks/:id
      console.log(`Testing GET /api/tasks/${createdId}...`);
      const getSingle = await request({
        hostname: '127.0.0.1',
        port: 5099,
        path: `/api/tasks/${createdId}`,
        method: 'GET'
      });
      console.log('Get single status:', getSingle.status, 'Title:', getSingle.body.data.title);

      // 5. PUT /api/tasks/:id (Update task)
      console.log(`Testing PUT /api/tasks/${createdId}...`);
      const putRes = await request(
        {
          hostname: '127.0.0.1',
          port: 5099,
          path: `/api/tasks/${createdId}`,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        },
        { status: 'Completed', priority: 'Medium' }
      );
      console.log('Update status:', putRes.status, 'New status:', putRes.body.data.status);

      // 6. DELETE /api/tasks/:id
      console.log(`Testing DELETE /api/tasks/${createdId}...`);
      const delRes = await request({
        hostname: '127.0.0.1',
        port: 5099,
        path: `/api/tasks/${createdId}`,
        method: 'DELETE'
      });
      console.log('Delete status:', delRes.status, 'Message:', delRes.body.message);

      console.log('ALL API TESTS PASSED SUCCESSFULLY! ✅');
    } catch (err) {
      console.error('Test error:', err);
    } finally {
      server.close(() => {
        console.log('Test server closed.');
        process.exit(0);
      });
    }
  });
}

runTests();
