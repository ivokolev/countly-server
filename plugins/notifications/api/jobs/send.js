'use strict';

const job = require('../../../../api/parts/jobs/job.js'),
    log = require('../../../../api/utils/log.js')('job:notifications');
var plugins = require('../../../pluginManager.js'),
    async = require("async"),
	notifications = require("../notifications.js");


class NotifJob extends job.Job {
	run(countlyDb,doneJob){
		notifications.send();
		//log.i("dddddd");
	return	doneJob();
	}
}
module.exports = NotifJob
