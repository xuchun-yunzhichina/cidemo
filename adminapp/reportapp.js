/*! 
 * 报表业务操作
 * @author Fredric 
 * @date 2014-10-24
 */
var tenantdao = require("../admindao/tenant");

/*-
 * 统计不同员工数量的企业分布
 */
exports.getAdminReport1 = function(callback){
	var data = "<graph caption='企业规模统计' xAxisName='' yAxisName='' showNames='1' decimalPrecision='0' formatNumberScale='0' baseFontSize='14'>";
	
	var data1 = 0; //10人以下规模企业
	var data2 = 0; //10~50人规模企业
	var data3 = 0; //50~100人规模企业
	var data4 = 0; //100~200人规模企业
	var data5 = 0; //200人以上规模企业
		
	tenantdao.findTenant({},function(err,tenants){
		if(err){
			return callback(err,null);
		}else{
			
			//企业数量统计
			for(var i = 0; i < tenants.length; i++){
				var len = tenants[i].user.length;
				if(len > 200){
					data5++;
				}else if(len > 100){
					data4++;
				}else if(len > 50){
					data3++;
				}else if(len > 10){
					data2++;
				}else{
					data1++;
				}
			}
			
			data += "<set name='10人以下' value='" 	+ data1 + 	"'/>";
			data += "<set name='10~50人' value='" 	+ data2 + 	"'/>";
			data += "<set name='50~100人' value='" 	+ data3 + 	"'/>";
			data += "<set name='100~200人' value='" 	+ data4 + 	"'/>";
			data += "<set name='200人以上' value='" 	+ data5 + 	"'/>";
			data += "</graph>";
			
			return callback(null,data);
		}
	});	
		
	
}