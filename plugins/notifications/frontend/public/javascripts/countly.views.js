window.NotificationsView = countlyView.extend({
        initialize:function () {},
        beforeRender: function() {
                if(this.template)
                        return $.when(countlyNotifications.initialize()).then(function () {});
                else{
                        var self = this;
                        return $.when($.get(countlyGlobal["path"]+'/notifications/templates/notifications.html', function(src){
                                self.template = Handlebars.compile(src);
                        	console.log(src);
			}), countlyNotifications.initialize()).then(function () {});
                }
      },
	renderCommon:function (isRefresh) {
		this.templateData = {
            "page-title": "Notifications" //jQuery.i18n.map["systemlogs.title"]
        };
		if (!isRefresh) {
            		$(this.el).html(this.template(this.templateData));
			
			$("#add-event").on("click",function(){
				if ($("#create-event-row").is(":visible")){
					$("#create-event-row").slideUp();
				}else{
					$("#create-event-row").slideDown();
				}
			});

			$(".add-notification").on("click",function(){
				var data = {},
				    eventDetails = $(".notifications:visible");

				data.name = eventDetails.find("input[name=eventname]").val();
				data.segment = eventDetails.find("input[name=segment]").val();
				data.svalue = eventDetails.find("input[name=svalue]").val();
				data.reach = eventDetails.find("input[name=reach]").val();
				console.log(data);
						
				$.when(countlyNotifications.createEvent(data)).then(function(data){
					if(data.result == "Success"){
                        			app.activeView.render();
                    			}
                    			else{
                        			CountlyHelpers.alert(data.result, "red");
                    			}
				});
			});
		}
	},
	refresh:function () {

	}

});
app.notificationsView = new NotificationsView();

if(countlyGlobal["member"].global_admin || countlyGlobal["member"]["admin_of"].length){

console.log(countlyGlobal);
    app.route('/manage/notifications', 'notifications', function () {
        console.log(this.notificationsView);
	this.renderWhenReady(this.notificationsView);
    });
}

$( document ).ready(function() {
	

        if(countlyGlobal["member"].global_admin || countlyGlobal["member"]["admin_of"].length){
        var menu = '<a href="#/manage/notifications" class="item">'+
            '<div class="logo-icon fa fa-envelope"></div>'+
            '<div class="text" data-localize="notifications.title"></div>'+
        '</a>';
        if($('#management-submenu .help-toggle').length)
            $('#management-submenu .help-toggle').before(menu);
	}

});
