/*! 
 * 棉花糖 角色dao封装
 * @author Fredric 
 * @date 2014-10-17
 */


var db = require('../util/dbmanager');
var set = require('../util/hashmap');
var mongoose = db.mhtdb().mongoose;
var Schema   = db.mhtdb().Schema;

var enterActor = new Schema({
	actorname:   {
        type: String
    },
    note:		{
    	type:	String
    },
    menu:		[{
    	id:		{type:String},
    	text:   {type:String}//该角色所具备的角色项，版本1主要是菜单
    }]
});

var modelmap = new set.hashmap();

function getModel(ID){
	if(null != modelmap.get(ID)){
		return modelmap.get(ID);
	}else{
		var enterActorModel = db.getEnterDb(ID).model('actorModel',enterActor,'actor');
		modelmap.put(ID,enterActorModel);
		return enterActorModel;
	}	
}


/*-
 * 增加一个角色，该角色对特定菜单栏具备权限
 */
exports.addActor = function(ID, actor ,callback){
	
	var entity = new getModel(ID)({
		actorname:actor.actorname,	
		note:actor.note,
		menu:actor.menu,
	});
		
	entity.save(function(err){
		return callback(err);
	});		
}

/*-
 * 获取全部角色信息
 */
exports.getActor = function(ID,callback){
	getModel(ID).find({},function(err,actors){
		return callback(err,actors);
	});
}

/*-
 * 删除角色
 */
exports.delActor = function(ID,actorname,callback){
	getModel(ID).findOne({"actorname":actorname},function(err,actor){
		if(err || null === actor){
			return callback(err);
		}else{
			actor.remove(function(err){
				return callback(err);
			});
		}
	});
}

/*-
 * 通过actor名称获取actor
 */
exports.getActorByName = function(ID,name,callback){
	getModel(ID).findOne({'actorname':name},function(err,actor){
		return callback(err,actor);
	});	
}





