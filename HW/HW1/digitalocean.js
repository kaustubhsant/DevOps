var needle = require("needle");
var os   = require("os");
var config = require('config');
var fs = require('fs');

var token = config.get('token');

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + token
};

var client =
{	

	createDroplet: function ( onResponse)
	{
		var data = 
		{
			"name": "ksant-"+ os.hostname(),
			"region": "nyc1",
			"size":"512mb",
			"image":"centos-7-0-x64",
			// Id to ssh_key already associated with account.			
			"ssh_keys": config.get('ssh_keys'),
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},

	listDroplet: function( dropletId, onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse);
	}

};


 client.createDroplet( function(err, resp, body)
 {
 	var data = body;
 	// StatusCode 202 - Means server accepted request.
 	if(!err && resp.statusCode == 202)
 	{
 		//console.log( JSON.stringify( body, null, 3 ) );
 		console.log("created droplet with id:",data.droplet.id);
 		console.log("getting public ipaddress of droplet...."); 		
 		setTimeout( function() {client.listDroplet(data.droplet.id, function(error,response) {
			var data2 = response.body;
	
			if( data2.droplet )
			{
				//console.log(data2.droplet);		
				var ip_address = data2.droplet.networks.v4[0].ip_address;
				console.log("recieved public ipaddress:",ip_address);
				console.log("writing to inventory file...");	
				var inventorydata = "node0 ansible_ssh_host=" + ip_address + " ansible_ssh_user=root ansible_ssh_private_key_file=/home/vagrant/.ssh/id_rsa\n";
				fs.appendFileSync('inventory', inventorydata, encoding='utf8');
				console.log("finished writing to inventory file");
			}
		});},10000);
 		
 	}
 });
