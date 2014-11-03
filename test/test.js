/*! 
 * 棉花糖 测试入口
 * @author Fredric 
 * @date 2014-09-28
 */

var json = require("../util/json");

//测试JSON工具模块
function testJSON1(){
	var jsondata = [{
			username:"test1",
			password:"Hi"
	},{
		username:"test2",
		password:"Hi"
	}];
		
	json.evalJSON(jsondata,function(obj){
		console.log(obj[0]);
		console.log(obj[1]);
		console.log(obj.length);
	});	
}

function testJSON2(){
	//var jsondata = [];
	//var jsondata = {}; //无法识别为json对象
	var jsondata = "[]";
	json.evalJSON(jsondata,function(obj){
		console.log(obj[0]);
		console.log(obj[1]);
		console.log(obj.length);
	});	
}

function testJSON3(){
	
	var jsondata = [{
		username:"test1",
		password:"Hi",
		note:{
			note1:"Add new",
			note2:"Add Another"
		}
	}];

	json.evalJSON(jsondata,function(obj){
		console.log(jsondata[0]);
		console.log(jsondata[1]);
		console.log(jsondata[0].password);
		console.log(jsondata.password);
		console.log(jsondata[0].note.note1);
		console.log(jsondata.length);
		console.log("***************************");
		console.log(obj[0]);
		console.log(obj[1]);
		console.log(obj[0].password);
		console.log(obj.password);
		console.log(obj[0].note.note1);
		console.log(obj.length);
		
	});	
}

//*************************************************************************/
var tenantDao = require("../admindao/tenant");

function testTenant(){
	
	tenantDao.addTenantUser(13666666666,"fredric1","fredric1",function(err){
		if(err){console.log(err);}
	});
	
}

exports.testStub = function(callback){
	console.log("begin to test:");
	//testAddTenant(); passed
	//format4EasyUI();
	//testMenus();
	//testSplit();
	/*testTenantUser(function(err){
		return callback();
	});*/
	
	//testAddTenant();
	//testgetAdreesList();
	//testgetAdressDetail();
	testgetMenusByUserId();
	//testArray();
	//testAsyn();
	//testTenant();
	//testJSON1(); //passed
	//testJSON2(); //passed
	//testJSON3();
	return callback();
}

function test1(id,cb){
	console.log(id);
	cb();
}

function test2(id,cb){
	console.log(id);
	cb();
}

var async = require('async');

//测试同步接口
function testAsyn(){	
	async.parallel([    
	    function(callback){
	    	console.log("function1");
	    	test1(11,function(){
	    		console.log("function11");
	    		callback(null,"param1");
	    	});    	
	    },
	    function(callback){
	    	console.log("function2");
	    	test2(12,function(){
	    		console.log("function22");
	    		 callback(null,"param2");
	    	});    	
	    }	              
	],
	function(err,results){
		console.log("final callback");
		console.log(results);
		console.log(err);
	});
}

var tenantdao = require("../admindao/tenant");

function testAddTenant(){
	tenantdao.addTenant("18000001111","Fredric","Hello",function(err){		
	});
}

function format4EasyUI(){
	var tar = {};
	var tmp = { id: '11',
			  text: 'test1',
				  children: 
				   [ { id: '111', text: 'test' },
				     { id: '112', text: 'test' },
				     { id: '113', text: 'test' } ] };
	
	tar.id = 0;
	tar.text = "test";
	tar.children = new Array();
	tar.children[tar.children.length] = tmp;
	
	tar.children.push({ id: '11',
		  text: 'test1',
			  children: 
			   [ { id: '111', text: 'test' },
			     { id: '112', text: 'test' },
			     { id: '113', text: 'test' } ] });
	

	
	tar.children.push(tmp);
	console.log(tar);
	
	for(i = 0; i < 2; i++){
		//tar.children[i].id = 12;
		//tar.children[i].text = "hello"+i;		
		//tar.children.push({"ID":i});
	}	
	//tar.children.push({"id":1})
	//console.log(tar);
}

var userapp = require("../pubapp/userapp");

function testMenus(){
	userapp.getMenusByEnterId("15000000000",function(){
		
	});
}

function testArray(){
	var tmp1 = new Array();	
	var tmp2 = new Object();
	
	tmp2.id = 1;
	tmp2.children = new Array();
	
	var tmp3 = new Object;
	tmp3.ID = 2;
	
	tmp2.children.push(tmp3);
	tmp2.children.push(tmp3);
	
	tmp1.push(tmp2);
	tmp1.push(tmp2);
	
	console.log(tmp2);
	console.log(tmp1);
	console.log(JSON.stringify(tmp1));
}


function testSplit(){
	
	//var temp = "1-2-3" passed
	var temp = "1";
	var out  = temp.split('-');	
	
	console.log(out.length);
	
}

function testTenantUser(callback){
	//tenantdao.addTenantUser("13111111113","13111111151","123456",null);
	//tenantdao.addTenantUser("13111111113","13111111161","123456",null);
	//tenantdao.addTenantUser("13111111113","13111111171","123456",null);
	
	var data =new Array();
	data.push({'username':'13111111191','password':'123456'});
	data.push({'username':'13111111192','password':'123456'});
	data.push({'username':'13111111193','password':'123456'});
	
	tenantdao.addTenantUser('13111111113',data,function(err){
		return callback(err);
	});
}

var mbapp = require('../mbapp/mbapp');

function testgetAdreesList(){
	mbapp.getAdreesList('13111111111',function(err,data){
		console.log(JSON.stringify(data));
	});
}

function testgetAdressDetail(){
	mbapp.getAdressDetail('13111111111','张三','13111112222',function(err,data){
		console.log(JSON.stringify(data));
	});
}

function testgetMenusByUserId(){
	//userapp.getMenusByUserId('13111111111','13111111112',function(){});
	//userapp.getMenusByUserId('13111111111','13111111113',function(){}); //passed
	//userapp.getMenusByUserId('13111111111','13111111114',function(){}); //passed
}

