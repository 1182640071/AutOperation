var App = function() {
		var currentPage = '';
		var collapsed = false;
		var is_mobile = false;
		var is_mini_menu = false;
		var is_fixed_header = false;
		var responsiveFunctions = [];
		var runResponsiveFunctions = function() {
				for (var i in responsiveFunctions) {
					var each = responsiveFunctions[i];
					each.call();
				}
			}
		var getViewPort = function() {
				var e = window,
					a = 'inner';
				if (!('innerWidth' in window)) {
					a = 'client';
					e = document.documentElement || document.body
				}
				return {
					width: e[a + 'Width'],
					height: e[a + 'Height']
				}
			}
		var checkLayout = function() {
				is_mini_menu = $('#sidebar').hasClass('mini-menu');
				is_fixed_header = $('#header').hasClass('navbar-fixed-top');
			}
		var handleSidebarAndContentHeight = function() {
				var content = $('#content');
				var sidebar = $('#sidebar');
				var body = $('body');
				var height;
				if (body.hasClass('sidebar-fixed')) {
					height = $(window).height() - $('#header').height() + 1;
				} else {
					height = sidebar.height() + 20;
				}
				if (height >= content.height()) {
					content.attr('style', 'min-height:' + height + 'px !important')
				}
			}
		var handleSidebar = function() {
				jQuery('.sidebar-menu .has-sub > a').click(function() {
					var last = jQuery('.has-sub.open', $('.sidebar-menu'));
					last.removeClass("open");
					jQuery('.arrow', last).removeClass("open");
					jQuery('.sub', last).slideUp(200);
					var thisElement = $(this);
					var slideOffeset = -200;
					var slideSpeed = 200;
					var sub = jQuery(this).next();
					if (sub.is(":visible")) {
						jQuery('.arrow', jQuery(this)).removeClass("open");
						jQuery(this).parent().removeClass("open");
						sub.slideUp(slideSpeed, function() {
							if ($('#sidebar').hasClass('sidebar-fixed') == false) {
								App.scrollTo(thisElement, slideOffeset)
							}
							handleSidebarAndContentHeight();
						})
					} else {
						jQuery('.arrow', jQuery(this)).addClass("open");
						jQuery(this).parent().addClass("open");
						sub.slideDown(slideSpeed, function() {
							if ($('#sidebar').hasClass('sidebar-fixed') == false) {
								App.scrollTo(thisElement, slideOffeset)
							}
							handleSidebarAndContentHeight();
						})
					}
				});
				jQuery('.sidebar-menu .has-sub .sub .has-sub-sub > a').click(function() {
					var last = jQuery('.has-sub-sub.open', $('.sidebar-menu'));
					last.removeClass("open");
					jQuery('.arrow', last).removeClass("open");
					jQuery('.sub', last).slideUp(200);
					var sub = jQuery(this).next();
					if (sub.is(":visible")) {
						jQuery('.arrow', jQuery(this)).removeClass("open");
						jQuery(this).parent().removeClass("open");
						sub.slideUp(200);
					} else {
						jQuery('.arrow', jQuery(this)).addClass("open");
						jQuery(this).parent().addClass("open");
						sub.slideDown(200);
					}
				})
			}
		var collapseSidebar = function() {
				var iconElem = document.getElementById("sidebar-collapse").querySelector('[class*="fa-"]');
				var iconLeft = iconElem.getAttribute("data-icon1");
				var iconRight = iconElem.getAttribute("data-icon2");
				jQuery('.navbar-brand').addClass("mini-menu");
				jQuery('#sidebar').addClass("mini-menu");
				jQuery('#main-content').addClass("margin-left-50");
				jQuery('.sidebar-collapse i').removeClass(iconLeft);
				jQuery('.sidebar-collapse i').addClass(iconRight);
				jQuery('.search').attr('placeholder', '');
				collapsed = true;
				$.cookie('mini_sidebar', '1')
			}
		var responsiveSidebar = function() {
				var width = $(window).width();
				if (width < 768) {
					is_mobile = true;
					jQuery('#main-content').addClass("margin-left-0")
				} else {
					is_mobile = false;
					jQuery('#main-content').removeClass("margin-left-0");
					var menu = $('.sidebar');
					if (menu.parent('.slimScrollDiv').size() === 1) {
						menu.slimScroll({
							destroy: true
						});
						menu.removeAttr('style');
						$('#sidebar').removeAttr('style');
					}
				}
			}
		var handleSidebarCollapse = function() {
				var viewport = getViewPort();
				if ($.cookie('mini_sidebar') === '1') {
					jQuery('.navbar-brand').addClass("mini-menu");
					jQuery('#sidebar').addClass("mini-menu");
					jQuery('#main-content').addClass("margin-left-50");
					collapsed = true;
				}
				jQuery('.sidebar-collapse').click(function() {
					if (is_mobile && !(is_mini_menu)) {
						if (collapsed) {
							jQuery('body').removeClass("slidebar");
							jQuery('.sidebar').removeClass("sidebar-fixed");
							if (is_fixed_header) {
								jQuery('#header').addClass("navbar-fixed-top");
								jQuery('#main-content').addClass("margin-top-100");
							}
							collapsed = false;
							$.cookie('mini_sidebar', '0');
						} else {
							jQuery('body').addClass("slidebar");
							jQuery('.sidebar').addClass("sidebar-fixed");
							if (is_fixed_header) {
								jQuery('#header').removeClass("navbar-fixed-top");
								jQuery('#main-content').removeClass("margin-top-100")
							}
							collapsed = true;
							$.cookie('mini_sidebar', '1');
							handleMobileSidebar();
						}
					} else {
						var iconElem = document.getElementById("sidebar-collapse").querySelector('[class*="fa-"]');
						var iconLeft = iconElem.getAttribute("data-icon1");
						var iconRight = iconElem.getAttribute("data-icon2");
						if (collapsed) {
							jQuery('.navbar-brand').removeClass("mini-menu");
							jQuery('#sidebar').removeClass("mini-menu");
							jQuery('#main-content').removeClass("margin-left-50");
							jQuery('.sidebar-collapse i').removeClass(iconRight);
							jQuery('.sidebar-collapse i').addClass(iconLeft);
							jQuery('.search').attr('placeholder', "Search");
							collapsed = false;
							$.cookie('mini_sidebar', '0');
						} else {
							jQuery('.navbar-brand').addClass("mini-menu");
							jQuery('#sidebar').addClass("mini-menu");
							jQuery('#main-content').addClass("margin-left-50");
							jQuery('.sidebar-collapse i').removeClass(iconLeft);
							jQuery('.sidebar-collapse i').addClass(iconRight);
							jQuery('.search').attr('placeholder', '');
							collapsed = true;
							$.cookie('mini_sidebar', '1');
						}
						$("#main-content").on('resize', function(e) {
							e.stopPropagation();
						})
					}
				})
			}
		var handleMobileSidebar = function() {
				var menu = $('.sidebar');
				if (menu.parent('.slimScrollDiv').size() === 1) {
					menu.slimScroll({
						destroy: true
					});
					menu.removeAttr('style');
					$('#sidebar').removeAttr('style')
				}
				menu.slimScroll({
					size: '7px',
					color: '#a1b2bd',
					opacity: .3,
					height: "100%",
					allowPageScroll: false,
					disableFadeOut: false
				})
			}
		var handleFixedSidebar = function() {
				var menu = $('.sidebar-menu');
				if (menu.parent('.slimScrollDiv').size() === 1) {
					menu.slimScroll({
						destroy: true
					});
					menu.removeAttr('style');
					$('#sidebar').removeAttr('style')
				}
				if ($('.sidebar-fixed').size() === 0) {
					handleSidebarAndContentHeight();
					return
				}
				var viewport = getViewPort();
				if (viewport.width >= 992) {
					var sidebarHeight = $(window).height() - $('#header').height() + 1;
					menu.slimScroll({
						size: '7px',
						color: '#a1b2bd',
						opacity: .3,
						height: sidebarHeight,
						allowPageScroll: false,
						disableFadeOut: false
					});
					handleSidebarAndContentHeight()
				}
			}
		jQuery(window).resize(function() {
			setTimeout(function() {
				checkLayout();
				handleSidebarAndContentHeight();
				responsiveSidebar();
				handleFixedSidebar();
				handleNavbarFixedTop();
				runResponsiveFunctions()
			}, 50)
		});
		var handleDateTimePickers = function() {
				$('#reportrange').daterangepicker({
					startDate: moment().subtract('days', 29),
					endDate: moment(),
					minDate: '01/01/2012',
					maxDate: '12/31/2014',
					dateLimit: {
						days: 60
					},
					showDropdowns: true,
					showWeekNumbers: true,
					timePicker: false,
					timePickerIncrement: 1,
					timePicker12Hour: true,
					ranges: {
						'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
						'Last 30 Days': [moment().subtract('days', 29), moment()],
						'This Month': [moment().startOf('month'), moment().endOf('month')]
					},
					opens: 'left',
					buttonClasses: ['btn btn-default'],
					applyClass: 'btn-small btn-primary',
					cancelClass: 'btn-small',
					format: 'MM/DD/YYYY',
					separator: ' to ',
					locale: {
						applyLabel: 'Submit',
						fromLabel: 'From',
						toLabel: 'To',
						customRangeLabel: 'Custom Range',
						daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
						monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
						firstDay: 1
					}
				}, function(start, end) {
					console.log("Callback has been called!");
					$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
				});
				$('#reportrange span').html('Custom')
			}
		var handleTeamView = function() {
				c();
				$(".team-status-toggle").click(function(y) {
					y.preventDefault();
					w(this);
					$(this).parent().toggleClass("open");
					var z = x(this);
					$(z).slideToggle(200, function() {
						$(this).toggleClass("open")
					})
				});
				$("body").click(function(z) {
					var y = z.target.className.split(" ");
					if ($.inArray("team-status", y) == -1 && $.inArray("team-status-toggle", y) == -1 && $(z.target).parents().index($(".team-status")) == -1 && $(z.target).parents(".team-status-toggle").length == 0) {
						w()
					}
				});
				$(".team-status #teamslider").each(function() {
					$(this).slimScrollHorizontal({
						width: "100%",
						alwaysVisible: true,
						color: "#fff",
						opacity: "0.5",
						size: "5px"
					})
				});
				var w = function(y) {
						$(".team-status").each(function() {
							var z = $(this);
							if (z.is(":visible")) {
								var A = x(y);
								if (A != ("#" + z.attr("id"))) {
									$(this).slideUp(200, function() {
										$(this).toggleClass("open");
										$(".team-status-toggle").each(function() {
											var B = x(this);
											if (B == ("#" + z.attr("id"))) {
												$(this).parent().removeClass("open")
											}
										})
									})
								}
							}
						})
					};
				var x = function(y) {
						var z = $(y).data("teamStatus");
						if (typeof z == "undefined") {
							z = "#team-status"
						}
						return z
					}
			}
		var c = function() {
				$(".team-status").each(function() {
					var x = $(this);
					x.css("position", "absolute").css("margin-top", "-1000px").show();
					var w = 0;
					$("ul li", this).each(function() {
						w += $(this).outerWidth(true) + 15
					});
					x.css("position", "relative").css("margin-top", "0").hide();
					$("ul", this).width(w)
				})
			};
		var handleHomePageTooltips = function() {
				$('.tip').tooltip();
				$('.tip-bottom').tooltip({
					placement: 'bottom'
				});
				$('.tip-left').tooltip({
					placement: 'left'
				});
				$('.tip-right').tooltip({
					placement: 'right'
				});
				$('.tip-focus').tooltip({
					trigger: 'focus'
				})
			}
		var handleBoxTools = function() {
				jQuery('.box .tools .collapse, .box .tools .expand').click(function() {
					var el = jQuery(this).parents(".box").children(".box-body");
					if (jQuery(this).hasClass("collapse")) {
						jQuery(this).removeClass("collapse").addClass("expand");
						var i = jQuery(this).children(".fa-chevron-up");
						i.removeClass("fa-chevron-up").addClass("fa-chevron-down");
						el.slideUp(200)
					} else {
						jQuery(this).removeClass("expand").addClass("collapse");
						var i = jQuery(this).children(".fa-chevron-down");
						i.removeClass("fa-chevron-down").addClass("fa-chevron-up");
						el.slideDown(200)
					}
				});
				jQuery('.box .tools a.remove').click(function() {
					var removable = jQuery(this).parents(".box");
					if (removable.next().hasClass('box') || removable.prev().hasClass('box')) {
						jQuery(this).parents(".box").remove()
					} else {
						jQuery(this).parents(".box").parent().remove()
					}
				});
				jQuery('.box .tools a.reload').click(function() {
					var el = jQuery(this).parents(".box");
					App.blockUI(el);
					window.setTimeout(function() {
						App.unblockUI(el)
					}, 1000)
				})
			}
		var handleSlimScrolls = function() {
				if (!jQuery().slimScroll) {
					return
				}
				$('.scroller').each(function() {
					$(this).slimScroll({
						size: '7px',
						color: '#a1b2bd',
						height: $(this).attr("data-height"),
						alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
						railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
						railOpacity: 0.1,
						disableFadeOut: true
					})
				})
			}
		var handleBootbox = function() {
				$(".basic-alert").click(function() {
					bootbox.alert("Hello World")
				});
				$(".confirm-dialog").click(function() {
					bootbox.confirm("Are you sure?", function(result) {})
				});
				$(".multiple-buttons").click(function() {
					bootbox.dialog({
						message: "I am a custom dialog",
						title: "Custom title",
						buttons: {
							success: {
								label: "Success!",
								className: "btn-success",
								callback: function() {
									Example.show("great success")
								}
							},
							danger: {
								label: "Danger!",
								className: "btn-danger",
								callback: function() {
									Example.show("uh oh, look out!")
								}
							},
							main: {
								label: "Click ME!",
								className: "btn-primary",
								callback: function() {
									Example.show("Primary button")
								}
							}
						}
					})
				});
				$(".multiple-dialogs").click(function() {
					bootbox.alert("In 1 second a new modal will open");
					setTimeout(function() {
						bootbox.dialog({
							message: "Will you purchase this awesome theme",
							title: "Pop quiz",
							buttons: {
								success: {
									label: "Yes!",
									className: "btn-success",
									callback: function() {
										bootbox.alert("Congratulations! You made the right decision.", function() {
											$(".bootbox").modal("hide")
										})
									}
								},
								danger: {
									label: "No!",
									className: "btn-danger",
									callback: function() {
										bootbox.alert("Oops, we're sorry to hear that!", function() {
											$(".bootbox").modal("hide")
										})
									}
								},
								main: {
									label: "Click ME!",
									className: "btn-primary",
									callback: function() {
										bootbox.alert("Hello World", function() {
											$(".bootbox").modal("hide")
										})
									}
								}
							}
						})
					}, 1000)
				});
				$(".programmatic-close").click(function() {
					bootbox.alert("In 3 second this modal will close..");
					setTimeout(function() {
						$(".bootbox").modal("hide")
					}, 3000)
				})
			}
		var handlePopovers = function() {
				$('.pop').popover();
				$('.pop-bottom').popover({
					placement: 'bottom'
				});
				$('.pop-left').popover({
					placement: 'left'
				});
				$('.pop-top').popover({
					placement: 'top'
				});
				$('.pop-hover').popover({
					trigger: 'hover'
				})
			}
		var handleMessenger = function() {
				$("#normal").click(function() {
					var mytheme = $('input[name=theme]:checked').val();
					var mypos = $('input[name=position]:checked').val();
					Messenger.options = {
						extraClasses: 'messenger-fixed ' + mypos,
						theme: mytheme
					}
					Messenger().post({
						message: "This is a normal notification!",
						showCloseButton: true
					})
				});
				$("#interactive").click(function() {
					var mytheme = $('input[name=theme]:checked').val();
					var mypos = $('input[name=position]:checked').val();
					Messenger.options = {
						extraClasses: 'messenger-fixed ' + mypos,
						theme: mytheme
					}
					var msg;
					msg = Messenger().post({
						message: 'Launching thermonuclear war...',
						type: 'info',
						actions: {
							cancel: {
								label: 'cancel launch',
								action: function() {
									return msg.update({
										message: 'Thermonuclear war averted',
										type: 'success',
										showCloseButton: true,
										actions: false
									})
								}
							}
						}
					})
				});
				$("#timer").click(function() {
					var mytheme = $('input[name=theme]:checked').val();
					var mypos = $('input[name=position]:checked').val();
					Messenger.options = {
						extraClasses: 'messenger-fixed ' + mypos,
						theme: mytheme
					}
					var i;
					i = 0;
					Messenger().run({
						errorMessage: 'Error destroying alien planet',
						successMessage: 'Alien planet destroyed!',
						showCloseButton: true,
						action: function(opts) {
							if (++i < 3) {
								return opts.error({
									status: 500,
									readyState: 0,
									responseText: 0
								})
							} else {
								return opts.success()
							}
						}
					})
				});
				$("#prompts").click(function() {
					var mytheme = $('input[name=theme]:checked').val();
					var mypos = $('input[name=position]:checked').val();
					Messenger.options = {
						extraClasses: 'messenger-fixed ' + mypos,
						theme: mytheme
					}
					Messenger().run({
						successMessage: 'Data saved.',
						errorMessage: 'Error saving data',
						progressMessage: 'Saving data',
						showCloseButton: true
					}, {
						url: 'http://www.example.com/data'
					})
				})
			}
		var handleAlerts = function() {
				$(".alert").alert()
			}
		var handleMagicSuggest = function() {
				var jsonData = [];
				var cities = 'New York,Los Angeles,Chicago,Houston,Paris,Marseille,Toulouse,Lyon,Bordeaux,Philadelphia,Phoenix,San Antonio,San Diego,Dallas,San Jose,Jacksonville'.split(',');
				for (var i = 0; i < cities.length; i++) jsonData.push({
					id: i,
					name: cities[i],
					status: i % 2 ? 'Already Visited' : 'Planned for visit',
					coolness: Math.floor(Math.random() * 10) + 1
				});
				var ms1 = $('#ms1').magicSuggest({
					data: jsonData,
					sortOrder: 'name',
					value: [0],
					selectionPosition: 'right',
					groupBy: 'status',
					maxDropHeight: 200
				});
				var ms2 = $('#ms2').magicSuggest({
					width: '80%',
					data: jsonData
				});
				var ms3 = $('#ms3').magicSuggest({
					selectionPosition: 'bottom',
					renderer: function(city) {
						return '<div>' + '<div style="font-family: Arial; font-weight: bold">' + city.name + '</div>' + '<div><b>Cooooolness</b>: ' + city.coolness + '</div>' + '</div>'
					},
					minChars: 1,
					selectionStacked: true,
					data: jsonData
				});
				var ms4 = $('#ms4').magicSuggest({
					data: [{
						id: 1,
						label: 'one'
					}, {
						id: 2,
						label: 'two'
					}, {
						id: 3,
						label: 'three'
					}],
					displayField: 'label',
					value: [1, 3]
				});
				var ms5 = $('#ms5').magicSuggest({
					width: '80%',
					data: 'marilyn@monroe.com,mother@teresa.com,john@kennedy.com,martin@luther.com,nelson@mandela.com,winston@churchill.com,bill@gates.com,muhammad@ali.com,mahatma@gandhi.com,margaret@thatcher.com,charles@gaulle.com,christopher@colombus.com,george@orwell.com,charles@darwin.com,elvis@presley.com,albert@einstein.com,paul@mccartney.com,queen@elizabeth.com,queen@victoria.com,john@keynes.com,mikhail@gorbachev.com,jawaharlal@nehru.com,leonardo@vinci.com,louis@pasteur.com,leo@tolstoy.com,pablo@picasso.com,vincent@gogh.com,franklin@roosevelt.com,john@paul.com,neil@armstrong.com,thomas@edison.com,rosa@parks.com,aung@kyi.com,lyndon@johnson.com,ludwig@beethoven.com,oprah@winfrey.com,indira@gandhi.com,eva@peron.com,benazir@bhutto.com,desmond@tutu.com,dalai@lama.com,walt@disney.com,peter@sellers.com,barack@obama.com,malcolm@x.com,richard@branson.com,jesse@owens.com,ernest@hemingway.com,john@lennon.com,henry@ford.com,haile@selassie.com,joseph@stalin.com,lord@baden.com,michael@jordon.com,george@bush.com,osama@laden.com,fidel@castro.com,oscar@wilde.com,coco@chanel.com,amelia@earhart.com,adolf@hitler.com,mary@magdalene.com,alfred@hitchcock.com,michael@jackson.com,mata@hari.com,emmeline@pankhurst.com,ronald@reagan.com,lionel@messi.com,babe@ruth.com,bob@geldof.com,leon@trotsky.com,roger@federer.com,sigmund@freud.com,woodrow@wilson.com,mao@zedong.com,katherine@hepburn.com,audrey@hepburn.com,david@beckham.com,tiger@woods.com,usain@bolt.com,bill@cosby.com,carl@lewis.com,prince@charles.com,jacqueline@onassis.com,billie@holiday.com,virginia@woolf.com,billie@king.com,kylie@minogue.com,anne@frank.com,emile@zatopek.com,lech@walesa.com,christiano@ronaldo.com,yoko@ono.com,julie@andrews.com,florence@nightingale.com,marie@curie.com,stephen@hawking.com,tim@lee.com,lady@gaga.com,lance@armstrong.com,jon@stewart.com,scarlett@johansson.com,larry@page.com,sergey@brin.com,roman@abramovich.com,rupert@murdoch.com,al@gore.com,sacha@baron.com,george@clooney.com,paul@krugman.com,jimmy@wales.com'
				});
				var ms6 = $('#ms6').magicSuggest({});
				var ms7 = $('#ms7').magicSuggest({
					data: jsonData,
					resultAsString: true,
					maxSelection: 1,
					maxSelectionRenderer: function() {}
				})
			}
		var handleTimeAgo = function() {}
		var initTimeAgo = function() {
				jQuery("abbr.timeago").timeago()
			}
		var handleDateColorpicker = function() {}
		var handleRaty = function() {
				$.fn.raty.defaults.path = 'resources/plugins/jquery-raty/img';
				$('#score-demo').raty({
					score: 3
				});
				$('#number-demo').raty({
					number: 10
				});
				$('#readOnly-demo').raty({
					readOnly: true,
					score: 2
				});
				$('#halfShow-true-demo').raty({
					score: 3.26
				});
				$('#starHalf-demo').raty({
					path: 'resources/plugins/jquery-raty/img',
					half: true,
					starOff: 'cookie-off.png',
					starOn: 'cookie-on.png',
					starHalf: 'cookie-half.png'
				});
				$('#star-off-and-star-on-demo').raty({
					path: 'resources/plugins/jquery-raty/img',
					starOff: 'off.png',
					starOn: 'on.png'
				});
				$('#cancel-off-and-cancel-on-demo').raty({
					path: 'resources/plugins/jquery-raty/img',
					cancel: true,
					cancelOff: 'cancel-custom-off.png',
					cancelOn: 'cancel-custom-on.png',
					starOn: 'star-on.png',
					starOff: 'star-off.png'
				});
				$('#size-demo').raty({
					path: 'resources/plugins/jquery-raty/img',
					cancel: true,
					cancelOff: 'cancel-off-big.png',
					cancelOn: 'cancel-on-big.png',
					half: true,
					size: 24,
					starHalf: 'star-half-big.png',
					starOff: 'star-off-big.png',
					starOn: 'star-on-big.png'
				});
				$('#target-div-demo').raty({
					cancel: true,
					target: '#target-div-hint'
				})
			}
		var handleStatefulButtons = function() {
				$(document).ready(function() {
					$("#btn-load").on("click", function() {
						var a = $(this);
						a.button("loading");
						setTimeout(function() {
							a.button("reset")
						}, 1500)
					});
					$("#btn-load-complete").on("click", function() {
						var a = $(this);
						a.button("loading");
						setTimeout(function() {
							a.button("complete")
						}, 1500)
					})
				})
			}
		var handleToggle = function() {
				$('.radio1').on('switch-change', function() {
					$('.radio1').bootstrapSwitch('toggleRadioState')
				});
				$('.radio1').on('switch-change', function() {
					$('.radio1').bootstrapSwitch('toggleRadioStateAllowUncheck')
				});
				$('.radio1').on('switch-change', function() {
					$('.radio1').bootstrapSwitch('toggleRadioStateAllowUncheck', false)
				})
			}
		var handleSliders = function() {
				function repositionTooltip(e, ui) {
					$
					var div = $(ui.handle).data("bs.tooltip").$tip[0];
					var pos = $.extend({}, $(ui.handle).offset(), {
						width: $(ui.handle).get(0).offsetWidth,
						height: $(ui.handle).get(0).offsetHeight
					});
					var actualWidth = div.offsetWidth;
					tp = {
						left: pos.left + pos.width / 2 - actualWidth / 2
					}
					$(div).offset(tp);
					$(div).find(".tooltip-inner").text(ui.value)
				}
				$("#slider").slider({
					value: 15,
					slide: repositionTooltip,
					stop: repositionTooltip
				});
				$("#slider .ui-slider-handle:first").tooltip({
					title: $("#slider").slider("value"),
					trigger: "manual"
				}).tooltip("show");
				$("#slider-default").slider();
				$("#slider-range").slider({
					range: true,
					min: 0,
					max: 500,
					values: [75, 300]
				});
				$("#slider-range-min").slider({
					range: "min",
					value: 37,
					min: 1,
					max: 700,
					slide: function(a, b) {
						$("#slider-range-min-amount").text("$" + b.value)
					}
				});
				$("#slider-range-max").slider({
					range: "max",
					min: 1,
					max: 700,
					value: 300,
					slide: function(a, b) {
						$("#slider-range-max-amount").text("$" + b.value)
					}
				});
				$("#slider-vertical-multiple > span").each(function() {
					var a = parseInt($(this).text(), 10);
					$(this).empty().slider({
						value: a,
						range: "min",
						animate: true,
						orientation: "vertical"
					})
				});
				$("#slider-vertical-range-min").slider({
					range: "min",
					value: 400,
					min: 1,
					max: 600,
					orientation: "vertical"
				});
				$("#slider-horizontal-range-min").slider({
					range: "min",
					value: 600,
					min: 1,
					max: 1000
				})
			}
		var handleProgress = function() {
				$(document).ready(function() {
					jQuery.fn.anim_progressbar = function(aOptions) {
						var iCms = 1000;
						var iMms = 60 * iCms;
						var iHms = 3600 * iCms;
						var iDms = 24 * 3600 * iCms;
						var aDefOpts = {
							start: new Date(),
							finish: new Date().setTime(new Date().getTime() + 60 * iCms),
							interval: 100
						}
						var aOpts = jQuery.extend(aDefOpts, aOptions);
						var vPb = this;
						return this.each(function() {
							var iDuration = aOpts.finish - aOpts.start;
							$(vPb).children('.pbar').progressbar();
							var vInterval = setInterval(function() {
								var iLeftMs = aOpts.finish - new Date();
								var iElapsedMs = new Date() - aOpts.start,
									iDays = parseInt(iLeftMs / iDms),
									iHours = parseInt((iLeftMs - (iDays * iDms)) / iHms),
									iMin = parseInt((iLeftMs - (iDays * iDms) - (iHours * iHms)) / iMms),
									iSec = parseInt((iLeftMs - (iDays * iDms) - (iMin * iMms) - (iHours * iHms)) / iCms),
									iPerc = (iElapsedMs > 0) ? iElapsedMs / iDuration * 100 : 0;
								$(vPb).children('.percent').html('<b>' + iPerc.toFixed(1) + '%</b>');
								$(vPb).children('.elapsed').html(iDays + ' day ' + iHours + ' hr : ' + iMin + ' min : ' + iSec + ' sec remaining</b>');
								$(vPb).children('.pbar').children('.ui-progressbar-value').css('width', iPerc + '%');
								if (iPerc >= 100) {
									clearInterval(vInterval);
									$(vPb).children('.percent').html('<b>100%</b>');
									$(vPb).children('.elapsed').html('Completed')
								}
							}, aOpts.interval)
						})
					}
					$('#progress1').anim_progressbar();
					var iNow = new Date().setTime(new Date().getTime() + 5 * 1000);
					var iEnd = new Date().setTime(new Date().getTime() + 15 * 1000);
					$('#progress2').anim_progressbar({
						start: iNow,
						finish: iEnd,
						interval: 100
					});
					$('#progress3').anim_progressbar({
						interval: 1000
					})
				})
			}
		var handleKnobs = function() {
				$(".knob").knob({
					change: function(value) {},
					release: function(value) {
						console.log("release : " + value)
					},
					cancel: function() {
						console.log("cancel : ", this)
					},
					draw: function() {
						if (this.$.data('skin') == 'tron') {
							var a = this.angle(this.cv),
								sa = this.startAngle,
								sat = this.startAngle,
								ea, eat = sat + a,
								r = 1;
							this.g.lineWidth = this.lineWidth;
							this.o.cursor && (sat = eat - 0.3) && (eat = eat + 0.3);
							if (this.o.displayPrevious) {
								ea = this.startAngle + this.angle(this.v);
								this.o.cursor && (sa = ea - 0.3) && (ea = ea + 0.3);
								this.g.beginPath();
								this.g.strokeStyle = this.pColor;
								this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
								this.g.stroke()
							}
							this.g.beginPath();
							this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
							this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
							this.g.stroke();
							this.g.lineWidth = 2;
							this.g.beginPath();
							this.g.strokeStyle = this.o.fgColor;
							this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
							this.g.stroke();
							return false
						}
					}
				})
			}
		var handleCustomTabs = function() {
				var adjustMinHeight = function(y) {
						$(y).each(function() {
							var A = $($($(this).attr("href")));
							var z = $(this).parent().parent();
							if (z.height() > A.height()) {
								A.css("min-height", z.height())
							}
						})
					};
				$("body").on("click", '.nav.nav-tabs.tabs-left a[data-toggle="tab"], .nav.nav-tabs.tabs-right a[data-toggle="tab"]', function() {
					adjustMinHeight($(this))
				});
				adjustMinHeight('.nav.nav-tabs.tabs-left > li.active > a[data-toggle="tab"], .nav.nav-tabs.tabs-right > li.active > a[data-toggle="tab"]');
				if (location.hash) {
					var w = location.hash.substr(1);
					$('a[href="#' + w + '"]').click()
				}
			}
		var handleTree = function() {
				$('#tree1').admin_tree({
					dataSource: treeDataSource,
					multiSelect: true,
					loadingHTML: '<div class="tree-loading"><i class="fa fa-spinner fa-2x fa-spin"></i></div>',
					'open-icon': 'fa-minus',
					'close-icon': 'fa-plus',
					'selectable': true,
					'selected-icon': 'fa-check',
					'unselected-icon': 'fa-times'
				});
				$('#tree3').admin_tree({
					dataSource: treeDataSource3,
					multiSelect: true,
					loadingHTML: '<div class="tree-loading"><i class="fa fa-spinner fa-2x fa-spin"></i></div>',
					'open-icon': 'fa-minus-square',
					'close-icon': 'fa-plus-square',
					'selectable': true,
					'selected-icon': 'fa-check',
					'unselected-icon': 'fa-times'
				});
				$('#tree2').admin_tree({
					dataSource: treeDataSource2,
					loadingHTML: '<div class="tree-loading"><i class="fa fa-spinner fa-2x fa-spin"></i></div>',
					'open-icon': 'fa-folder-open',
					'close-icon': 'fa-folder',
					'selectable': false,
					'selected-icon': null,
					'unselected-icon': null
				});
				$('.tree').find('[class*="fa-"]').addClass("fa")
			}
		var handleNestableLists = function() {
				var updateOutput = function(e) {
						var list = e.length ? e : $(e.target),
							output = list.data('output');
						if (window.JSON) {
							output.val(window.JSON.stringify(list.nestable('serialize')))
						} else {
							output.val('JSON browser support required for this demo.')
						}
					};
				$('#nestable').nestable({
					group: 1
				}).on('change', updateOutput);
				$('#nestable2').nestable({
					group: 1
				}).on('change', updateOutput);
				updateOutput($('#nestable').data('output', $('#nestable-output')));
				updateOutput($('#nestable2').data('output', $('#nestable2-output')));
				$('#nestable-menu').on('click', function(e) {
					var target = $(e.target),
						action = target.data('action');
					if (action === 'expand-all') {
						$('.dd').nestable('expandAll')
					}
					if (action === 'collapse-all') {
						$('.dd').nestable('collapseAll')
					}
				});
				$('#nestable3').nestable()
			}
		var handleTablecloth = function() {
				$("#example-dark").tablecloth({
					theme: "dark"
				});
				$("#example-paper").tablecloth({
					theme: "paper",
					striped: true
				});
				$("#example-stats").tablecloth({
					theme: "stats",
					sortable: true,
					condensed: true,
					striped: true,
					clean: true
				})
			}
		var handleDataTables = function() {
				$('#datatable1').dataTable({
					"sPaginationType": "bs_full"
				});
				$('#datatable2').dataTable({
					"sPaginationType": "bs_full",
					sDom: "<'row'<'dataTables_header clearfix'<'col-md-4'l><'col-md-8'Tf>r>>t<'row'<'dataTables_footer clearfix'<'col-md-6'i><'col-md-6'p>>>",
					oTableTools: {
						aButtons: ["copy", "print", "csv", "xls", "pdf"],
						sSwfPath: "resources/plugins/datatables/extras/TableTools/media/swf/copy_csv_xls_pdf.swf"
					}
				});
				$('.datatable').each(function() {
					var datatable = $(this);
					var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
					search_input.attr('placeholder', 'Search');
					search_input.addClass('form-control input-sm');
					var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
					length_sel.addClass('form-control input-sm')
				})
			}
		var handleJqgrid = function() {
				var grid_data = [{
					id: "1",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "2",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "3",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "4",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "5",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "6",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "7",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "8",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "9",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "10",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "11",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "12",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "13",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "14",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "15",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "16",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "17",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "18",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "19",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "20",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "21",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "22",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "23",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "24",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}, {
					id: "25",
					invdate: "2007-12-03",
					name: "Client1",
					amount: "1000.00",
					tax: "140.00",
					total: "1000.00",
					note: "This is a note"
				}];
				jQuery("#rowed3").jqGrid({
					data: grid_data,
					datatype: "local",
					height: 250,
					colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
					colModel: [{
						name: 'id',
						index: 'id',
						width: 55
					}, {
						name: 'invdate',
						index: 'invdate',
						width: 90,
						editable: true
					}, {
						name: 'name',
						index: 'name',
						width: 100,
						editable: true
					}, {
						name: 'amount',
						index: 'amount',
						width: 80,
						align: "right",
						editable: true
					}, {
						name: 'tax',
						index: 'tax',
						width: 80,
						align: "right",
						editable: true
					}, {
						name: 'total',
						index: 'total',
						width: 80,
						align: "right",
						editable: true
					}, {
						name: 'note',
						index: 'note',
						width: 150,
						sortable: false,
						editable: true
					}],
					rowNum: 10,
					rowList: [10, 20, 30],
					pager: '#prowed3',
					sortname: 'id',
					viewrecords: true,
					sortorder: "asc",
					editurl: "server.html",
					caption: "Inline navigator",
					autowidth: true
				});
				jQuery("#rowed3").jqGrid('navGrid', "#prowed3", {
					edit: false,
					add: false,
					del: false
				});
				jQuery("#rowed3").jqGrid('inlineNav', "#prowed3");
				$('.navtable .ui-pg-button').tooltip({
					container: 'body'
				})
			}
		var handleTypeahead = function() {
				$('#autocomplete-example').typeahead({
					name: 'countries',
					local: ["red", "blue", "green", "yellow", "brown", "black"]
				})
			}
		var handleAutosize = function() {
				$('textarea.autosize').autosize();
				$('textarea.autosize').addClass('textarea-transition')
			}
		var handleCountable = function() {
				$('.countable').simplyCountable()
			}
		var handleSelect2 = function() {
				function movieFormatResult(movie) {
					var markup = "<table class='movie-result'><tr>";
					if (movie.posters !== undefined && movie.posters.thumbnail !== undefined) {
						markup += "<td class='movie-image'><img src='" + movie.posters.thumbnail + "'/></td>"
					}
					markup += "<td class='movie-info'><div class='movie-title'>" + movie.title + "</div>";
					if (movie.critics_consensus !== undefined) {
						markup += "<div class='movie-synopsis'>" + movie.critics_consensus + "</div>"
					} else if (movie.synopsis !== undefined) {
						markup += "<div class='movie-synopsis'>" + movie.synopsis + "</div>"
					}
					markup += "</td></tr></table>"
					return markup
				}
				function movieFormatSelection(movie) {
					return movie.title
				}
				$("#e1").select2();
				$("#e2").select2();
				$("#e3").select2({
					placeholder: "Select a State",
					allowClear: true
				});
				$("#e4").select2({
					placeholder: "Select a State"
				});
				$("#e5").select2({
					placeholder: "Select 2 characters",
					minimumInputLength: 2
				});
				$("#e6").select2({
					placeholder: "Select a maximum of 3 states",
					maximumSelectionSize: 3
				});
				$("#e7").select2({
					placeholder: "Search for a movie",
					minimumInputLength: 1,
					ajax: {
						url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
						dataType: 'jsonp',
						data: function(term, page) {
							return {
								q: term,
								page_limit: 10,
								apikey: "uekzdmffsrmqzwdtcgmc5yu9"
							}
						},
						results: function(data, page) {
							return {
								results: data.movies
							}
						}
					},
					initSelection: function(element, callback) {
						var id = $(element).val();
						if (id !== "") {
							$.ajax("http://api.rottentomatoes.com/api/public/v1.0/movies/" + id + ".json", {
								data: {
									apikey: "uekzdmffsrmqzwdtcgmc5yu9"
								},
								dataType: "jsonp"
							}).done(function(data) {
								callback(data)
							})
						}
					},
					formatResult: movieFormatResult,
					formatSelection: movieFormatSelection,
					dropdownCssClass: "bigdrop",
					escapeMarkup: function(m) {
						return m
					}
				});
				$("#e8").select2({
					tags: ["red", "green", "blue"]
				})
			}
		var handleUniform = function() {
				$(".uniform").uniform()
			}
		var handleAllUniform = function() {
				$("select, input[type='checkbox']").uniform()
			}
		var handleWysiwyg = function() {
				function initToolbarBootstrapBindings() {
					var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times', 'Times New Roman', 'Verdana'],
						fontTarget = $('[title=Font]').siblings('.dropdown-menu');
					$.each(fonts, function(idx, fontName) {
						fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'))
					});
					$('a[title]').tooltip({
						container: 'body'
					});
					$('.dropdown-menu input').click(function() {
						return false
					}).change(function() {
						$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle')
					}).keydown('esc', function() {
						this.value = '';
						$(this).change()
					});
					$('[data-role=magic-overlay]').each(function() {
						var overlay = $(this),
							target = $(overlay.data('target'));
						overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight())
					});
					if ("onwebkitspeechchange" in document.createElement("input")) {
						var editorOffset = $('#editor').offset();
						$('#voiceBtn').css('position', 'absolute').offset({
							top: editorOffset.top,
							left: editorOffset.left + $('#editor').innerWidth() - 35
						})
					} else {
						$('#voiceBtn').hide()
					}
				};

				function showErrorAlert(reason, detail) {
					var msg = '';
					if (reason === 'unsupported-file-type') {
						msg = "Unsupported format " + detail
					} else {
						console.log("error uploading file", reason, detail)
					}
					$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>' + '<strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts')
				};
				initToolbarBootstrapBindings();
				$('#editor').wysiwyg({
					fileUploadError: showErrorAlert
				});
				CKEDITOR.disableAutoInline = true
			}
		var handleDropzone = function() {
				try {
					$(".dropzone").dropzone({
						paramName: "file",
						maxFilesize: 0.5,
						addRemoveLinks: true,
						dictResponseError: 'Error while uploading file!',
						previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"progress progress-sm progress-striped active\"><div class=\"progress-bar progress-bar-success\" data-dz-uploadprogress></div></div>\n  <div class=\"dz-success-mark\"><span></span></div>\n  <div class=\"dz-error-mark\"><span></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
					})
				} catch (e) {
					alert('Dropzone.js does not support older browsers!')
				}
			}
		var handleXcharts = function() {
				function chart1() {
					var data = [{
						"xScale": "ordinal",
						"comp": [],
						"main": [{
							"className": ".main.l1",
							"data": [{
								"y": 15,
								"x": "2012-11-19T00:00:00"
							}, {
								"y": 11,
								"x": "2012-11-20T00:00:00"
							}, {
								"y": 8,
								"x": "2012-11-21T00:00:00"
							}, {
								"y": 10,
								"x": "2012-11-22T00:00:00"
							}, {
								"y": 1,
								"x": "2012-11-23T00:00:00"
							}, {
								"y": 6,
								"x": "2012-11-24T00:00:00"
							}, {
								"y": 8,
								"x": "2012-11-25T00:00:00"
							}]
						}, {
							"className": ".main.l2",
							"data": [{
								"y": 29,
								"x": "2012-11-19T00:00:00"
							}, {
								"y": 33,
								"x": "2012-11-20T00:00:00"
							}, {
								"y": 13,
								"x": "2012-11-21T00:00:00"
							}, {
								"y": 16,
								"x": "2012-11-22T00:00:00"
							}, {
								"y": 7,
								"x": "2012-11-23T00:00:00"
							}, {
								"y": 18,
								"x": "2012-11-24T00:00:00"
							}, {
								"y": 8,
								"x": "2012-11-25T00:00:00"
							}]
						}],
						"type": "line-dotted",
						"yScale": "linear"
					}, {
						"xScale": "ordinal",
						"comp": [],
						"main": [{
							"className": ".main.l1",
							"data": [{
								"y": 12,
								"x": "2012-11-19T00:00:00"
							}, {
								"y": 18,
								"x": "2012-11-20T00:00:00"
							}, {
								"y": 8,
								"x": "2012-11-21T00:00:00"
							}, {
								"y": 7,
								"x": "2012-11-22T00:00:00"
							}, {
								"y": 6,
								"x": "2012-11-23T00:00:00"
							}, {
								"y": 12,
								"x": "2012-11-24T00:00:00"
							}, {
								"y": 8,
								"x": "2012-11-25T00:00:00"
							}]
						}, {
							"className": ".main.l2",
							"data": [{
								"y": 29,
								"x": "2012-11-19T00:00:00"
							}, {
								"y": 33,
								"x": "2012-11-20T00:00:00"
							}, {
								"y": 13,
								"x": "2012-11-21T00:00:00"
							}, {
								"y": 16,
								"x": "2012-11-22T00:00:00"
							}, {
								"y": 7,
								"x": "2012-11-23T00:00:00"
							}, {
								"y": 18,
								"x": "2012-11-24T00:00:00"
							}, {
								"y": 8,
								"x": "2012-11-25T00:00:00"
							}]
						}],
						"type": "cumulative",
						"yScale": "linear"
					}, {
						"xScale": "ordinal",
						"comp": [],
						"main": [{
							"className": ".main.l1",
							"data": [{
								"y": 12,
								"x": "2012-11-19T00:00:00"
							}, {
								"y": 18,
								"x": "2012-11-20T00:00:00"
							}, {
								"y": 8,
								"x": "2012-11-21T00:00:00"
							}, {
								"y": 7,
								"x": "2012-11-22T00:00:00"
							}, {
								"y": 6,
								"x": "2012-11-23T00:00:00"
							}, {
								"y": 12,
								"x": "2012-11-24T00:00:00"
							}, {
								"y": 8,
								"x": "2012-11-25T00:00:00"
							}]
						}, {
							"className": ".main.l2",
							"data": [{
								"y": 29,
								"x": "2012-11-19T00:00:00"
							}, {
								"y": 33,
								"x": "2012-11-20T00:00:00"
							}, {
								"y": 13,
								"x": "2012-11-21T00:00:00"
							}, {
								"y": 16,
								"x": "2012-11-22T00:00:00"
							}, {
								"y": 7,
								"x": "2012-11-23T00:00:00"
							}, {
								"y": 18,
								"x": "2012-11-24T00:00:00"
							}, {
								"y": 8,
								"x": "2012-11-25T00:00:00"
							}]
						}],
						"type": "bar",
						"yScale": "linear"
					}];
					var order = [0, 1, 0, 2],
						i = 0,
						xFormat = d3.time.format('%A'),
						chart = new xChart('line-dotted', data[order[i]], '#chart1', {
							axisPaddingTop: 5,
							dataFormatX: function(x) {
								return new Date(x)
							},
							tickFormatX: function(x) {
								return xFormat(x)
							},
							timing: 1250
						}),
						rotateTimer, toggles = d3.selectAll('.multi button'),
						t = 3500;

					function updateChart(i) {
						var d = data[i];
						chart.setData(d);
						toggles.classed('toggled', function() {
							return (d3.select(this).attr('data-type') === d.type)
						});
						return d
					}
					toggles.on('click', function(d, i) {
						clearTimeout(rotateTimer);
						updateChart(i)
					});

					function rotateChart() {
						i += 1;
						i = (i >= order.length) ? 0 : i;
						var d = updateChart(order[i]);
						rotateTimer = setTimeout(rotateChart, t)
					}
					rotateTimer = setTimeout(rotateChart, t)
				}
				function chart2() {
					var data = {
						"xScale": "time",
						"yScale": "linear",
						"type": "line",
						"main": [{
							"className": ".pizza",
							"data": [{
								"x": "2012-11-05",
								"y": 1
							}, {
								"x": "2012-11-06",
								"y": 6
							}, {
								"x": "2012-11-07",
								"y": 13
							}, {
								"x": "2012-11-08",
								"y": -3
							}, {
								"x": "2012-11-09",
								"y": -4
							}, {
								"x": "2012-11-10",
								"y": 9
							}, {
								"x": "2012-11-11",
								"y": 6
							}]
						}]
					};
					var opts = {
						"dataFormatX": function(x) {
							return d3.time.format('%Y-%m-%d').parse(x)
						},
						"tickFormatX": function(x) {
							return d3.time.format('%A')(x)
						}
					};
					var myChart = new xChart('line', data, '#chart2', opts)
				}
				function chart3() {
					var tt = document.createElement('div'),
						leftOffset = -(~~$('html').css('padding-left').replace('px', '') + ~~$('body').css('margin-left').replace('px', '')),
						topOffset = -32;
					tt.className = 'ex-tooltip';
					document.body.appendChild(tt);
					var data = {
						"xScale": "time",
						"yScale": "linear",
						"main": [{
							"className": ".pizza",
							"data": [{
								"x": "2012-11-05",
								"y": 6
							}, {
								"x": "2012-11-06",
								"y": 6
							}, {
								"x": "2012-11-07",
								"y": 8
							}, {
								"x": "2012-11-08",
								"y": 3
							}, {
								"x": "2012-11-09",
								"y": 4
							}, {
								"x": "2012-11-10",
								"y": 9
							}, {
								"x": "2012-11-11",
								"y": 6
							}]
						}]
					};
					var opts = {
						"dataFormatX": function(x) {
							return d3.time.format('%Y-%m-%d').parse(x)
						},
						"tickFormatX": function(x) {
							return d3.time.format('%A')(x)
						},
						"mouseover": function(d, i) {
							var pos = $(this).offset();
							$(tt).text(d3.time.format('%A')(d.x) + ': ' + d.y).css({
								top: topOffset + pos.top,
								left: pos.left + leftOffset
							}).show()
						},
						"mouseout": function(x) {
							$(tt).hide()
						}
					};
					var myChart = new xChart('line-dotted', data, '#chart3', opts)
				}
				function chart4() {
					var data = {
						"xScale": "ordinal",
						"yScale": "linear",
						"main": [{
							"className": ".pizza",
							"data": [{
								"x": "Pepperoni",
								"y": 4
							}, {
								"x": "Cheese",
								"y": 8
							}]
						}]
					};
					var myChart = new xChart('bar', data, '#chart4')
				}
				function chart5() {
					var data = {
						"xScale": "ordinal",
						"yScale": "linear",
						"main": [{
							"className": ".pizza",
							"data": [{
								"x": "Pepperoni",
								"y": 4
							}, {
								"x": "Cheese",
								"y": 8
							}]
						}, {
							"className": ".pizza",
							"data": [{
								"x": "Pepperoni",
								"y": 6
							}, {
								"x": "Cheese",
								"y": 5
							}]
						}]
					};
					var myChart = new xChart('bar', data, '#chart5')
				}
				function chart6() {
					var errorBar = {
						enter: function(self, storage, className, data, callbacks) {
							var insertionPoint = xChart.visutils.getInsertionPoint(9),
								container, eData = data.map(function(d) {
									d.data = d.data.map(function(d) {
										return [{
											x: d.x,
											y: d.y - d.e
										}, {
											x: d.x,
											y: d.y
										}, {
											x: d.x,
											y: d.y + d.e
										}]
									});
									return d
								}),
								paths;
							container = self._g.selectAll('.errorLine' + className).data(eData, function(d) {
								return d.className
							});
							container.enter().insert('g', insertionPoint).attr('class', function(d, i) {
								return 'errorLine' + className.replace(/\./g, ' ') + ' color' + i
							});
							paths = container.selectAll('path').data(function(d) {
								return d.data
							}, function(d) {
								return d[0].x
							});
							paths.enter().insert('path').style('opacity', 0).attr('d', d3.svg.line().x(function(d) {
								return self.xScale(d.x) + self.xScale.rangeBand() / 2
							}).y(function(d) {
								return self.yScale(d.y)
							}));
							storage.containers = container;
							storage.paths = paths
						},
						update: function(self, storage, timing) {
							storage.paths.transition().duration(timing).style('opacity', 1).attr('d', d3.svg.line().x(function(d) {
								return self.xScale(d.x) + self.xScale.rangeBand() / 2
							}).y(function(d) {
								return self.yScale(d.y)
							}))
						},
						exit: function(self, storage, timing) {
							storage.paths.exit().transition().duration(timing).style('opacity', 0)
						},
						destroy: function(self, storage, timing) {
							storage.paths.transition().duration(timing).style('opacity', 0).remove()
						}
					};
					xChart.setVis('error', errorBar);
					var data = [{
						"xScale": "ordinal",
						"yScale": "linear",
						"main": [{
							"className": ".errorExample",
							"data": [{
								"x": "Ponies",
								"y": 12
							}, {
								"x": "Unicorns",
								"y": 23
							}, {
								"x": "Trolls",
								"y": 1
							}]
						}],
						"comp": [{
							"type": "error",
							"className": ".comp.errorBar",
							"data": [{
								"x": "Ponies",
								"y": 12,
								"e": 5
							}, {
								"x": "Unicorns",
								"y": 23,
								"e": 2
							}, {
								"x": "Trolls",
								"y": 1,
								"e": 1
							}]
						}]
					}, {
						"xScale": "ordinal",
						"yScale": "linear",
						"main": [{
							"className": ".errorExample",
							"data": [{
								"x": "Ponies",
								"y": 76
							}, {
								"x": "Unicorns",
								"y": 45
							}, {
								"x": "Trolls",
								"y": 82
							}]
						}],
						"comp": [{
							"type": "error",
							"className": ".comp.errorBar",
							"data": [{
								"x": "Ponies",
								"y": 76,
								"e": 12
							}, {
								"x": "Unicorns",
								"y": 45,
								"e": 3
							}, {
								"x": "Trolls",
								"y": 82,
								"e": 12
							}]
						}]
					}];
					var myChart = new xChart('bar', data[0], '#chart6'),
						i = 0;

					function timer() {
						setTimeout(function() {
							timer();
							i += 1;
							myChart.setData(data[i % 2])
						}, 3000)
					}
					timer()
				}
				chart1();
				chart2();
				chart3();
				chart4();
				chart5();
				chart6()
			}
		var handleGage = function() {
				var g1, g2, g3, g4, g5, g6;
				window.onload = function() {
					var g1 = new JustGage({
						id: "g1",
						value: getRandomInt(0, 100),
						min: 0,
						max: 100,
						title: "Custom Width",
						label: "",
						gaugeWidthScale: 0.2
					});
					var g2 = new JustGage({
						id: "g2",
						value: getRandomInt(0, 100),
						min: 0,
						max: 100,
						title: "Custom Shadow",
						label: "",
						shadowOpacity: 1,
						shadowSize: 0,
						shadowVerticalOffset: 4
					});
					var g3 = new JustGage({
						id: "g3",
						value: getRandomInt(0, 100),
						min: 0,
						max: 100,
						title: "Custom Colors",
						label: "",
						levelColors: [Theme.colors.red, Theme.colors.yellow, Theme.colors.green]
					});
					var g4 = new JustGage({
						id: "g4",
						value: getRandomInt(0, 100),
						min: 0,
						max: 100,
						title: "Hide Labels",
						showMinMax: false
					});
					var g5 = new JustGage({
						id: "g5",
						value: getRandomInt(0, 100),
						min: 0,
						max: 100,
						title: "Animation Type",
						label: "",
						startAnimationTime: 2000,
						startAnimationType: ">",
						refreshAnimationTime: 1000,
						refreshAnimationType: "bounce"
					});
					var g6 = new JustGage({
						id: "g6",
						value: getRandomInt(0, 100),
						min: 0,
						max: 100,
						title: "Minimal",
						label: "",
						showMinMax: false,
						gaugeColor: "#E6E6E6",
						levelColors: ["#555555"],
						showInnerShadow: false,
						startAnimationTime: 1,
						startAnimationType: "linear",
						refreshAnimationTime: 1,
						refreshAnimationType: "linear"
					});
					setInterval(function() {
						g1.refresh(getRandomInt(0, 100));
						g2.refresh(getRandomInt(0, 100));
						g3.refresh(getRandomInt(0, 100));
						g4.refresh(getRandomInt(0, 100));
						g5.refresh(getRandomInt(0, 100));
						g6.refresh(getRandomInt(0, 100))
					}, 2500)
				}
			}
		var handleEasyPie = function() {
				$('#pie_1').easyPieChart({
					easing: 'easeOutBounce',
					onStep: function(from, to, percent) {
						$(this.el).find('.percent').text(Math.round(percent))
					},
					lineWidth: 3,
					barColor: '#A8BC7B'
				});
				var chart1 = window.chart = $('#pie_1').data('easyPieChart');
				$('#js_update_1').on('click', function() {
					chart1.update(Math.random() * 100)
				});
				$('#pie_2').easyPieChart({
					easing: 'easeOutBounce',
					onStep: function(from, to, percent) {
						$(this.el).find('.percent').text(Math.round(percent))
					},
					lineWidth: 6,
					barColor: '#F0AD4E'
				});
				var chart2 = window.chart = $('#pie_2').data('easyPieChart');
				$('#js_update_2').on('click', function() {
					chart2.update(Math.random() * 100)
				});
				$('#pie_3').easyPieChart({
					easing: 'easeOutBounce',
					onStep: function(from, to, percent) {
						$(this.el).find('.percent').text(Math.round(percent))
					},
					lineWidth: 9,
					barColor: '#D9534F'
				});
				var chart3 = window.chart = $('#pie_3').data('easyPieChart');
				$('#js_update_3').on('click', function() {
					chart3.update(Math.random() * 100)
				});
				$('#pie_4').easyPieChart({
					easing: 'easeOutBounce',
					onStep: function(from, to, percent) {
						$(this.el).find('.percent').text(Math.round(percent))
					},
					lineWidth: 12,
					barColor: '#70AFC4',
					lineCap: 'butt'
				});
				var chart4 = window.chart = $('#pie_4').data('easyPieChart');
				$('#js_update_4').on('click', function() {
					chart4.update(Math.random() * 100)
				})
			}
		var handleProfileSkillPie = function() {
				$('#pie_1').easyPieChart({
					easing: 'easeOutBounce',
					onStep: function(from, to, percent) {
						$(this.el).find('.percent').text(Math.round(percent) + "%")
					},
					lineWidth: 6,
					barColor: '#F0AD4E'
				});
				var chart1 = window.chart = $('#pie_1').data('easyPieChart');
				$('#pie_2').easyPieChart({
					easing: 'easeOutBounce',
					onStep: function(from, to, percent) {
						$(this.el).find('.percent').text(Math.round(percent) + "%")
					},
					lineWidth: 6,
					barColor: '#D9534F'
				});
				var chart2 = window.chart = $('#pie_2').data('easyPieChart');
				$('#pie_3').easyPieChart({
					easing: 'easeOutBounce',
					onStep: function(from, to, percent) {
						$(this.el).find('.percent').text(Math.round(percent) + "%")
					},
					lineWidth: 6,
					barColor: '#70AFC4'
				});
				var chart3 = window.chart = $('#pie_3').data('easyPieChart')
			}
		var handleSparkline = function() {
				$(".sparkline").each(function() {
					var barSpacing, barWidth, color, height;
					color = $(this).attr("data-color") || "red";
					height = "18px";
					if ($(this).hasClass("big")) {
						barWidth = "5px";
						barSpacing = "2px";
						height = "40px"
					}
					return $(this).sparkline("html", {
						type: "bar",
						barColor: Theme.colors[color],
						height: height,
						barWidth: barWidth,
						barSpacing: barSpacing,
						zeroAxis: false
					})
				});
				$(".sparklinepie").each(function() {
					var height;
					height = "50px";
					if ($(this).hasClass("big")) {
						height = "70px"
					}
					return $(this).sparkline("html", {
						type: "pie",
						height: height,
						sliceColors: [Theme.colors.blue, Theme.colors.red, Theme.colors.green, Theme.colors.orange]
					})
				});
				$(".linechart").each(function() {
					var height;
					height = "18px";
					if ($(this).hasClass("linechart-lg")) {
						height = "30px"
					}
					return $(this).sparkline("html", {
						type: "line",
						height: height,
						width: "150px",
						minSpotColor: Theme.colors.red,
						maxSpotColor: Theme.colors.green,
						spotRadius: 3,
						lineColor: Theme.colors.primary,
						fillColor: "rgba(94,135,176,0.1)",
						lineWidth: 1.2,
						highlightLineColor: Theme.colors.red,
						highlightSpotColor: Theme.colors.yellow
					})
				})
			}
		var handleCalendar = function() {
				var initDrag = function(el) {
						var eventObject = {
							title: $.trim(el.text())
						};
						el.data('eventObject', eventObject);
						el.draggable({
							zIndex: 999,
							revert: true,
							revertDuration: 0
						})
					}
				var addEvent = function(title) {
						title = title.length == 0 ? "Untitled Event" : title;
						var html = $('<div class="external-event">' + title + '</div>');
						jQuery('#event-box').append(html);
						initDrag(html)
					}
				$('#external-events div.external-event').each(function() {
					initDrag($(this))
				});
				$('#add-event').unbind('click').click(function() {
					var title = $('#event-title').val();
					addEvent(title)
				});
				var date = new Date();
				var d = date.getDate();
				var m = date.getMonth();
				var y = date.getFullYear();
				var calendar = $('#calendar').fullCalendar({
					header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek,agendaDay'
					},
					selectable: true,
					selectHelper: true,
					select: function(start, end, allDay) {
						var title = prompt('Event Title:');
						if (title) {
							calendar.fullCalendar('renderEvent', {
								title: title,
								start: start,
								end: end,
								allDay: allDay
							}, true)
						}
						calendar.fullCalendar('unselect')
					},
					editable: true,
					editable: true,
					droppable: true,
					drop: function(date, allDay) {
						var originalEventObject = $(this).data('eventObject');
						var copiedEventObject = $.extend({}, originalEventObject);
						copiedEventObject.start = date;
						copiedEventObject.allDay = allDay;
						$('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
						if ($('#drop-remove').is(':checked')) {
							$(this).remove()
						}
					},
					events: [{
						title: 'All Day Event',
						start: new Date(y, m, 1),
						backgroundColor: Theme.colors.blue
					}, {
						title: 'Long Event',
						start: new Date(y, m, d - 5),
						end: new Date(y, m, d - 2),
						backgroundColor: Theme.colors.red
					}, {
						id: 999,
						title: 'Repeating Event',
						start: new Date(y, m, d - 3, 16, 0),
						allDay: false,
						backgroundColor: Theme.colors.yellow
					}, {
						id: 999,
						title: 'Repeating Event',
						start: new Date(y, m, d + 4, 16, 0),
						allDay: false,
						backgroundColor: Theme.colors.primary
					}, {
						title: 'Meeting',
						start: new Date(y, m, d, 10, 30),
						allDay: false,
						backgroundColor: Theme.colors.green
					}, {
						title: 'Lunch',
						start: new Date(y, m, d, 12, 0),
						end: new Date(y, m, d, 14, 0),
						allDay: false,
						backgroundColor: Theme.colors.red
					}, {
						title: 'Birthday Party',
						start: new Date(y, m, d + 1, 19, 0),
						end: new Date(y, m, d + 1, 22, 30),
						allDay: false,
						backgroundColor: Theme.colors.gray
					}, {
						title: 'Click for Google',
						start: new Date(y, m, 28),
						end: new Date(y, m, 29),
						url: 'http://google.com/',
						backgroundColor: Theme.colors.green
					}]
				})
			}
		var handleJqvmaps = function() {
				var setMap = function(name) {
						var data = {
							map: 'world_en',
							backgroundColor: null,
							borderColor: '#333333',
							borderOpacity: 0.5,
							borderWidth: 1,
							color: Theme.colors.blue,
							enableZoom: true,
							hoverColor: Theme.colors.yellow,
							hoverOpacity: null,
							values: sample_data,
							normalizeFunction: 'linear',
							scaleColors: ['#b6da93', '#427d1a'],
							selectedColor: '#c9dfaf',
							selectedRegion: null,
							showTooltip: true,
							onRegionOver: function(event, code) {
								if (code == 'ca') {
									event.preventDefault()
								}
							},
							onRegionClick: function(element, code, region) {
								var message = 'You clicked "' + region + '" which has the code: ' + code.toUpperCase();
								alert(message)
							}
						};
						data.map = name + '_en';
						var map = jQuery('#vmap_' + name);
						if (!map) {
							return
						}
						map.width(map.parent().width());
						map.vectorMap(data)
					}
				setMap("world");
				setMap("usa");
				setMap("europe");
				setMap("russia");
				setMap("germany");
				App.addResponsiveFunction(function() {
					setMap("world");
					setMap("usa");
					setMap("europe");
					setMap("russia");
					setMap("germany")
				})
			}
		var handleIsotope = function() {
				var $container = $('#filter-items');
				$container.imagesLoaded(function() {
					$container.isotope({});
					$('#filter-controls a').click(function() {
						var selector = $(this).attr('data-filter');
						$container.isotope({
							filter: selector
						});
						return false
					});
					$("#e1").change(function() {
						var selector = $(this).find(":selected").val();
						$container.isotope({
							filter: selector
						});
						return false
					})
				});

				function handleIsotopeStretch() {
					var width = $(window).width();
					if (width < 768) {
						$('#filter-items .item').addClass('width-100')
					} else {
						$('#filter-items .item').removeClass('width-100')
					}
				}
				handleIsotopeStretch();
				jQuery(window).resize(function() {
					handleIsotopeStretch()
				})
			}
		var handleHover = function() {
				$('.filter-content').hover(function() {
					var hoverContent = $(this).children('.hover-content');
					hoverContent.removeClass('fadeOut').addClass('animated fadeIn').show()
				}, function() {
					var hoverContent = $(this).children('.hover-content');
					hoverContent.removeClass('fadeIn').addClass('fadeOut')
				})
			}
		var handleColorbox = function() {
				$('.colorbox-button').colorbox({
					rel: 'colorbox-button',
					maxWidth: '95%',
					maxHeight: '95%'
				});
				var resizeTimer;

				function resizeColorBox() {
					if (resizeTimer) clearTimeout(resizeTimer);
					resizeTimer = setTimeout(function() {
						var myWidth = 442,
							percentageWidth = .95;
						if (jQuery('#cboxOverlay').is(':visible')) {
							$.colorbox.resize({
								width: ($(window).width() > (myWidth + 20)) ? myWidth : Math.round($(window).width() * percentageWidth)
							});
							$('.cboxPhoto').css({
								width: $('#cboxLoadedContent').innerWidth(),
								height: 'auto'
							});
							$('#cboxLoadedContent').height($('.cboxPhoto').height());
							$.colorbox.resize()
						}
					}, 300)
				}
				jQuery(window).resize(resizeColorBox);
				window.addEventListener("orientationchange", resizeColorBox, false)
			}
		var handleBackstretch = function() {
				$.backstretch(["resources/image/login/1.jpg", "resources/image/login/2.jpg", "resources/image/login/3.jpg", "resources/image/login/4.jpg"], {
					duration: 3000,
					fade: 750
				})
			}
		var handleChat = function(elem) {
				var append = function() {
						var input = $('.' + elem + ' .chat-form input');
						var text = input.val();
						if (text.length == 0) {
							return
						}
						var curr_time = moment().format('YYYY-MM-DD HH:mm:ss');
						var msg = '';
						msg += '<li class="animated fadeInLeft media">';
						msg += '<a class="pull-right" href="#">';
						msg += '<img class="media-object" alt="Generic placeholder image" src="resources/image/chat/headshot2.jpg">';
						msg += '</a>';
						msg += '<div class="pull-right media-body chat-pop mod">';
						msg += '<h4 class="media-heading">You <span class="pull-left"><abbr id="curr-time" class="timeago" title="' + curr_time + '" >' + curr_time + '</abbr> <i class="fa fa-clock-o"></i></span></h4>';
						msg += text;
						msg += '</div>';
						msg += '</li>';
						var list = $('.' + elem + ' .chat-list');
						list.append(msg);
						jQuery("abbr.timeago").timeago();
						input.val("");
						$('.' + elem + ' .scroller').slimScroll({
							scrollTo: list.height()
						})
					}
				$('.' + elem + ' .chat-form .btn').click(function(e) {
					e.preventDefault();
					append()
				});
				var input = $('.' + elem + ' .chat-form input');
				input.keypress(function(e) {
					if (e.which == 13) {
						append();
						return false
					}
				})
			}
		var handleTimeline = function() {
				createStoryJS({
					type: 'timeline',
					width: '100%',
					height: '600',
					source: 'js/timelinejs/example_json.json',
					embed_id: 'my-timeline',
					debug: true,
					css: 'resources/plugins/timelinejs/css/timeline.css',
					js: 'resources/plugins/timelinejs/js/timeline-min.js'
				})
			}
		var handleSliderNav = function() {
				$('#address-book').sliderNav();
				$('#address-book .slider-content ul li ul li a').click(function(e) {
					e.preventDefault();
					var contact_card = $('#contact-card');
					var name = $(this).text();
					$('#contact-card .panel-title').html(name);
					$('#contact-card #card-name').html(name);
					var img_id = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
					$('#contact-card .headshot img').attr('src', 'resources/image/addressbook/' + img_id + '.jpg');
					contact_card.removeClass('animated fadeInUp').addClass('animated fadeInUp');
					var wait = window.setTimeout(function() {
						contact_card.removeClass('animated fadeInUp')
					}, 1300)
				})
			}
		var handleActiveToggle = function() {
				$('#list-toggle .list-group a').click(function() {
					$('#list-toggle .list-group > a.active').removeClass('active');
					$(this).addClass('active')
				})
			}
		var handleBoxSortable = function() {
				$('.box-container').sortable({
					connectWith: '.box-container',
					items: '> .box',
					opacity: 0.8,
					revert: true,
					forceHelperSize: true,
					placeholder: 'box-placeholder',
					forcePlaceholderSize: true,
					tolerance: 'pointer'
				})
			}
		var handleGoToTop = function() {
				$('.footer-tools').on('click', '.go-top', function(e) {
					App.scrollTo();
					e.preventDefault()
				})
			}
		var handleNavbarFixedTop = function() {
				if (is_mobile && is_fixed_header) {
					$('#main-content').addClass('margin-top-100')
				}
				if (!(is_mobile) && is_fixed_header) {
					$('#main-content').removeClass('margin-top-100').addClass('margin-top-50')
				}
			}
		var handleDashFlotCharts = function() {}
		var handleVerticalChart = function() {
				if ($('.verticalChart')) {
					$('.singleBar').each(function() {
						var percent = $(this).find('.value span').html();
						$(this).find('.value').animate({
							height: percent
						}, 2000, function() {
							$(this).find('span').fadeIn()
						})
					})
				}
			}
		var handleThemeSkins = function() {
				var setSkin = function(color) {
						$('#skin-switcher').attr("href", "resources/css/themes/" + color + ".css");
						$.cookie('skin_color', color);
					}
				$('ul.skins > li a').click(function() {
					var color = $(this).data("skin");
					setSkin(color);
				});
				if ($.cookie('skin_color')) {
					setSkin($.cookie('skin_color'));
				}
			}
		var handleProfileEdit = function() {
				$(".datepicker").datepicker()
			}
		return {
			init: function() {
				if (App.isPage("index")) {
					handleDateTimePickers();
					handleSparkline();
					handleChat('chat-window');
					handleCalendar();
				}
				if (App.isPage("widgets_box")) {
					handleBoxSortable()
				}
				if (App.isPage("elements")) {
					handleBootbox();
					handleMagicSuggest();
					handleDateColorpicker();
					handleRaty();
					handleTimeAgo()
				}
				if (App.isPage("button_icons")) {
					handleStatefulButtons();
					handleToggle()
				}
				if (App.isPage("sliders_progress")) {
					handleSliders();
					handleProgress();
					handleKnobs()
				}
				if (App.isPage("treeview")) {
					handleTree()
				}
				if (App.isPage("nestable_lists")) {
					handleNestableLists()
				}
				if (App.isPage("simple_table")) {
					handleTablecloth()
				}
				if (App.isPage("dynamic_table")) {
					handleDataTables()
				}
				if (App.isPage("jqgrid_plugin")) {
					handleJqgrid()
				}
				if (App.isPage("forms")) {
					handleTypeahead();
					handleAutosize();
					handleCountable();
					handleSelect2();
					handleUniform();
					handleTimeAgo()
				}
				if (App.isPage("rich_text_editors")) {
					handleWysiwyg()
				}
				if (App.isPage("dropzone_file_upload")) {
					handleDropzone()
				}
				if (App.isPage("xcharts")) {
					handleXcharts()
				}
				if (App.isPage("others")) {
					handleGage();
					handleEasyPie();
					handleSparkline()
				}
				if (App.isPage("calendar")) {
					handleCalendar();
					handleUniform()
				}
				if (App.isPage("vector_maps")) {
					handleJqvmaps()
				}
				if (App.isPage("gallery")) {
					handleIsotope();
					handleHover();
					handleColorbox()
				}
				if (App.isPage("login")) {
					handleUniform()
				}
				if (App.isPage("wizards_validations")) {
					handleUniform()
				}
				if (App.isPage("login_bg")) {
					handleUniform();
					handleBackstretch()
				}
				if (App.isPage("chats")) {
					handleChat('chat-window');
					handleChat('chat-widget');
					initTimeAgo()
				}
				if (App.isPage("todo_timeline")) {
					handleTimeline()
				}
				if (App.isPage("address_book")) {
					handleSliderNav()
				}
				if (App.isPage("orders")) {
					initTimeAgo()
				}
				if (App.isPage("faq")) {
					handleActiveToggle()
				}
				if (App.isPage("user_profile")) {
					handleProfileSkillPie();
					handleSparkline();
					handleUniform();
					handleProfileEdit()
				}
				if (App.isPage("mini_sidebar")) {
					collapseSidebar()
				}
				if (App.isPage("fixed_header_sidebar")) {
					handleFixedSidebar()
				}
				checkLayout();
				handleSidebar();
				handleSidebarCollapse();
				handleSidebarAndContentHeight();
				responsiveSidebar();
				handleTeamView();
				handleHomePageTooltips();
				handleBoxTools();
				handleSlimScrolls();
				handlePopovers();
				handleMessenger();
				handleAlerts();
				handleCustomTabs();
				handleGoToTop();
				handleNavbarFixedTop();
				handleThemeSkins();
			},
			setPage: function(name) {
				currentPage = name
			},
			isPage: function(name) {
				return currentPage == name ? true : false
			},
			addResponsiveFunction: function(func) {
				responsiveFunctions.push(func)
			},
			scrollTo: function(el, offeset) {
				pos = (el && el.size() > 0) ? el.offset().top : 0;
				jQuery('html,body').animate({
					scrollTop: pos + (offeset ? offeset : 0)
				}, 'slow')
			},
			scrollTop: function() {
				App.scrollTo()
			},
			initUniform: function(els) {
				if (els) {
					jQuery(els).each(function() {
						if ($(this).parents(".checker").size() == 0) {
							$(this).show();
							$(this).uniform()
						}
					})
				} else {
					handleAllUniform()
				}
			},
			blockUI: function(el, loaderOnTop) {
				lastBlockedUI = el;
				jQuery(el).block({
					message: '<img src="'+path+'/resources/image/loaders/12.gif" align="absmiddle">',
					css: {
						border: 'none',
						padding: '2px',
						backgroundColor: 'none'
					},
					overlayCSS: {
						backgroundColor: '#000',
						opacity: 0.05,
						cursor: 'wait'
					}
				})
			},
			unblockUI: function(el) {
				jQuery(el).unblock({
					onUnblock: function() {
						jQuery(el).removeAttr("style")
					}
				})
			}
		}
	}();
