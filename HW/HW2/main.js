var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var faker = require("faker");
var fs = require("fs");
faker.locale = "en";
var mock = require('mock-fs');
var _ = require('underscore');
var Random = require('random-js');

function main()
{
	var args = process.argv.slice(2);

	if( args.length == 0 )
	{
		args = ["subject.js"];
	}
	var filePath = args[0];

	constraints(filePath);

	generateTestCases()

}

var engine = Random.engines.mt19937().autoSeed();

function createConcreteIntegerValue( greaterThan, constraintValue )
{
	if( greaterThan )
		return Random.integer(constraintValue,constraintValue+10)(engine);
	else
		return Random.integer(constraintValue-10,constraintValue)(engine);
}

function Constraint(properties)
{
	this.ident = properties.ident;
	this.expression = properties.expression;
	this.operator = properties.operator;
	this.value = properties.value;
	this.funcName = properties.funcName;
	// Supported kinds: "fileWithContent","fileExists"
	// integer, string, phoneNumber
	this.kind = properties.kind;
}

function fakeDemo()
{
	console.log( faker.phone.phoneNumber() );
	console.log( faker.phone.phoneNumberFormat() );
	console.log( faker.phone.phoneFormats() );
}

var functionConstraints =
{
}

var mockFileLibrary = 
{
	pathExists:
	{
		'dir1': {},	
					
	},
	dirWithContent:
	{
		dir1:
		{
			file1: ''
		}
	},
	fileWithContent:
	{
		dir1: 
		{	
  			file1: 'text content', 					
		},		
	},
};

