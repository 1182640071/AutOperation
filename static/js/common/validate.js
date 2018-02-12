/**
 * 搜索条件验证 手机号码
 */
var reg = /(^s*)|(s*$)/g;
function isMobile(str){
	var regexp = /^[1]\d{10}$/;
	if(str.replace(reg, "").length > 0 && str.match(regexp) == null){
		$.dialog.tips('输入手机号码不合法');
		return false;
	}else {
		return true;
	}
}
/**
 * 输入数字
 * @param str
 * @returns {Boolean}
 */
function isNumber (str){
	var regexp = /^\d*$/;
	if(str.replace(reg, "").length > 0 && str.match(regexp) == null){
		$.dialog.tips('输入数字不合法');
		return false;
	}else {
		return true;
	}
}

function dateRepare (startDate, endDate){
	
}

