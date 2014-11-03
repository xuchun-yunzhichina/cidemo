/*! 
 * 棉花糖 部门数据操作
 * @author Fredric 
 * @date 2014-10-14
 */

var db  = require('../util/dbmanager');
var set = require('../util/hashmap');
var mongoose = db.mhtdb().mongoose;
var Schema   = db.mhtdb().Schema;

var enterDept = new Schema({
	id:		{type:String},
	text:	{type:String},
	subdept:[{ //一级部门,编号11,12,13....
	         id:	{type:String},
	         text:	{type:String},
	         subdept:[{ //二级部门,编号111,112,113
	        	 id:	{type:String},
	        	 text:  {type:String},
	        	 subdept:[{ //三级部门,编号1111,1112,1113
	        		 id:	{type:String},
	        		 text:  {type:String}
	        	 }]
	         }]
	}]
});

var modelmap = new set.hashmap();

function getModel(ID){
	if(null != modelmap.get(ID)){
		return modelmap.get(ID);
	}else{
		var enterDeptModel = db.getEnterDb(ID).model('enterDept',enterDept,'dept');
		modelmap.put(ID,enterDeptModel);
		return enterDeptModel;
	}	
}

/*-
 * 初始化部门信息
 * 该函数在租户注册时调用
 */
exports.initDeptInfo = function(id,callback){
	
	var Entity = new getModel(id)({
			id:		"1",
			text:	"部门列表",
			subdept: []
	});
	
	Entity.save(function(err){
		return callback(err);
	});
}

/*-
 * 获取部门信息
 */
exports.getDeptInfo = function(ID,callback){
	getModel(ID).findOne({"id":1},function(err,dept){
		return callback(err,dept);
	});
}

/*-
 * 增加部门信息
 * 遍历dept数组，寻找父节点id，若找到则添加子节点ID至数组队尾，
 * 其id号为父节点Id + 索引，如11 + 2,为11父节点的第三个数值
 * @id:企业ID
 * @parentid:父节点ID
 * @deptname:待添加节点数据(当前未部门名称)
 * @callback:回调函数
 */
exports.addDeptNode = function(id,parentid,deptname,callback){
	
	var temp = false;
	
	getModel(id).find({},function(err,dept){
		if(err || null === dept){
			return callback("failed");
		}else{
			var node = {};
			//添加一级部门
			if(1 == calNodeLen(parentid)){
			   node.id   = initNodeID(parentid, dept[0].subdept);
			   node.text = deptname;
			   
			   dept[0].subdept.push(node);
			   
			   temp = true;
				
			}else if(2 == calNodeLen(parentid)){
				
				//添加二级部门
				for(var i = 0; i < dept[0].subdept.length; i++){
					if(parentid == dept[0].subdept[i].id){
						node.id   = initNodeID(parentid, dept[0].subdept[i].subdept);
						node.text = deptname;
						
						dept[0].subdept[i].subdept.push(node);
					}
				}
				
				temp = true;
				
			}else if(3 == calNodeLen(parentid)){
				//添加三级部门
				for(var i = 0; i < dept[0].subdept.length; i++){
					for(var j = 0; j < dept[0].subdept[i].subdept.length; j++){
						if(parentid == dept[0].subdept[i].subdept[j].id){
							node.id   = initNodeID(parentid, dept[0].subdept[i].subdept[j].subdept);
							node.text = deptname;
							
							dept[0].subdept[i].subdept[j].subdept.push(node);
						}
					}
				}
				
				temp = true;
			}else{ //超过部门树限制
				return callback("failed");
			}	
			
			if(true == temp){	   
			   getModel(id).findOneAndUpdate({'id':1},
					   {"subdept":dept[0].subdept},
					   function(err){
					return callback(err);
			   });
			}else{
				return callback("failed");
			}
		}
	});
}


/*-
 * @parentid:父节点ID
 * @subdept:待添加的节点队列
 */
function initNodeID(parentid, subdept){
	var newid = parentid;
	var temp  = false;
		
	for(var i = 0; i < subdept.length; i++){
		newid = parentid +'-'+i;
		
		for(var j = 0; j <subdept.length; j++){
			if(subdept[j].id == newid){
				temp = true;
				break;
			}
		}
		
		//找到没用到的编号
		if(false == temp){
			return newid;
		}	
	}
	
	newid = parentid + '-' + subdept.length;
	return newid;
}

