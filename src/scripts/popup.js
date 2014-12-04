// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */

$('[data-translate]').each(function() {
  var el = $(this);
  var resourceName = el.data('translate');
  var resourceText = chrome.i18n.getMessage(resourceName);
  el.text(resourceText);
});
 
$.ajax('http://beshamel.fr/oauth/authorize?client_id=webapp&response_type=token&redirect_uri=urn:ietf:wg:oauth:2.0:oob').done(function(response){
	var access_token = response.access_token;
	
	$.ajax('http://api.beshamel.fr/?access_token='+access_token).done(function(response){
		$('#user-name').text(response.user.name);
		$('#user-image').attr('src', response.user.image);
	})
});

chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
	var tmp_a = document.createElement("a")
	tmp_a.href=tab[0].url;
	var tab_host = tmp_a.host;
	$('#recipe-source').text(tab_host);
});

chrome.tabs.executeScript(null, {
	file: 'scripts/libraries.js'
}, function() {
	chrome.tabs.executeScript(null, {
		file: 'scripts/content.js'
	});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request)
	{
		$('#recipe-name').text(request.name);
		console.log(request);
		if (request.servings !== null || request.servings !== undefined) { 
			$('#recipe-detail').append($('<li id="recipe-servings"></li>').text(chrome.i18n.getMessage("recipe_servings", String(request.servings)))); 
		}
		if (request.tasks) {
			$('#recipe-detail').append($('<li id="recipe-tasks"></li>').text(chrome.i18n.getMessage("recipe_tasks", String(request.tasks.length)))); 
		}
		if (request.equipments) { 
			$('#recipe-detail').append($('<li id="recipe-equipments"></li>').text(chrome.i18n.getMessage("recipe_equipments", String(request.equipments.length)))); 
		}
		if (request.ingredients) {
			$('#recipe-detail').append($('<li id="recipe-ingredients"></li>').text(chrome.i18n.getMessage("recipe_ingredients", String(request.ingredients.length)))); 
		}

		
		$('#recipe-detail').slideDown();
		
		// $('a#goto').attr('href', 'http://google.fr');
		$('a#goto').attr('href','http://beshamel.dev:8080/app#/recipes/create?'+$.param(request));
		$('a#goto').text(chrome.i18n.getMessage("import_recipe"));
	}
	else
	{
		$('#recipe-name').text(chrome.i18n.getMessage("recipe_not_found"));
	}
});