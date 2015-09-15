var os = require('os');
var AWS = require('aws-sdk');

AWS.config.loadFromPath('config/AWSconfig.json');

var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-1624987f', // Amazon Linux AMI x86_64 EBS
  InstanceType: 't1.micro',
  MinCount: 1, 
  MaxCount: 1,
  KeyName: "devops",
  SecurityGroupIds: ["sg-c37b7aa4"],
  SecurityGroups: ["devops"]
};


// Create the instance
ec2.runInstances(params, function(err, data) {
  if (err) { 
  	console.log("Could not create instance", err); 
  	return; 
	}

  var instanceId = data.Instances[0].InstanceId;
  console.log("Created instance", instanceId);   
  
  setTimeout(function(){ec2.describeInstances({InstanceIds:[instanceId]}, function(err, data){
  	if (err) { 
  			console.log("Could not find instance", err); 
  			return; 
		}
		console.log(data.Reservations[0].Instances[0].PublicIpAddress);
  });},30000);

});


