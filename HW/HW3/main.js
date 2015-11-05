var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

//client.set("key","test1");
//client.get("key",function(err,value){ console.log(value);});

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);

	// ... INSERT HERE.
	client.lpush("visited",req.url);
	client.ltrim("visited",0,4);

	next(); // Passing the request to the next handler in the stack.
});


 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files

    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
// 	  		console.log(img);
			client.rpush("image",img);
 		});
 	}

    res.status(204).end()
 }]);

 app.get('/meow', function(req, res) {
 	{
 		//if (err) throw err
		client.lpop("image",function (err,imagedata){
			if (err) throw err;
			console.log(imagedata);
 		        res.writeHead(200, {'content-type':'text/html'});
    			res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/><br>returned from host: " + req.client.server._connectionKey.slice(7,11));
			res.end();
 		})
    	//res.end();
 	}
 })

app.get('/set',function(req,res){
	client.set("key1","this message will self-destruct in 10 seconds");
	client.expire("key1",10);
	res.send("key set");
})

app.get('/get',function(req,res){
	client.get("key1",function(err,value){
	//console.log(value);
	res.send(value+" returned from host port: "+req.client.server._connectionKey.slice(7,11));
	});
})

app.get('/recent',function(req,res){
	client.lrange("visited",0,4,function(err,value){
		res.send(value);
	});
})
// HTTP SERVER
 var server = app.listen(process.argv[2], function () {

  var host = server.address().address
   var port = server.address().port

   console.log('Example app listening at http://%s:%s', host, port)
 })

app.get('/',function(req,res){
	res.send('hello world<br>returned from host: '+ req.client.server._connectionKey(7,11))
})

