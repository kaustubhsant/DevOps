# HW1 
### Part 1 and 2: Configuring and Provisioning of Servers on 2 service providers and automatically create inventory file
#### To provision a droplet on digitalocean
	node digitalocean.js
The [digitalocean.js](/HW/HW1/digitalocean.js) creates a droplet on digitalocean and gets public ip address and creates an inventory file with these details for ansible to use.

#### To provision a instance on AWS
	node AWS.js
The [AWS.js](/HW/HW1/AWS.js) creates an instance on AWS and gets public ip address and creates an inventory file with these details for ansible to use.

### Part 3: Create ansible playbook
To install and start nginx webserver on nodes the [ansible playbook](/HW/HW1/playbook.yml) and previously created [inventory](/HW/HW1/inventory) file is used.
	ansible-playbook playbook.yml -i inventory

### Part 4: Configuration management through npm
The [package.json](/HW/HW1/package.json) has the version and depencencies to be installed. To install all depenndencies run following command.
	npm install

### Gif of the complete process
[HW1.gif](/HW/HW1/HW1.gif) shows provisioning of servers through node.js, automatically creating of inventory file and running ansible playbook
to start nginx webserver on nodes.
##### Steps followed in Gif
1. Run digitalocean.js to create droplet.
2. Check public IP address returned in cmdline is same as in dashboard.
3. Run AWS.js to create instance on AWS.
4. Check instanceId and public IP address returned in cmdline is same as in dashboard.
5. Check inventory file is created and IP addresses in it are same as created above.
6. Run ansible playbook passing playbook.yml and inventory as arguments.
7. Check nginx is installed with no errors.
8. Visit public IP addresses to check nginx webserver is started on both instances.
