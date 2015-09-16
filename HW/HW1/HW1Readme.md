# HW1 
### Install dependencies
	npm install

### To provision a droplet on digitalocean
	node digitalocean.js
It creates a droplet on digitalocean and gets public ip address and creates an inventory file with these details for ansible to use.

### To provision a instance on AWS
	node AWS.js
It creates an instance on AWS and gets public ip address and creates an inventory file with these details for ansible to use.

### To install and start nginx webserver on nodes
	ansible-playbook playbook.yml -i inventory

### Link to gif 
[HW1.gif](/HW/HW1/HW1.gif) showing provisioning of servers through node.js, automatically create inventory file and run ansible playbook
to start nginx webserver on nodes.