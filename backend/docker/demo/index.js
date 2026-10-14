// node 早期的commonjs 规范
const http = require('http');
const server = http.createServer((req, res) => {
  res.end("hello world")
})
server.listen(1314, '0.0.0.0', () => {
  console.log('node service run on 1314');
})