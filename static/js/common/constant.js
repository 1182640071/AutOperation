/*常量*/
var CONSTANT = {
		DATA_TABLES : {
			DEFAULT_OPTION : { //DataTables初始化选项
				language: {
					"sProcessing":   "处理中...",
					"sLengthMenu":   "每页 _MENU_ 项",
					"sZeroRecords":  "没有匹配结果",
					"sInfo":         "<span style='padding-left:10px;padding-top:10px;'>共_MAX_项</span><span style='margin-left:20px;'>第 _PAGE_ 页 / 共 _PAGES_ 页</span>",
					"sInfoEmpty":    "<span style='padding-left:10px;padding-top:10px;'>共0项</span><span style='margin-left:20px;'>第 0 页 / 共 0 页</span>",
					"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
					"sInfoPostFix":  "",
					"sSearch":       "搜索:",
					"sUrl":          "",
					"sEmptyTable":     "表中数据为空",
					"sLoadingRecords": "载入中...",
					"sInfoThousands":  ",",
					"oPaginate": {
						"sFirst":    "首页",
						"sPrevious": "&lt",
						"sNext":     "&gt",
						"sLast":     "末页",
						"sJump":     "GO"
					},
					"oAria": {
						"sSortAscending":  ": 以升序排列此列",
						"sSortDescending": ": 以降序排列此列"
					}
				},
                autoWidth: false,	//禁用自动调整列宽
                stripeClasses: ["odd", "even"],//为奇偶行加上样式，兼容不支持CSS伪类的场合
                order: [],			//取消默认排序查询,否则复选框一列会出现小箭头
                processing: false,	//隐藏加载提示,自行处理
                serverSide: true,	//启用服务器端分页
                searching: false,	//禁用原生搜索
                // datatables的控件布局 edit by yuanwei
                dom: "f<'row'<'col-md-12't>><'row'<'col-md-12'<'dt-p'p><'dt-i'i><'dt-lc'l>>>",
                pagingType: "simple",
                // datatables横向、竖向滚动条 edit by yuanwei
                scrollX : true,
        		scrollY: "500px",
        		scrollCollapse: true
			},
			MODAL_OPTION : { //DataTables个性化配置
				language: {
					"sProcessing":   "处理中...",
					"sLengthMenu":   "每页 _MENU_ 项",
					"sZeroRecords":  "没有匹配结果",
					"sInfo":         "<span style='padding-left:10px;padding-top:10px;'>共_MAX_项</span><span style='margin-left:20px;'>第 _PAGE_ 页 / 共 _PAGES_ 页</span>",
					"sInfoEmpty":    "<span style='padding-left:10px;padding-top:10px;'>共0项</span><span style='margin-left:20px;'>第 0 页 / 共 0 页</span>",
					"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
					"sInfoPostFix":  "",
					"sSearch":       "搜索:",
					"sUrl":          "",
					"sEmptyTable":     "表中数据为空",
					"sLoadingRecords": "载入中...",
					"sInfoThousands":  ",",
					"oPaginate": {
						"sFirst":    "首页",
						"sPrevious": "&lt",
						"sNext":     "&gt",
						"sLast":     "末页",
						"sJump":     "GO"
					},
					"oAria": {
						"sSortAscending":  ": 以升序排列此列",
						"sSortDescending": ": 以降序排列此列"
					}
				},
                autoWidth: false,	//禁用自动调整列宽
                stripeClasses: ["odd", "even"],//为奇偶行加上样式，兼容不支持CSS伪类的场合
                order: [],			//取消默认排序查询,否则复选框一列会出现小箭头
                processing: false,	//隐藏加载提示,自行处理
                serverSide: true,	//启用服务器端分页
                searching: false,	//禁用原生搜索
                lengthChange: false,
                // datatables的控件布局 edit by yuanwei
                dom: "f<'row'<'col-md-12't>><'row'<'col-md-12'<l><'dt-p_modal'p><'dt-i_modal'i>>>",
                pagingType: "simple",
                // datatables横向、竖向滚动条 edit by yuanwei
                scrollX : true,
        		scrollY: "500px",
        		scrollCollapse: true
			},	
			SEND_OPTION : { //fastSend个性化配置
				language: {
					"sProcessing":   "处理中...",
					"sLengthMenu":   "每页 _MENU_ 项",
					"sZeroRecords":  "没有匹配结果",
					"sInfo":         "<span style='padding-left:10px;padding-top:10px;'>共_MAX_项</span><span style='margin-left:20px;'>第 _PAGE_ 页 / 共 _PAGES_ 页</span>",
					"sInfoEmpty":    "<span style='padding-left:10px;padding-top:10px;'>共0项</span><span style='margin-left:20px;'>第 0 页 / 共 0 页</span>",
					"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
					"sInfoPostFix":  "",
					"sSearch":       "搜索:",
					"sUrl":          "",
					"sEmptyTable":     "表中数据为空",
					"sLoadingRecords": "载入中...",
					"sInfoThousands":  ",",
					"oPaginate": {
						"sFirst":    "首页",
						"sPrevious": "&lt",
						"sNext":     "&gt",
						"sLast":     "末页",
						"sJump":     "GO"
					},
					"oAria": {
						"sSortAscending":  ": 以升序排列此列",
						"sSortDescending": ": 以降序排列此列"
					}
				},
                autoWidth: false,	//禁用自动调整列宽
                stripeClasses: ["odd", "even"],//为奇偶行加上样式，兼容不支持CSS伪类的场合
                order: [],			//取消默认排序查询,否则复选框一列会出现小箭头
                processing: false,	//隐藏加载提示,自行处理
                serverSide: true,	//启用服务器端分页
                searching: false,	//禁用原生搜索
                lengthChange: false,
                // datatables的控件布局 edit by yuanwei
                dom: "f<'row'<'col-md-12't>><'row'<'col-md-12'<l><'dt-p_modal'p><'dt-i_modal'i>>>",
                pagingType: "simple",
                // datatables横向、竖向滚动条 edit by yuanwei
                scrollX : true
			},
			COLUMN: {
                CHECKBOX: {	//复选框单元格
                    className: "td-checkbox",
                    orderable: false,
                    width: "30px",
                    data: null,
                    render: function (data, type, row, meta) {
                        return '<input type="checkbox" class="iCheck">';
                    }
                }
            },
            RENDER: {	//常用render可以抽取出来，如日期时间、头像等
                ELLIPSIS: function (data, type, row, meta) {
                	data = data||"";
                	return '<span title="' + data + '">' + data + '</span>';
                }
            }
		}
};