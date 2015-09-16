# HW1 
### Part 1 and 2: Configuring and Provisioning of Servers on 2 service providers and automatically create inventory file
#### To provision a droplet on digitalocean
	node digitalocean.js
The [digitalocean.js](/HW/HW1/digitalocean.js) creates a droplet on digitalocean and gets public ip address. It also appends to inventory file with these details for ansible to use.

#### To provision a instance on AWS
	node AWS.js
The [AWS.js](/HW/HW1/AWS.js) creates an instance on AWS and gets public ip address. It also appends to inventory file with these details for ansible to use.

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

### About AWS CodePipeline
AWS CodePipeline is a continuous delivery service for fast and reliable application updates. CodePipeline builds, tests, and deploys code every time there is a code change, based on the release process models that are defined. This enables user to rapidly and reliably deliver features and updates. End-to-end solution can also be built by using pre-built plugins for popular third-party services like GitHub or integrating new own custom plugins into any stage of the release process. The Key features of AWS CodePipeline include the following.
###### Workflow Modeling
 AWS CodePipeline provides a graphical user interface to create, configure, and manage the pipeline and its various stages and actions, allowing user to easily visualize and model the release process workflow.
###### AWS Integrations
AWS CodePipeline can pull source code for users pipeline directly from Amazon S3. It can also deploy to AWS CodeDeploy and AWS Elastic Beanstalk. 
###### Pre-Built Plugins
AWS CodePipeline allows to integrate third-party developer tools, like GitHub or Jenkins, into any stage of the release process with one click. 
###### Custom Plugins
AWS CodePipeline allows to integrate own custom systems. User can register a custom action that allows him to hook the servers into the pipeline by integrating the CodePipeline open source agent with user's servers.
###### Declarative Templates
AWS CodePipeline allows to define the pipeline structure through a declarative JSON document that specifies the release workflow and its stages and actions. These documents enable to update existing pipelines as well as provide starting templates for creating new pipelines.
###### Access Control
AWS CodePipeline uses AWS IAM to manage who can make changes to the release workflow, as well as who can control it. 

