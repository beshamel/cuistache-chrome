//alert('OAUTH CALLBACK');
var oauth2_token = window.localStorage.getItem('oauth2_token');

function getToken(success_callback,fail_callback) {
  //alert('getToken:' + oauth2_token);
  var response = $.deparam.fragment(window.location.url);
  if (response.access_token)
  {
    oauth2_token = response.access_token;
    //alert('token found:'+oauth2_token)
    checkToken(success_callback, fail_callback);
  }
  else
  {
    fail_callback();
  }
}

function checkToken(success_callback,fail_callback) {
  //alert('checkToken:' + oauth2_token);
  
  if (!oauth2_token){
    if (fail_callback) {
      fail_callback();
    }
    return;
  }
  
  $.ajax('http://beshamel.dev:8080/oauth/token/info?access_token='+oauth2_token).done(function(response) {
    //alert('token valid');
    window.localStorage.setItem('oauth2_token', oauth2_token);
    if (success_callback) {
      success_callback(response);
    }
  }).fail(function() {
    //alert('token invalid');
    window.localStorage.removeItem('oauth2_token');
    oauth2_token = null;
    if (fail_callback) {
      fail_callback();
    }
  });
}


function init() {
  checkToken(function(response) {
    chrome.browserAction.setBadgeText({text:''})
    // token is valid... do nothing for the moment...
    // Maybe should implement refresh token
  }, function() {
      getToken(function(response) {
        chrome.browserAction.setBadgeText({text:''})
        window.close(); // close window if possible
      }, function() {
       chrome.browserAction.setBadgeText({text:'!'})
      });
  });
}

init();