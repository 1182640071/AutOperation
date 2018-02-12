/**
 * 机构tree
 */
var setting = {
		callback: {
			onClick: zTreeOnClick
		},
		view: {
			showLine: false
		},
		data: {
			simpleData: {
				enable: true
			}
		}
	};
function zTreeOnClick(event, treeId, treeNode) {
    $("#qqorganText").val(treeNode.name);
    $("#qqorgan").val(treeNode.id);
	$("#qqorganDiv").hide();
};
var zNodes;
$(document).ready(function(){
	$.post(path+"/conditionByOrgan",{},function(json){
		zNodes =json;
		$.fn.zTree.init($("#qqorganDiv"), setting, zNodes);
	});
	$("#qqorganText").click(function(event){
		event.stopPropagation(); 
		if($("#qqorganDiv").is(":visible")){
			$("#qqorganDiv").hide();
		}else{
			$("#qqorganDiv").show();
		}
	});
	$("#qqorganText").change(function(){
		if($(this).val()==''){
			 $("#qqorgan").val('');
		}
	});
});