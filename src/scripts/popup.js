var api_root = 'http://api.beshamel.fr';
var authorize_url = 'http://beshamel.fr/oauth/authorize';
var app_url = 'http://beshamel.fr/app';
/*
var api_root = 'http://api.beshamel.dev:8080';
var authorize_url = 'http://beshamel.dev:8080/oauth/authorize';
var app_url = 'http://beshamel.dev:8080/app';
*/

$('[data-translate]').each(function() {
  var el = $(this);
  var resourceName = el.data('translate');
  var resourceText = chrome.i18n.getMessage(resourceName);
  el.text(resourceText);
});
 

var oauth2_token = window.localStorage.getItem('oauth2_token');

var payload = {
  client_id: 'b9eb0f669953a4b88bacfdd448fa966438370467476b5fa6e2615493afd214bd',
  redirect_uri: 'chrome-extension://nhdifmkahbmcgefnalnlcpjhikgnaglj/oauth_callback.html',
  response_type: 'token'
}

function authorize() {
  var oauth_window=window.open(authorize_url+'?'+$.param(payload), '_blank');
}

$.ajax(api_root+'?access_token='+oauth2_token).done(function(response){
  if (response.user)
  {
    $('#user-name').text(response.user.name);
    $('#user-image').attr('src', response.user.image);
  }
  else
  {
    $('#user-name').text(chrome.i18n.getMessage("not_connected"));
    $('#user-image').hide();
    $('#connect').attr('href',authorize_url+'?'+$.param(payload));
    $('#connect').removeClass('hidden');
  }
}).fail(function() {
  $('#user-name').text(chrome.i18n.getMessage("not_connected"));
  $('#user-image').hide();
  $('#connect').attr('href',authorize_url+'?'+$.param(payload));
  $('#connect').removeClass('hidden');
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
    $('a#goto').attr('href', app_url+'#/recipes/create?'+$.param(request));
    $('a#goto').text(chrome.i18n.getMessage("import_recipe"));
  }
  else
  {
    $('#recipe-name').text(chrome.i18n.getMessage("recipe_not_found"));
  }
});