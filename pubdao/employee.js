/*! 
 * 棉花糖 员工信息管理
 * @author Fredric 
 * @date 2014-10-14
 */
var db = require('../util/dbmanager');
var set = require('../util/hashmap');
var mongoose = db.mhtdb().mongoose;
var Schema   = db.mhtdb().Schema;

var Employee = new Schema({
	name:	{     //姓名
        type: String
    },
	age:   {      //年龄
        type: Number
    },
	sex:   {      //性别
        type: String
    }, 
	phone:   [{ //联系方式（多个）
		number: {type: String}, //电话号码
    }],
	email:   {  //邮箱
        type: String
    },
	depart:   [{ //部门（多个）
        id:  {type:String},
        text:{type:String}
    }],
	note:   { //备注消息
        type: String
    }
	
});

var modelmap = new set.hashmap();

function getModel(ID){
	if(null != modelmap.get(ID)){
		return modelmap.get(ID);
	}else{
		var enterModel = db.getEnterDb(ID).model('enterModel',Employee,'employee');
		modelmap.put(ID,enterModel);
		return enterModel;
	}	
}

/*-
 * 获取员工信息
 * 
 */
exports.getEmployee = function(ID,option,callback){
	getModel(ID).find(option,function(err,employees){
		return callback(err,employees);
	});
}



/*-
 * 增加一个员工
 * @id:企业id
 * @employee:员工信息
 * @callback:回调函数
 */
exports.addEmployee = function(id,employee,callback){
	
	var Entity  = new getModel(id)({
		name:employee.name,
		age :employee.age,
		sex :employee.sex,
		phone :employee.phone,
		email :employee.email,
		depart:employee.dept,
		note  :employee.note	
	});
	
	Entity.save(function(err){
		return callback(err);
	});
}

/*-
 * 根据员工索引ID一个员工
 * @id:企业id
 * @employeeid:员工ID
 * @callback:回调函数
 */
exports.delEmployee = function(id,employeeid,callback){
	getModel(ID).findOne({'id':employeeid},function(err, employee){		
		if(err || null === employee){
			return callback(err);
		}else{
			tenant.remove(function(err){
				return callback(err);
			});
		}
	});
}


/*-
 * 更新员工信息
 * @id:企业id
 * @employee:员工信息
 * @callback:回调函数
 * 
 * 备注：员工索引属于系统设置，不允许修改
 */
exports.upEmployee = function(id,employee,callback){
	
	getModel(ID).findOneAndUpdate({'id':employee.id},employee,function(err){
		return callback(err);
	});
}


/*-
 * 生成员工唯一索引ID
 * 采用uid + 员工姓名 + 时间戳 + 随机数 生成
 */
function createIndex(name){
	
	var index = 0;
	index = "uid" + name + (new Date()).getTime()+parseInt(Math.random()*100000);
	return index; 
}




