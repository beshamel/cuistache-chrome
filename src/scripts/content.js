// JQUERY Innertext
(function($){$.fn.innerText = function(msg) {if (msg) {if (document.body.innerText) {for (var i in this) {this[i].innerText = msg;}} else {for (var i in this) {this[i].innerHTML.replace(/&amp;lt;br&amp;gt;/gi,"n").replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, "");}}return this;} else {if (document.body.innerText) {return this[0].innerText;} else {return this[0].innerHTML.replace(/&amp;lt;br&amp;gt;/gi,"n").replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, "");}}};})(jQuery);

(function(){

var recipe_interpretors = [];

//= require_tree ./interpretors

function getRecipe() {
  for (var i = 0; i < recipe_interpretors.length; ++i)
  {
    if (window.location.host.match(recipe_interpretors[i].matches))
    {
      return recipe_interpretors[i].getRecipe();
    }
  }
  return null;
};

recipe = getRecipe();

if (!recipe) recipe = 0;

chrome.runtime.sendMessage(null, recipe);

})();