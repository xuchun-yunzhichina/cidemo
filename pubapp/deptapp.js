/*! 
 * 棉花糖 企业用户部门管理
 * @author Fredric 
 * @date 2014-10-14
 */

var deptdao = require("../pubdao/dept");

//获取部门信息
/*-
 * 主要是与easyui对接JSON数据格式，如下：
 * var dept = [{
		"id":1,
		"text":"部门列表",
		"children":[
		     {"text":"部门A",
		      "children":[
		           {"text":"子部门A1"},
		           {"text":"子部门A2"},
		                  ]},
		     {"text":"部门B",
		      "children":[
		           {"text":"子部门B1"},
		           {"text":"子部门B2"},
		      ]}]
	}];
 */
exports.getDeptInfo = function(ID,callback){
	
	deptdao.getDeptInfo(ID,function(err,depts){
		if(err || null == depts){
			return callback(err);
		}else{
			//构造节点树JSON格式
			
			var tree = new Array();
			var node = {};
			node.id   = depts.id;
			node.text = depts.text;
			
			//一级目录
			if(0 != depts.subdept.length){
				node.children = new Array();
				
				
				
				for(var i = 0; i < depts.subdept.length; i++){
					var node1 = {};
					node1.id   = depts.subdept[i].id;
					node1.text = depts.subdept[i].text;
					
					//二级目录
					if(0 != depts.subdept[i].subdept.length){
						
						node1.children = new Array();
												
						for(var j = 0; j < depts.subdept[i].subdept.length; j++){
							var node2 = {};
							node2.id   = depts.subdept[i].subdept[j].id;
							node2.text = depts.subdept[i].subdept[j].text;
							
							//三级目录
							if(0 != depts.subdept[i].subdept[j].subdept.length){
								node2.children = new Array();
								
								
								
								for(var k = 0; k < depts.subdept[i].subdept[j].subdept.length; k++){
									var node3 = {};
									node3.id
										= depts.subdept[i].subdept[j].subdept[k].id;
									node3.text
										= depts.subdept[i].subdept[j].subdept[k].text;
									
									node2.children.push(node3);
								}															
							}
							
							node1.children.push(node2);
							
						}//二级目录						
					}	
					
					node.children.push(node1);					
				}//一级目录
			}
			
			tree.push(node);
			
			return callback(err,tree);
			
		}//}else{
	});
}

//增加一个部门节点
exports.addDeptNode = function(req,callback){	
	var enterid  = req.session.enterid;
	var parentid = req.param("id");
	var deptname = req.param("deptname");
	
	deptdao.addDeptNode(enterid, parentid, deptname, function(err){
		 return callback(err);
	});	
}

//删除一个部门节点
exports.delDeptNode = function(req,callback){
	var enterid  = req.session.enterid;
	var nodeid   = req.param("id");
	
	deptdao.delDeptNode(enterid,nodeid,function(err){
		return callback(err);
	});
}

//编辑一个部门节点
exports.upDeptNode = function(req,callback){

	var enterid= req.session.enterid;
	
	var node   = {};
	node.id    = req.param(("nodeid"));
	node.text  = req.param("text");
	
	deptdao.upDeptNode(enterid, node, function(err){
		return callback(err);			
	});
}