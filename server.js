const http  = require('http');
const app = require('./app')
const port = process.env.PORT || 8081;
const server = http.createServer(app);
server.listen(port);


/*
let a = new Promise(resolve=>resolve(1)).then(res=>{
	console.log('rfvr');
   return res;
});
console.log(a);*/