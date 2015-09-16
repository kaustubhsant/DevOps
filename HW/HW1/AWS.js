var os = require('os');
var fs = require('fs');
var AWS = require('aws-sdk');

AWS.config.loadFromPath('config/AWSconfig.json');

var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-1624987f', // Amazon Linux AMI x86_64 EBS
  InstanceType: 't2.micro',
  MinCount: 1, 
  MaxCount: 1,
  KeyName: "devops",
  SecurityGroupIds: ["sg-c37b7aa4"],
  SecurityGroups: ["devops"]
};


console.log("Attempting to create instance: ", JSON.stringify(params));
ec2.runInstances(params, function(err, data) {
  if (err) { 
  	console.log("Could not create instance", err); 
  	return; 
	}

  var instanceId = data.Instances[0].InstanceId;
  console.log("Created instance:", instanceId);   
  console.log("getting public ipaddress of instance...");
  setTimeout(function(){ec2.describeInstances({InstanceIds:[instanceId]}, function(err, data){
  	if (err) { 
  			console.log("Could not find instance", err); 
  			return; 
		}
		console.log("recieved public ip address: ",data.Reservations[0].Instances[0].PublicIpAddress);
		console.log("writing to inventory file...");
		var inventorydata = "node1 ansible_ssh_host=" + data.Reservations[0].Instances[0].PublicIpAddress + " ansible_ssh_user=ec2-user ansible_ssh_private_key_file=/home/vagrant/keys/devops.pem\n";
		fs.appendFileSync('inventory', inventorydata, encoding='utf8');
		console.log("finished writing to inventory file");
  });},30000);

});
