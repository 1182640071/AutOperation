/*//新增
var isAdd = false;
//删除
var isDel = false;
//修改
var isMod = false;
//授权
var isAuthor = false;
//审核
var isThro = false;
//驳回
var isRes = false;
//短信发送
var isSend = false;
//短信补发
var repSend = false;
//禁用
var disAb = false;
//启用
var enAb = false;
//密码重置
var initPwd = false;
//审核工单
var autOrder = false;
//结算工单
var endOrder = false;
//角色查看
var isSeach = false;
//充值
var recharge = false;

var oper_ids = '';

var value = '';

var errMsg = '对不起，您无权进行此项操作！';

function initRoles(fun_id,oper){
	
	var oper_ids = oper[fun_id];
	
	for(var i =0;i<oper_ids.length;i++){ 
		
		value = oper_ids[i];
		                 
		if(value=='1000000002'){//新增
			isAdd = true;
		}
		if(value=='1000000003'){//删除
			isDel = true;
		}
		if(value=='1000000004'){//修改
			isMod = true;
		}
		if(value=='1000000005'){//审核
			isThro = true;
		}
		if(value=='1000000006'){//驳回
			isRes = true;
		}
		if(value=='1000000007'){//短信发送
			isSend = true;
		}
		if(value=='1000000008'){//禁用
			disAb = true;
		}
		if(value=='1000000009'){//启用
			enAb = true;
		}
		if(value=='1000000010'){//密码重置
			initPwd = true;
		}
		if(value=='1000000011'){//审核工单
			autOrder = true;
		}
		if(value=='1000000012'){//办结工单
			endOrder = true;
		}
		if(value=='1000000013'){//短信补发
			repSend = true;
		}
		if(value=='1000000014'){//授权
			isAuthor = true;
		}
		if(value=='1000000015'){//角色查看
			isSeach = true;
		}
		if(value=='1000000016'){//充值
			recharge = true;
		}
	}
}
function checkRole(role){
	if (!role) {
		$.messager.alert("提示",
				"<center>"+errMsg+"</center>",
				"error");
		return false;
	}
	return true;
}*/

//////////过拦截器用
//新增
var isAdd1 = 1000000002;
//删除
var isDel1 = 1000000003;
//修改
var isMod1 = 1000000004;
//授权
var isAuthor1 = 1000000014;
//审核
var isThro1 = 1000000005;
//驳回
var isRes1 = 1000000006;
//短信发送
var isSend1 = 1000000007;
//短信补发
var repSend1 = 1000000013;
//禁用
var disAb1 = 1000000008;
//启用
var enAb1 = 1000000009;
//密码重置
var initPwd1 = 1000000010;
//审核工单
var autOrder1 = 1000000011;
//结算工单
var endOrder1 = 1000000012;
var recharge1 = 1000000016;