function generateTestCases()
{

	var content = "var subject = require('./subject.js')\nvar mock = require('mock-fs');\n";
	for ( var funcName in functionConstraints )
	{
		var params = {};

		// initialize params
		for (var i =0; i < functionConstraints[funcName].params.length; i++ )
		{
			var paramName = functionConstraints[funcName].params[i];			
			params[paramName] = '\'' + faker.phone.phoneNumber()+'\'';
			//params[paramName] = '\'\'';
		}

		//console.log( params );

		// update parameter values based on known constraints.
		var constraints = functionConstraints[funcName].constraints;
		//console.log(funcName,constraints);
		// Handle global constraints...
		var fileWithContent = _.some(constraints, {kind: 'fileWithContent'});
		var pathExists      = _.some(constraints, {kind: 'fileExists' });	
		var dirWithContent = _.some(constraints, {kind: 'dirWithContent'});		
		var areacode = _.some(constraints, {kind: 'areacode'});		

		// plug-in values for parameters
		for( var c = 0; c < constraints.length; c++ )
		{
			var constraint = constraints[c];
			if( params.hasOwnProperty( constraint.ident ) )
			{
				
				params[constraint.ident] = constraint.value;
			}			
		}

		//console.log(params);
		// Prepare function arguments.
		var args = Object.keys(params).map( function(k) {return params[k]; }).join(",");
		var argslist = [];
		argslist.push(Object.keys(params).map( function(k) {return params[k]; }).join(","));
		var ele = Object.keys(params).map( function(k) { 			
			if(params[k] == 'undefined'){
				return 1;
			}
			if(typeof(params[k]) == "undefined"){
				return params[k];
			}
			if(typeof(params[k])== "string"){
				return params[k];
			}
			return params[k] - 1;
		}).join(",");
		if(argslist.indexOf(ele) == -1){
			argslist.push(ele);
		}
		var ele = Object.keys(params).map( function(k) { 			
			if(params[k] == 'undefined'){
				return 1;
			}
			if(typeof(params[k]) == "undefined"){
				return params[k];
			}
			if(typeof(params[k])== "string"){
				return params[k];
			}
			return params[k] + 1;
		}).join(",");
		if(argslist.indexOf(ele) == -1){
			argslist.push(ele);
		}		
		ele = Object.keys(params).map( function(k) { 			
			if(params[k] == 'undefined'){
				return params[k];
			}
			if(typeof(params[k]) == "undefined"){
				return params[k];
			}
			if(typeof(params[k])== "string"){
				var random = new Random(Random.engines.mt19937().seed(0));				
				return '"' + random.string() + '"'; // random string
			}
			return params[k] - 1;
		}).join(",");
		if(argslist.indexOf(ele) == -1){
			argslist.push(ele);
		}				
		ele = Object.keys(params).map( function(k) { 			
			if(params[k] == 'undefined'){
				return params[k];
			}
			if(typeof(params[k]) == "undefined"){
				return params[k];
			}
			if(typeof(params[k])== "string"){
				var random = new Random(Random.engines.mt19937().seed(0));				
				return '"' + random.string() + '"'; // random string
			}
			return params[k] + 1;
		}).join(",");
		if(argslist.indexOf(ele) == -1){
			argslist.push(ele);
		}						
		if( pathExists || fileWithContent|| dirWithContent)
		{			
			content += generateMockFsTestCases(pathExists,fileWithContent,dirWithContent,funcName, args);
			content += generateMockFsTestCases(pathExists,fileWithContent,!dirWithContent,funcName, args);
			// Bonus...generate constraint variations test cases....
			content += generateMockFsTestCases(!pathExists,fileWithContent,dirWithContent,funcName, args);
			content += generateMockFsTestCases(!pathExists,fileWithContent,!dirWithContent,funcName, args);
			content += generateMockFsTestCases(pathExists,!fileWithContent,dirWithContent,funcName, args);
			content += generateMockFsTestCases(pathExists,!fileWithContent,!dirWithContent,funcName, args);
			content += generateMockFsTestCases(!pathExists,!fileWithContent,dirWithContent,funcName, args);
			content += generateMockFsTestCases(!pathExists,!fileWithContent,!dirWithContent,funcName, args);
		}
		else if(areacode)
		{
			content += "subject.{0}({1});\n".format(funcName, args );	
			var testarea = "";
			for( var c = 0; c < constraints.length; c++ )
			{
				var constraint = constraints[c];
				if( constraint.kind == "areacode" )
				{
				
					testarea = constraint.value.substring(1,4);
					//console.log(testarea);
				}			
			}		
			ele = Object.keys(params).map( function(k) { 			
			params[k] = '\'' + faker.phone.phoneNumber()+'\'';
			if(params[k].indexOf("-") == 2)
			{
				params[k] = '\'' + params[k].substring(3,params[k].length);
			}		
			//console.log(params[k]);
			var area = "";
			//(345) 567 8999
			if(params[k].indexOf("(")==1)
				area = params[k].substring(2,5);
			// 234-345-5678
			else if(params[k].indexOf("-") > 2)
				area = params[k].substring(1,4);
			// 234.457.5678
			else if(params[k].indexOf(".") > -1)
				area = params[k].substring(1,4);
			//console.log(area);			
			//console.log(params[k].replace(area,testarea));
			return params[k].replace(area,testarea);
			}).join(",");
			content += "subject.{0}({1});\n".format(funcName, ele );
		}		
		else
		{
			// Emit all test cases.
			for(var i=0;i<argslist.length;i++){
				content += "subject.{0}({1});\n".format(funcName, argslist[i] );
			}
			//content += "subject.{0}({1});\n".format(funcName, args );			
		}

	}


	fs.writeFileSync('test.js', content, "utf8");

}

function generateMockFsTestCases (pathExists,fileWithContent,dirWithContent,funcName,args) 
{
	var testCase = "";
	// Build mock file system based on constraints.
	var mergedFS = {};
	if( pathExists )
	{		
		for (var attrname in mockFileLibrary.pathExists) { mergedFS[attrname] = mockFileLibrary.pathExists[attrname]; }
	}
	if( fileWithContent )
	{
		for (var attrname in mockFileLibrary.fileWithContent) { mergedFS[attrname] = mockFileLibrary.fileWithContent[attrname]; }
	}
	if( dirWithContent )
	{
		for (var attrname in mockFileLibrary.dirWithContent) { mergedFS[attrname] = mockFileLibrary.dirWithContent[attrname]; }
	}
	testCase += 
	"mock(" +
		JSON.stringify(mergedFS)
		+
	");\n";

	testCase += "\tsubject.{0}({1});\n".format(funcName, args );
	testCase+="mock.restore();\n";
	return testCase;
}

