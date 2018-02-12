/*! DataTables Bootstrap 2 integration
 * ©2011-2014 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 2. This requires Bootstrap 2 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function(window, document, $, DataTable, undefined){

$.extend( true, DataTable.defaults, {
/*	"dom":
		"<'row-fluid'<'span6'l><'span6'f>r>" +
		"<'row-fluid'<'span12't>>" +
		"<'row-fluid'<'span6'i><'span6'p>>",*/
	"dom":
		"<'row'<'col-lg-12't>>" +
		"<'row'<'col-lg-2'l><'col-lg-3'i><'col-lg-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper: "dataTables_wrapper form-inline dt-bootstrap"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var btnDisplay, btnClass;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') ) {
				api.page( e.data.action ).draw( false );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( $.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&hellip;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'aria-controls': settings.sTableId,
							'tabindex': settings.iTabIndex,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#'
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);
				}
			}
		}
	};

	attach(
		$(host).empty().html('<div class="pagination"><ul/></div>').find('ul'),
		buttons
	);
	
	/*跳转到  文字*/
	var spanPageJump = $('<span>', {
		'style': 'margin-left:0px;font-size:13'
	}).html('跳转到');
	
	/*添加跳页功能*/
	var inputPageJump = $('<input>', {
		'type': "number",
		'style': 'margin-left:5px;width:45px;height:30px;border:1px solid #e5e5e5;padding-left:3px',
		'min': 1,
		'max': pages
	}).on("keyup",function(event){
		if (event.keyCode == 13) {
			var curr = this.value.replace(/\s|\D/g, '') | 0;
			if (curr) {
				var pages = api.page.info().pages;
				curr = curr > pages ? pages : curr;
				curr--;
				api.page(curr).draw(false);
			}
		}
	});
	var btnPageJump = $('<button />', {
		'class': "btn btn-sm",
		'style': "background-color:white;border:1px solid #e5e5e5;" +
				"margin-left:5px;margin-top:-3px;",
		'aria-controls': settings.sTableId,
		'tabindex': settings.iTabIndex
	}).html(lang.sJump).on("click",function(){
		var curr = inputPageJump.val().replace(/\s|\D/g, '') | 0;
		if (curr) {
			var pages = api.page.info().pages;
			curr = curr > pages ? pages : curr;
			curr--;
			api.page(curr).draw(false);
		}
	});

	$(host).prepend($('<div />', {
		'class' : "page_jump input-append"
	}).append(spanPageJump).append(inputPageJump).append(btnPageJump));
};


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */
if ( DataTable.TableTools ) {
	// Set the classes that TableTools uses to something suitable for Bootstrap
	$.extend( true, DataTable.TableTools.classes, {
		"container": "DTTT btn-group",
		"buttons": {
			"normal": "btn",
			"disabled": "disabled"
		},
		"collection": {
			"container": "DTTT_dropdown dropdown-menu",
			"buttons": {
				"normal": "",
				"disabled": "disabled"
			}
		},
		"print": {
			"info": "DTTT_print_info modal"
		},
		"select": {
			"row": "active"
		}
	} );

	// Have the collection use a bootstrap compatible dropdown
	$.extend( true, DataTable.TableTools.DEFAULTS.oTags, {
		"collection": {
			"container": "ul",
			"button": "li",
			"liner": "a"
		}
	} );
}


})(window, document, jQuery, jQuery.fn.dataTable);
