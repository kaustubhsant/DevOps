var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var http = require('http')
var httpProxy = require('http-proxy')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

client.del("redirects");

client.lpush("redirects","http://127.0.0.1:3001");
client.lpush("redirects","http://127.0.0.1:3002");

var proxy = httpProxy.createProxyServer({});
http.createServer(function(req, res) {
	client.rpoplpush("redirects","redirects",function(err,value){
		proxy.web(req, res, { target: value });
		console.log("request redirected to: " + value);
	})

}).listen(3000);