function constraints(filePath)
{
   var buf = fs.readFileSync(filePath, "utf8");
	var result = esprima.parse(buf, options);

	traverse(result, function (node) 
	{
		if (node.type === 'FunctionDeclaration') 
		{
			var funcName = functionName(node);
			console.log("Line : {0} Function: {1}".format(node.loc.start.line, funcName ));

			var params = node.params.map(function(p) {return p.name});

			functionConstraints[funcName] = {constraints:[], params: params};

			// Check for expressions using argument.
			traverse(node, function(child)
			{
				if( child.type === 'BinaryExpression' && child.operator == "==")
				{
					if( child.left.type == 'Identifier' && params.indexOf( child.left.name ) > -1)
					{
						// get expression from original source code:
						var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1])

						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: child.left.name,
								value: rightHand,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}));
					}
					else if( child.left.type == 'Identifier' && params.indexOf( child.left.name ) == -1)
					{
						// get expression from original source code:
						var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1])

						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: child.left.name,
								value: rightHand,
								funcName: funcName,
								kind: "areacode",
								operator : child.operator,
								expression: expression
							}));
					}									
				}
				if( child.type === 'BinaryExpression' && child.operator == "<")
				{
					if( child.left.type == 'Identifier' && params.indexOf( child.left.name ) > -1)
					{
						// get expression from original source code:
						var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1])

						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: child.left.name,
								value: parseInt(rightHand)-1,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}));
					}
				}
				if( child.type === 'BinaryExpression' && child.operator == ">")
				{
					if( child.left.type == 'Identifier' && params.indexOf( child.left.name ) > -1)
					{
						// get expression from original source code:
						var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1])

						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: child.left.name,
								value: parseInt(rightHand)+1,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}));
					}
				}				
				if( child.type == "CallExpression" && 
					 child.callee.property &&
					 child.callee.property.name =="readFileSync" )
				{
					for( var p =0; p < params.length; p++ )
					{
						if( child.arguments[0].name == params[p] )
						{
							functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[p],
								value:  "'dir1/file1'",
								funcName: funcName,
								kind: "fileWithContent",
								operator : child.operator,
								expression: expression
							}));
						}
					}
				}
				if( child.type == "CallExpression" && 
					 child.callee.property &&
					 child.callee.property.name =="readdirSync" )
				{
					for( var p =0; p < params.length; p++ )
					{
						if( child.arguments[0].name == params[p] )
						{
							functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[p],
								value:  "'dir1'",
								funcName: funcName,
								kind: "dirWithContent",
								operator : child.operator,
								expression: expression
							}));
						}
					}
				}									
				if( child.type == "CallExpression" &&
					 child.callee.property &&
					 child.callee.property.name =="existsSync")
				{
					for( var p =0; p < params.length; p++ )
					{						
						if( child.arguments[0].name == params[p] )
						{
							functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[p],
								// A fake path to a file
								value:  "'path/fileExists'",
								funcName: funcName,
								kind: "fileExists",
								operator : child.operator,
								expression: expression
							}));							
						}
					}
				}	
			});

			console.log( functionConstraints[funcName]);

		}
	});
}

function traverse(object, visitor) 
{
    var key, child;

    visitor.call(null, object);
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function traverseWithCancel(object, visitor)
{
    var key, child;

    if( visitor.call(null, object) )
    {
	    for (key in object) {
	        if (object.hasOwnProperty(key)) {
	            child = object[key];
	            if (typeof child === 'object' && child !== null) {
	                traverseWithCancel(child, visitor);
	            }
	        }
	    }
 	 }
}

function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "";
}


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

main();
