/**
 * 网关配置
 * DataTables warning: table id=table-user - Requested unknown parameter 'gwSign' for row 0. For more information about this error, please see http://datatables.net/tn/4
 */
var _table ;
$(function (){
	var $table = $('#table-user');
	_table = $table.dataTable($.extend(true,{},CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
		ajax : function(data, callback, settings) {//ajax配置为function,手动调用异步查询
			var param = userManage.getQueryCondition(data);
			$.ajax({
		            type: "POST",
		            url: path + '/querydevice',
		            cache : false,	//禁用缓存
		            data: param,	//传入已封装的参数
		            dataType: "json",
		            success: function(result) {
		            	setTimeout(function(){
		            		if (result.errorCode) {
		            			$.dialog.tips("查询失败。错误码："+result.errorCode);
		            			return;
							}
		            		var returnData = {};
			            	returnData.draw = data.draw;
			            	returnData.recordsTotal = result.total;
			            	returnData.recordsFiltered = result.total;
			            	returnData.data = result.pageData;
			            	callback(returnData);
		            	},200);
		            },
		            error: function(XMLHttpRequest, textStatus, errorThrown) {
		                $.dialog.tips("查询失败");
		            }
		        });
		},
        columns: [
            {	data: "devicetypename",	width : "80px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
            {	data : "roomname",	width : "80px",className : "ellipsis", render :  CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			/*{	data : "spNumber",	width : "80px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "host",	width : "120px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "port",	width : "80px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "listenPort", width : "120px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "serviceId",	width : "80px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "msgSrc",	width : "120px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "clientId",	width : "80px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "secret",	width : "80px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "feeType",	width : "80px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "feeValue",	width : "80px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "version",	width : "80px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "socketCount",	width : "80px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "fluxCount",	width : "130px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
			{	data : "sgipSrcNoteId",	width : "150px",className : "ellipsis",render : CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},*/
            {	data : "devicename",width :"80px",className : "ellipsis", render :  CONSTANT.DATA_TABLES.RENDER.ELLIPSIS},
            {	data: "deviceconfigure",width :"80px",className : "ellipsis", render :  CONSTANT.DATA_TABLES.RENDER.ELLIPSI},
            {	data: "devicenumber",width :"80px",className : "ellipsis", render :  CONSTANT.DATA_TABLES.RENDER.ELLIPSI},
            {	data: "localip",width :"80px",className : "ellipsis", render :  CONSTANT.DATA_TABLES.RENDER.ELLIPSI},
            {	data: "extranet",width :"80px",className : "ellipsis", render :  CONSTANT.DATA_TABLES.RENDER.ELLIPSI},
			{	className : "td-operation",	data: "",defaultContent:"",	orderable : false,	width : "280px"}
        ],
//        "createdRow": function ( row, data, dataIndex ) {
//        	var $btnOper;
//        	if(data.state == 1){
//        		$btnOper = $('<button type="button" class="btn btn-sm btn-danger btn-oper">停止</button>');
//        	}else 
//        		$btnOper = $('<button type="button" class="btn btn-success btn-oper">启动</button>');
//        	var $btnEdit = $('<button type="button" class="btn btn-success btn-edit">修改</button>');
//        	var $span = $('<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>');
//        		
//            $('td', row).eq(5).append($btnOper).append($span).append($btnEdit);
//        }
	})).api();
	
//	$('#btn_add').click(function(){
//		$("#addmoal").modal("toggle");
//	    $("#add_form").data('bootstrapValidator').resetForm(true);
//		$('.modal-title').text('新增网关');
//		$('#operType').val(0);
//	});
//	
//	$("#btn-simple-search").click(function(){
//		_table.draw();
//	});
//	//行点击事件
//	$table.on("click",".btn-edit",function() {
//        var item = _table.row($(this).closest('tr')).data();
//		userManage.editItemInit(item);
//	}).on("click",".btn-oper",function(){
//		var item = _table.row($(this).closest('tr')).data();
//		userManage.operInit(item);
//	});
//	$('#btn_add_reset').click(function (){
//		$('#add_form').data('bootstrapValidator').resetForm(true);
//		$("#addmoal").modal("hide");
//	});
//	
//	$('#btn_add_save').click(function(){
//		$('#add_form').bootstrapValidator('validate');
//		flag = $('#add_form').data('bootstrapValidator').isValid();
//		if(flag){
//			var operType = $('#operType').val();
//			if (operType == 0) {//add
//				userManage.saveGw();
//			}else {
//				userManage.editGw();
//			}
//		}
//	});
});

var userManage = {
	getQueryCondition : function(data) {
		var param = {};
//		param.isp = $("#search_isp").select2().val() == null ? null : $("#search_isp").select2().val().toString();
		param.startIndex = data.start;
		param.pageSize = data.length;
		param.draw = data.draw;
		return param;
	},
	editItemInit : function (item){
		if (!item) {
			return;
		}
		$("#addmoal").modal("toggle");
	    $("#add_form").data('bootstrapValidator').resetForm(true);
		$('#operType').val(1);
		$('#gwKind').val(item.gwKind);
		$('.modal-title').text('修改网关');
		$("#isp").select2().val(item.isp).trigger("change");
		$('#clientId').val(item.clientId);
		$('#name').val(item.name);
		$('#spNumber').val(item.spNumber);
		$('#port').val(item.port);
		$('#host').val(item.host);
		$('#serviceId').val(item.serviceId);
		$('#msgSrc').val(item.msgSrc);
		$('#feeType').val(item.feeType);
		$('#secret').val(item.secret);
		$('#feeValue').val(item.feeValue);
		$('#version').val(item.version);
		$('#fluxCount').val(item.fluxCount);
		$('#socketCount').val(item.socketCount);
		$('#sgipSrcNoteId').val(item.sgipSrcNoteId);
		$('#listenPort').val(item.listenPort);
		$("#gwSign").select2().val(item.signId).trigger("change");
		$("#bforeName").val(item.name);
		$("#bforeLongCode").val(item.spNumber);
		$("#companyId").select2().val(item.companyId).trigger("change");
	},
//	operInit : function(item) {
//		if (!item) {
//			return;
//		}
//		var status = item.state == 1 ? 0 : 1;
//		var state_memo = status == 1 ? "启动" : "停止";
//		var gwkind = item.gwKind;
//		$.ajax({
//            type : "POST",
//            url : path+'/getAuthorityKey',
//            data : {
//            	account : author,
//            	password : authorPwd
//            },
//            cache : false,
//            success: function(data){
//            	$.dialog.confirm("确定"+state_memo+"该网关吗？", function(){
//            		$.ajax({
//        				type: "POST",
//        				url: path+'/stopGw',
//        				data : {
//        					fun_id : funid,
//        					oper : isMod1,
//        					key : data,
//        					gwkind : gwkind,
//        					status : status
//        				},
//        				cache: false,
//        				dataType : "json",
//        				async: false,
//        				success: function(data){
//        					$.dialog.tips('网关'+state_memo+'成功！');
//        					if(data == 1) _table.draw();
//        				}
//        			}); 
//            	});
//            }
//		});
//	},
//	saveGw : function (){
//		var isp = $('#isp').select2().val();
//		var clientId = $('#clientId').val();
//		var name = $('#name').val();
//		var spNumber = $('#spNumber').val();
//		var port = $('#port').val();
//		var host = $('#host').val();
//		var serviceId = $('#serviceId').val();
//		var msgSrc = $('#msgSrc').val();
//		var feeType = $('#feeType').val();
//		var secret = $('#secret').val();
//		var feeValue = $('#feeValue').val();
//		var version = $('#version').val();
//		var fluxCount = $('#fluxCount').val();
//		var socketCount = $('#socketCount').val();
//		var sgipSrcNoteId = $('#sgipSrcNoteId').val();
//		var listenPort = $('#listenPort').val();
//		var companyId=$("#companyId").val();
//		var gwSign=$("#gwSign").val();
//		var bforeName=$("#bforeName").val();
//		var bforeLongCode=$("#bforeLongCode").val();
//		$.ajax({
//            type : "POST",
//            url : path+'/getAuthorityKey',
//            cache : false,
//            data : {
//            	account : author,
//            	password : authorPwd
//            },
//            success: function(data){
//            	$.ajax({
//					type: "POST",
//					url: path + "/addGw",
//					data : {
//						fun_id : funid,
//						oper : isAdd1,
//						key : data,
//						isp : isp,
//						spNumber : spNumber,
//						host : host,
//						port : port,
//						listenPort : listenPort,
//						serviceId : serviceId,
//						msgSrc : msgSrc,
//						clientId : clientId,
//						secret : secret,
//						feeType : feeType,
//						feeValue : feeValue,
//						version : version,
//						socketCount : socketCount,
//						fluxCount : fluxCount,
//						sgipSrcNoteId : sgipSrcNoteId,
//						name : name,
//						companyId:companyId,
//						gwSign:gwSign,
//						bforeName:bforeName,
//						bforeLongCode:bforeLongCode
//					},
//					cache: false,
//					success: function(data){
//						$('#add_form').data('bootstrapValidator').resetForm(true);
//						$("#addmoal").modal("hide");
//						if (data > 0) {
//							_table.draw();
//            				$.dialog.tips('添加成功,5分钟后生效!');
//						} else if(data == -1){
//							$.dialog.tips("网关名称重复");
//						}else{
//							$.dialog.tips("添加失败");
//						}
//					}
//            	}); 
//            }
//		});
//	},
//	editGw : function (){
//		var isp = $('#isp').select2().val();
//		var clientId = $('#clientId').val();
//		var name = $('#name').val();
//		var spNumber = $('#spNumber').val();
//		var port = $('#port').val();
//		var host = $('#host').val();
//		var serviceId = $('#serviceId').val();
//		var msgSrc = $('#msgSrc').val();
//		var feeType = $('#feeType').val();
//		var secret = $('#secret').val();
//		var feeValue = $('#feeValue').val();
//		var version = $('#version').val();
//		var fluxCount = $('#fluxCount').val();
//		var socketCount = $('#socketCount').val();
//		var sgipSrcNoteId = $('#sgipSrcNoteId').val();
//		var listenPort = $('#listenPort').val();
//		var gwKind = $('#gwKind').val();
//		var companyId=$("#companyId").val();
//		var gwSign=$("#gwSign").val();
//		var bforeName=$("#bforeName").val();
//		var bforeLongCode=$("#bforeLongCode").val();
//		$.ajax({
//            type : "POST",
//            url : ''+path+'/getAuthorityKey?account='+author+'&password='+authorPwd,
//            cache : false,
//            success: function(data){
//            	$.ajax({
//					type: "POST",
//					url: path + "/editGw",
//					data : {
//						fun_id : funid,
//						oper : isMod1,
//						key : data,
//						isp : isp,
//						spNumber : spNumber,
//						host : host,
//						port : port,
//						listenPort : listenPort,
//						serviceId : serviceId,
//						msgSrc : msgSrc,
//						clientId : clientId,
//						secret : secret,
//						feeType : feeType,
//						feeValue : feeValue,
//						version : version,
//						socketCount : socketCount,
//						fluxCount : fluxCount,
//						sgipSrcNoteId : sgipSrcNoteId,
//						gwKind : gwKind,
//						name : name,
//						companyId:companyId,
//						gwSign:gwSign,
//						bforeName:bforeName,
//						bforeLongCode:bforeLongCode
//					},
//					cache: false,
//					success: function(data){
//						$("#addmoal").modal("hide");
//						if (data > 0) {
//							_table.draw();
//							$.dialog.tips('修改成功,5分钟后生效!');
//						} else if(data == -1){
//							$.dialog.tips("网关名称重复,修改失败！");
//						}else{
//							$.dialog.tips('修改失败');
//						}
//					}
//            	}); 
//            }
//		});
//	},
//	formatter_isp : function(data,type, row, meta){
//		if(data == 0) return "移动";
//		else if(data == 1) return "联通";
//		else if(data == 4) return "电信";
//		else if(data == 9) return "国都";
//		else if(data == 10) return "区域";
//		else if(data == 11) return "核心";
//	},
//	formatter_state : function(data,type, row, meta){
//		if(data == 1) return "<font color='green'>运行</font>";
//		else return "<font color='red'>停用</font>";
//	}
};