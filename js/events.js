$(function () {

	// Loads Facebook API	
	$.ajaxSetup({
		cache: true
	});
	$.getScript('//connect.facebook.net/en_US/sdk.js', function () {

		// Load FB App	  
		FB.init({
			appId: '1627643974139060',
			version: 'v2.4',
			status: true,
			xfbml: true,
			cookie: true,
			oauth: true
		});

		$('#loginbutton,#feedbutton').removeAttr('disabled');
		FB.getLoginStatus(function (response) {
			if (response.status === 'connected') { // Logged in and authorized.
				FB.api(
					"/me",
					function (response) {
						console.log(response.name + ' is logged in.');
					}
				);
				fillEvents(response.authResponse.accessToken);
			} else { // Nuthin'
				console.log('No accessToken found.');
				$('#events').html('<header class="major">' + '<h2>Upcoming events.</h2>' + '<p>You need to be logged in to Facebook to view any future events.</p>' + '<ul class="actions vertical"><li><a href="#events" onclick="getToken()" class="button">Log In</a></li></ul>' + '</header>');
			}
		});

	});
});

function getToken() {
	FB.login(function (response) {
		if (response.authResponse) {
			FB.api("/me", function (response) {
				console.log(response.name + ' has logged in.');
			});
			fillEvents(response.authResponse.accessToken);
		} else {
			//user hit cancel button
			console.log('User cancelled login or did not fully authorize.')
		}
	}, {
		auth_type: 'rerequest'
	});
}

function fillEvents(accessToken) {
	FB.api('dukebmes/events?fields=cover,description,name,end_time,start_time,place',
		function (response) {
			var events = response.data;
			var eventsLength = events.length;
			var eventString = '<header class="major"><h2>Upcoming Events.</h2></header>'
			if (eventsLength < 1) {
				eventString += '<p>There are no upcoming events.</p>';
			};
			for (i = 0; i < events.length; i++) {
				var event = events[i]
				var start_time = moment(event.start_time);
				if (start_time.diff(moment(), 'days') >= 0) {
					// header
					eventString += '<section class="spotlight"><div class="image"><img src="' + event.cover.source + '" alt="" /></div><div class="content">';

					// Name
					eventString += '<h3>' + event.name + '</h3>';

					// Desc
					eventString += '<p>' + event.description + '</p>';

					eventString += '<div class="event_details">';

					// Time
					var start_time = moment(event.start_time);
					eventString += '<p><strong>When: </strong>' + start_time.calendar() + '</p>';

					// Place
					var place = event.place;
					eventString += '<p><strong>Where: </strong>' + place.name + '</p>';

					// footer
					eventString += '<a href="http://www.facebook.com/events/' + event.id + '/">View on Facebook</a></div></div></section>';
				} else if (eventsLength > 0) {
					eventsLength--;
				};
			}
			if (eventsLength > 0) {
				$('#events').html(eventString);
			} else {
				$('#events').html('<header class="major">' + '<h2>Upcoming events.</h2>' + '<p>There are no upcoming events.</p>' + '</header>');
			}
		});
}
