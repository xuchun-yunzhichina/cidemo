/*! 
 * JSON解析接口封装
 * @author Fredric 
 * @date 2014-10-4
 */

//json转化成obj对象
exports.evalJSON = function(json,callback){
	obj = eval(json);
	return callback(obj);
	
}

//obj对象转换成json
exports.parseJSON = function(obj,json){
	json = obj.parseJSON();
}