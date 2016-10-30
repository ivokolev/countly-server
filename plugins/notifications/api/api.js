var plugin = {},
    common = require('../../../api/utils/common.js'),
    crypto = require('crypto'),
    //moment = require("moment"),
    //log = common.log('flows:api'),
    plugins = require('../../pluginManager.js');

(function (plugin) {
	
	plugins.register('/master', function(ob){
        	setTimeout(() => {
			require('../../../api/parts/jobs').job('notifications:send').replace().schedule("every 1 day");
		},3000);
    	return true
	});

	plugins.register("/i",function(ob){
	
		var cd = new Date();
        	var m = cd.getUTCMonth()+1;         
	
		// START "Play" custom event sum with segmentation "Character" = "John"
		var PlayCollection = "events" + crypto.createHash('sha1').update("Play" + ob.params.app_id).digest('hex');

		var charObj = {}
		charObj["d."+cd.getDate()+".John"] = {$exists:true}
	
		var id = "Character_"+cd.getUTCFullYear()+":"+m;
	
		common.db.collection(PlayCollection).findOne({$and:[{"_id":id},charObj]},{d:1},function(err,item){
			if (item && item["d"][cd.getDate()]["John"]["c"] == 10){	
				console.log('"Play" custom event sum with segmentation "Character" = "John" reached 10 for today');	
			}
		})

		// END "Play" custom event sum with segmentation "Character" = "John"

		
		// START Session Count reached 100
		common.db.collection("apps").find({}).toArray(function(err,items){
			
			items.map(function(item){
		
				var appid = item._id+"_"+cd.getUTCFullYear()+":"+m;
			
				var col = "users"+item._id;
	
				dkey = "d."+cd.getDate();

				var dk = {}
				dk[dkey] = 1;
				dk["_id"] = 0;
			
				common.db.collection("users").findOne({"_id":appid},dk,function(err,scount){
					if (scount && scount["d"][cd.getDate()]["t"] == 100)
						console.log("APP ID: "+ item._id + " Session Count reached " + scount["d"][cd.getDate()]["t"]);		
				})
			
			});
		
		});
		// END Session Count reached 100

        	// START BEGIN SESSION iOS		
		if ("begin_session" in ob.params.qstring){
			//console.log("BEGIN SESSION")
			if (ob.params.qstring.metrics["_os"] == "iOS")
				console.log("PLATFORM: ",ob.params.qstring.metrics["_os"]);
		}
		// END BEGIN SESSION IOS
	
	return true
	});
}(plugin));

module.exports = plugin
