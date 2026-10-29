const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8080;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg'
};

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') reqUrl = '/index.html';

  // Decode URI component for special characters
  const decodedUrl = decodeURIComponent(reqUrl);
  let filePath = path.join(__dirname, decodedUrl);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found - تطبيق إياد زيد');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log('========================================================');
  console.log('🌟 سيرفر تطبيق إياد زيد التعليمي يعمل بنجاح! 🌟');
  console.log('========================================================');
  console.log('');
  console.log(`💻 للتشغيل على هذا الكمبيوتر:`);
  console.log(`   http://localhost:${PORT}`);
  console.log('');
  console.log(`📱 للتثبيت والتشغيل على الآيفون والأندرويد (بنفس شبكة الواي فاي):`);
  console.log(`   http://${localIp}:${PORT}`);
  console.log('');
  console.log('--------------------------------------------------------');
  console.log('🍏 طريقة التثبيت على الآيفون:');
  console.log('   افتح الرابط في Safari ثم اضغط Share > "إضافة إلى الشاشة الرئيسية"');
  console.log('🤖 طريقة التثبيت على الأندرويد:');
  console.log('   افتح الرابط في Chrome ثم اضغط ⋮ > "تثبيت التطبيق"');
  console.log('--------------------------------------------------------');
  console.log('اضغط Ctrl + C لإيقاف السيرفر.');
});

