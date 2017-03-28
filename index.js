var request = require('request');
var env = require('jsdom').env;

request.get('https://asm.ca.com/en/ping.php', function (e, r, body) {
	env(body,function (err, window) {
		var $ = require('jquery')(window);
		var vtt = $('#vtt').val();
		var vsectoken = $('#vsectoken').val();
		console.log(vtt,vsectoken,1111111111111111111111111);

		request.post('https://asm.ca.com/en/ping.php', function (e, r, body) {
			if (e) {throw e}
			console.log(body)
		}).form({
			"vtt":vtt,
			"varghost":"www.baidu.com",
			"vhost":"_",
			"vaction":"ping",
			"ping":"Start",
			"vsectoken":vsectoken
		})
	})
})