// Marmiton.org Recipe Interpretor
recipe_interpretors.push(
{
  matches: /marmiton.org/,
  getRecipe: function(){
    var recipe = {};
    
    // Recipe Name
    recipe.name=$('h1.m_title').text().trim();
    
    // Ingredients List
    var ingredients_div = $('.m_content_recette_ingredients').clone();
    var ingredient_title = ingredients_div.find('span:first');
    
    // Servings (in ingredients title)
    servings_matches = ingredient_title.text().match(/\(pour ([0-9]+) personnes*\)/i)
    if (servings_matches && servings_matches.length) {
      recipe.servings = parseInt(servings_matches[1]);
    }
    ingredient_title.remove();
    recipe.ingredients = ingredients_div.innerText().split("\n").map(function(t) {return t.replace(/^\s*([^0-9 ]\s)*/, '').replace(/\([^)]+\)/, '').trim();}).filter(function(t){return t;});
    
    // Tasks List
    var tasks_div = $('.m_content_recette_todo').clone();
    tasks_div.find('h4').remove();
    tasks_div.find('.m_content_recette_ps').remove();
    recipe.tasks = tasks_div.innerText().split("\n").map(function(t){return t.trim()}).filter(function(t){return t;});
    
    // Source URL
    recipe.source=window.location.href;
    
    return recipe;
  }
});