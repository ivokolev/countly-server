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
	
	plugins.register("/o/notifications",function(ob){
		
		var params = ob.params;
		var paths = ob.paths;	

		if (!params.qstring.api_key) {
            		common.returnMessage(params, 400, 'Missing parameter "api_key"');
            		return false;
        	}
	
		var carefor = {"list":0,"segments.[CLY]_action":0,"segments.[CLY]_view":0,"segments.formSubmit":0,"segments.linkClick":0};
			
		common.db.collection("events").find({_id:common.db.ObjectID(params.qstring.app_id)},carefor).toArray(function(err,result){
			common.returnOutput(params, result);
		});

	
	return true;
	});

	plugins.register("/i/notifications",function(ob){
		var params = ob.params;
		var paths = ob.paths;
		switch (paths[3]) {
				
			case 'create':
				console.log(params.qstring);				
				var col = "notifications"+params.qstring.app_id;
			
				var data = JSON.parse(params.qstring.args);
					
				console.log(col)
				console.log(data)
					
				common.db.collection(col).insertOne(data,function(err,item){
					console.log(item)
				});
				//console.log(params);
				//console.log(params.app_id);
				common.returnOutput(params, "ok");
			break;

			default:
                		common.returnMessage(params, 400, 'Invalid path');
                	break;
		}
	return true;
	});
	
	plugins.register("/i",function(ob){
	
		var cd = new Date();
        	var m = cd.getUTCMonth()+1;         
		
		var notificationsCollection = "notifications" + ob.params.app_id;
		
		common.db.collection(notificationsCollection).find({}).toArray(function(err,items){
		for (var a = 0; a < items.length; a++){
			var tCollection = "events" + crypto.createHash('sha1').update(items[a].name + ob.params.app_id).digest('hex');
			console.log("Looking in: "+items[a].name + "  " + tCollection);
			var charObj = {};
			charObj["d."+cd.getDate()+"."+items[a].svalue] = {$exists:true};

			console.log(charObj);
					
			var id = items[a].segment+"_"+cd.getUTCFullYear()+":"+m;
	
			common.db.collection(tCollection).findOne({$and:[{"_id":id},charObj]},{d:1},function(err,ev){
				console.log(ev)
				if (ev && ev["d"][cd.getDate()][items[a].svalue]["c"] == items[a].reach){	
					console.log('"Play" custom event sum with segmentation "'+items[a].name+'" = "'+items[a].svalue+'" reached '+items[a].reach+' for today');	
				}
			})

		}
		});

		// END "Play" custom event sum with segmentation "Character" = "John"

		
		// START Session Count reached 100
		common.db.collection("apps").find({}).toArray(function(err,items){
			
			items.map(function(item){
		
				var appid = item._id+"_"+cd.getUTCFullYear()+":"+m;
			
				var col = "users"+item._id;
	
				dkey = "d."+cd.getDate();

				var dk = {};
				dk[dkey] = 1;
				dk["_id"] = 0;
			
				common.db.collection("users").findOne({"_id":appid},dk,function(err,scount){
					if (scount && scount["d"][cd.getDate()] &&  scount["d"][cd.getDate()]["t"] == 100)
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
	
	return true;
	});
}(plugin));

module.exports = plugin