//根据ID分级长度，判断是几级部门
function calNodeLen(id){
	var node = id.split('-');
	
	return node.length;
}


/*-
 * 删除部门节点信息
 * 根据部门id编码规则解析至指定节点，例如1-1-1-2，为第1级部门，第1个子部门下的第2个子部门
 * @id:企业租户ID
 * @nodeid:待删除企业id
 * @callback:回调函数
 */
exports.delDeptNode = function(id,nodeid,callback){
	
	var temp = false;
	
	getModel(id).findOne({"id":1}, function(err,dept){
		if(err && null == dept){
			return callback("failed");
		}else{
			
			if(2 == calNodeLen(nodeid)){
				//待删除是一级部门
				for(var i = 0; i < dept.subdept.length; i++){
					if(nodeid == dept.subdept[i].id){						
						dept.subdept.splice(i,1);						
						temp = true;
						break;
					}
				}
				
			}else if(3 == calNodeLen(nodeid)){
				//待删除是二级部门
				for(var i = 0; i < dept.subdept.length; i++){
					for(var j = 0; j < dept.subdept[i].subdept.length; j++){
						if(nodeid == dept.subdept[i].subdept[j].id){							
							dept.subdept[i].subdept.splice(j,1);
							temp = true;
							break;
						}
					}
				}
				
			}else if(4 == calNodeLen(nodeid)){
				//待删除是三级部门				
				for(var i = 0; i < dept.subdept.length; i++){
					for(var j = 0; j < dept.subdept[i].subdept.length; j++){
						for(var k = 0; k < dept.subdept[i].subdept[j].subdept.length; k++){
							if(nodeid == dept.subdept[i].subdept[j].subdept[k].id){
								
								dept.subdept[i].subdept[j].subdept.splice(k,1);
								temp = true;
								break;
								
								console.log("kkk");
							}
						}
					}
				}			
			}else{
				return callback("failed");
			}
			
			if(true == temp){
				
				   getModel(id).findOneAndUpdate({'id':1},
						   {"subdept":dept.subdept},
						   function(err){
						return callback(err);
				   });
				}else{
					return callback("failed");
			}	
		}		
	});
}

/*-
 * 更新指定部门信息，主要是文本
 * 具体方法类似delDeptNode
 * @id：企业租户ID
 * @node:待更新节点信息
 * @callback：回调函数
 */
exports.upDeptNode = function(id,node,callback){
	var temp 	= true;
	var nodeid 	= node.id;
	
	getModel(id).findOne({"id":1}, function(err,dept){
		
		if(err && null == dept){
			return callback("failed");
		}else{
			
			if(2 == calNodeLen(nodeid)){
				//待修改是一级部门
				for(var i = 0; i < dept.subdept.length; i++){
					if(nodeid == dept.subdept[i].id){						
						dept.subdept[i].text = node.text;						
						temp = true;
						break;
					}
				}
				
			}else if(3 == calNodeLen(nodeid)){
				//待修改是二级部门
				for(var i = 0; i < dept.subdept.length; i++){
					for(var j = 0; j < dept.subdept[i].subdept.length; j++){
						if(nodeid == dept.subdept[i].subdept[j].id){							
							dept.subdept[i].subdept[j].text = node.text;
							temp = true;
							break;
						}
					}
				}
				
			}else if(4 == calNodeLen(nodeid)){
				//待修改是三级部门				
				for(var i = 0; i < dept.subdept.length; i++){
					for(var j = 0; j < dept.subdept[i].subdept.length; j++){
						for(var k = 0; k < dept.subdept[i].subdept[j].subdept.length; k++){
							if(nodeid == dept.subdept[i].subdept[j].subdept[k].id){
								
								dept.subdept[i].subdept[j].subdept[k].text = node.text;
								temp = true;
								break;
							}
						}
					}
				}			
			}else{
				return callback("failed");
			}
			
			if(true == temp){			
				   getModel(id).findOneAndUpdate({'id':1},
						   {"subdept":dept.subdept},
						   function(err){
						return callback(err);
				   });
				}else{
					return callback("failed");
			}			
		
		}
	});	
}


