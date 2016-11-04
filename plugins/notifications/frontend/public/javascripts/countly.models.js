(function (countlyNotifications, $, undefined) {
	var _data = {};
	countlyNotifications.initialize = function (id) {
	
		return $.ajax({
            type:"GET",
            url:countlyCommon.API_PARTS.data.r+"/notifications/events",
            data:{
                "api_key":countlyGlobal.member.api_key,
                "app_id":countlyCommon.ACTIVE_APP_ID,
                "method":"all"
            },
            success:function (json) {
                _data = json;
            	console.log(_data);
		}
        });

	};
	countlyNotifications.createEvent = function(data){
		return $.ajax({
            		type:"GET",
            		url:countlyCommon.API_PARTS.data.w+"/notifications/create",
			data:{
			 	"api_key":countlyGlobal.member.api_key,
                                "app_id":countlyCommon.ACTIVE_APP_ID,
				args:JSON.stringify(data)
			}
		});
	};

}(window.countlyNotifications = window.countlyNotifications || {}, jQuery));

