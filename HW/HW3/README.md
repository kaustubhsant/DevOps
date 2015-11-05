#Homework 3
The [main.js](/main.js) file has the code for the following goals of the homework:

1. Complete set/get 
2. Complete recent 
3. Complete upload/meow

The redis server and client are started in different terminals.

	src/redis-server (terminal 1)
	node main.js 3000 (terminal 2)

The below commands are run in terminal to access the routes created. 

	curl localhost:3000/set
	curl localhost:3000/get
	curl -F "image=@./img/morning.jpg" localhost:3000/upload
	curl localhost:3000/meow

The goal *Additional service instance running* is completed by running 2 instances of main.js with different ports to have an additional instance of redis client service running.

	node main.js 3000 (terminal 1)
	node main.js 3001 (terminal 2)

The goal *Demonstrate proxy* is implemented by the [proxy.js](/proxy.js) file.

	node main.js 3001 (terminal 1)
	node main.js 3002 (terminal 2)
	node proxy.js (terminal 3)


##Screencast
![image](/hw3.gif)
