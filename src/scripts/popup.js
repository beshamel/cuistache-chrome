// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */


$.ajax('http://beshamel.fr/oauth/authorize?client_id=webapp&response_type=token&redirect_uri=urn:ietf:wg:oauth:2.0:oob').done(function(response){
	var access_token = response.access_token;
	
	$.ajax('http://api.beshamel.fr/?access_token='+access_token).done(function(response){
		$('#user-name').text(response.user.name);
		$('#user-image').attr('src', response.user.image);
	})
});

chrome.tabs.executeScript(null, {
	file: 'scripts/libraries.js'
}, function() {
	chrome.tabs.executeScript(null, {
		file: 'scripts/content.js'
	});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	$('.content').text(JSON.stringify(request));
	// $('a#goto').attr('href', 'http://google.fr');
	$('a#goto').attr('href','http://beshamel.dev:8080/app#/recipes/create?'+$.param(request));
});