(function(a, b) {
	a.fn.admin_tree = function(d) {
		var c = {
			"open-icon": "fa fa-folder-open",
			"close-icon": "fa fa-folder",
			selectable: true,
			"selected-icon": "fa fa-check",
			"unselected-icon": "tree-dot"
		};
		c = a.extend({}, c, d);
		this.each(function() {
			var e = a(this);
			e.html('<div class = "tree-folder" style="display:none;">				<div class="tree-folder-header">					<i class="' + c["close-icon"] + '"></i>					<div class="tree-folder-name"></div>				</div>				<div class="tree-folder-content"></div>				<div class="tree-loader" style="display:none"></div>			</div>			<div class="tree-item" style="display:none;">				' + (c["unselected-icon"] == null ? "" : '<i class="' + c["unselected-icon"] + '"></i>') + '				<div class="tree-item-name"></div>			</div>');
			e.addClass(c.selectable == true ? "tree-selectable" : "tree-unselectable");
			e.tree(c)
		});
		return this
	}
})(window.jQuery);
(function() {
	this.Theme = (function() {
		function Theme() {}
		Theme.colors = {
			white: "#FFFFFF",
			primary: "#5E87B0",
			red: "#D9534F",
			green: "#A8BC7B",
			blue: "#70AFC4",
			orange: "#F0AD4E",
			yellow: "#FCD76A",
			gray: "#6B787F",
			lightBlue: "#D4E5DE",
			purple: "#A696CE",
			pink: "#DB5E8C",
			dark_orange: "#F38630"
		};
		return Theme
	})()
})(window.jQuery);