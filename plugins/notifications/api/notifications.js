var notifications = {},
	 common = require('../../../api/utils/common.js'),
	 moment = require("moment"); 

(function (notifications) {

	notifications.send = function(){
		
		var cd = new Date();
                var m = cd.getUTCMonth()+1;		

		common.db.collection("apps").find({}).toArray(function(err,items){

                items.map(function(item){

                        var ucol = "app_users"+item._id;

                        var last = new Date(cd.getTime() - (7 * 24 * 60 * 60*1000)).getTime() / 1000 | 0;

                        common.db.collection(ucol).find({"ls":{$lt:last}}).toArray(function(err,users){
                                if (users && users.length > 0){
                                        console.log("APP ID: "+ item._id + ". Users who didn't have a session for more than 7 days");
                                        console.log(users);
                                }
                        });

                        common.db.collection(ucol).find({"sc":{$gte:10}}).toArray(function(err,users){
                                if (users && users.length > 0){
                                        console.log("APP ID: "+ item._id + ". Users who had more than 10 sessions");
                                        console.log(users);
                                }
                        });

		})
		})
				
	};

}(notifications));
module.exports = notifications
