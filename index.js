var request = require('request');
request = request.defaults({jar: true});
var env = require('jsdom').env;
// var sys = require('sys')
var exec = require('child_process').exec;
var targetUrl = 'www.google.com';
var ipUrl = 'https://asm.ca.com/en/api/pingproxy.php';
var ips = {};

console.log('request get page...');
request.get('https://asm.ca.com/en/ping.php', function (e, r, body) {
	if (e) {throw e}
	console.log('parse html....');
	env(body,function (err, window) {
		var $ = require('jquery')(window);
		var vtt = $('#vtt').val();
		var vsectoken = $('#page_sectoken').val();
		console.log('post data to page....');
		request.post('https://asm.ca.com/en/ping.php', function (e, r, body) {
			if (e) {throw e}
			var uid = body.match(/uid=\w+/)[0].slice(4);
			var t = body.match(/t:\s\d+\.\d+/)[0].slice(3);
			console.log('find uid is ' + uid + ' and t is ' + t);
			console.log('start regist...');
			request.post(ipUrl + '?uid=' + uid, function (e, r, body) {
				for (var i = 1; i < 10; i++) {
					var tempUrl = ipUrl + '?uid=' + uid + '&host=' + targetUrl + '&v=' + i;
					request.get(tempUrl, function(e, r, body) {
						if (e) {throw e}
						var curObj = JSON.parse(body);
						for (cuO in curObj.r) {
							if(curObj.r[cuO].status == 'finished'){
								if(curObj.r[cuO].result){
									var curIp = curObj.r[cuO].result.ip;
									if (ips[curIp] == undefined) {
										ips[curIp] = true;
										// console.log('start ping test...')
										exec("ping " + curIp, function(error, stdout, stderr) {
											if (stdout.match(/\d+ms/)) {
												console.log(curIp + ':' + stdout.match(/\d+ms/)[0])
											}
										});
									}
								}
							}
						}
					})
				}
			}).form({
				"host":targetUrl,
				"t":t
			})
		}).form({
			"vtt":vtt,
			"varghost":targetUrl,
			"vhost":"_",
			"vaction":"ping",
			"ping":"Start",
			"vsectoken":vsectoken
		})
	})
})