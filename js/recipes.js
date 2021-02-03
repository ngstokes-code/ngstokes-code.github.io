let application_id = "699e029b",
   api_key = "ab4351cc5633793a3a988e97472b6735",
   form = document.querySelector("form"), 
   all_recipes = document.querySelector(".all-recipes"),
   footer = document.querySelector("footer"),
   search_input = "",
   current_page = 0,
   recipe_count = 0;
let hitsArray;

form.addEventListener("submit", (event) => {
   event.preventDefault();
   search_input = event.target.querySelector("input").value;
   url = "https://api.edamam.com/search?q=" + search_input + "&app_id=" + application_id + "&app_key=" + api_key + "&to=100"; /* 100 is the max number of recipes the API will return in a single call. */
   /* all available paramters + documentation here: https://developer.edamam.com/edamam-docs-recipe-api */
   getRecipes();
});

/* since we're calling to an API, we need an async function to await for an answer. */
let getRecipes = async () => {
   let results = await (await fetch(url)).json();  /* await response from API url; await json-ified results  */
   recipe_count = results.count;
   hitsArray = results.hits;
   current_page = 0; // reset page to 0 on new search
   displayFirstPage(hitsArray);                             /* hits is the returned recipe array from the API call. */ 

   console.log("******************************\nUser searched for: \'" + search_input + "\'\n" + results.count + " unique recipes returned.\nFull response from API call: ");
   console.log(results);   /* (+ results does not work, must be printed separately) */
   console.log("******************************\n"); 
};

   
/*  (ONLY FIRST 12) displays the contents of each recipe, specific to each returned recipe. 
   The hits array returns quite a bit of information. Put 'console.log(results);'in getRecipes() 
   and expand the hits array in console to see the var names and information returned.  */ 
function displayFirstPage(hits_array) { 
   let recipe = '',
       next_page = '',
       length = 0;
   if(hits_array.length <= 12) length = hits_array.length; else length = 12;
   if(hits_array.length == 0){ /* if there are no recipes returned by the API, tell the user theres no results. Else display results. */ 
       recipe +=               /* backticks (`) for templated strings, ${} to insert a variable/expression */
       `<div class="no-results">
           <p class="text-danger">Your search '${search_input}' returned 0 recipes</p>
       </div>`
       all_recipes.innerHTML = recipe;
       footer.innerHTML = next_page;
       //content.innerHTML += next_page;
   } else {
       for(let i = 0; i < length; i++){
           recipe +=
           `<div class="recipe">
               <img src="${hits_array[i].recipe.image}">
               <div class="recipe-content">
                   <h1 class="recipe-name">${hits_array[i].recipe.label}</h1>
                   <h1 class="recipe-info">Calories: ${Math.trunc(hits_array[i].recipe.calories + 0.5)}</h1>
                   <a href="${hits_array[i].recipe.url}" target="_blank" type="button" class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Click here to view this recipe!">Instructions</a>
               </div>
           </div>`
           /* "<div class=\"recipe\"><img src=\"" + hits_array[i].recipe.image + "><div class=\"recipe-content\"><h1 class=\"recipe-name\">" + hits_array[i].recipe.label + "</h1><h1 class=\"recipe-info\">Calories: " +  Math.trunc(hits_array[i].recipe.calories + 0.5) + "</h1><a href=\"" + hits_array[i].recipe.url + " target=\"_blank\" type=\"button\" class=\"btn btn-primary\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Click here to view this recipe!\">Instructions</a>" */
       }
       if(hits_array.length > 12){ /* if the first page cannot be filled, do not display a next page button. */ 
           next_page += 
           `
           <div class="btn-group" style="width:100%">
               <button type="button" class="btn btn-primary" onclick="nextPage()">Next Page</button>
           </div>
           `
       }
       all_recipes.innerHTML = recipe; /* set the html for the 'all-recipes' div to the above string for each recipe in the hits array. */ 
       footer.innerHTML = next_page;
   }
}

/* Display the next page. There are at most 12 entries to a page.  */
function displayNextPage(hits_array, from, to){ 
   let recipe = '',
       next_page = '';
       prev_page = 
       `
       <div class="btn-group" style="width:100%">
           <button type="button" class="btn btn-primary" onclick="prevPage()">Previous Page</button>
       </div>
       `
   for(let i = from; i < to; i++){
       recipe +=
       `<div class="recipe">
           <img src="${hits_array[i].recipe.image}">
           <div class="recipe-content">
               <h1 class="recipe-name">${hits_array[i].recipe.label}</h1>
               <h1 class="recipe-info">Calories: ${Math.trunc(hits_array[i].recipe.calories + 0.5)}</h1>
               <a href="${hits_array[i].recipe.url}" target="_blank" type="button" class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Click here to view this recipe!">Instructions</a>
           </div>
       </div>`
   }
   all_recipes.innerHTML = recipe;
   if(hits_array.length > to){     /* if there are more entries, put a next page button, else don't display a next page button. */ 
       next_page += 
       `
       <div class="btn-group" style="width:100%">
           <button type="button" class="btn btn-primary mb-5" onclick="nextPage()">Next Page</button>
       </div>
       `
   }
   if(to <= 12){
       prev_page = '';
   }
   footer.innerHTML = next_page;   /* place or remove the next page button. */
   footer.innerHTML += prev_page;
}

function nextPage() {
   current_page += 1;
   let from = current_page * 12,
       to = (current_page + 1) * 12,
       length = hitsArray.length;
   if(from < length && to <= length){          /* Display up to a number less than the total number of recipes. */
       displayNextPage(hitsArray, from, to);
       console.log("Current Page: " + current_page + "From: " + from + ", To: " + to);
   } else if(from < length && to > length){    /* Don't display a number greater than the total number of recipes. */ 
       displayNextPage(hitsArray, from, length);
       console.log("Current Page: " + current_page + "From: " + from + ", To: " + length);
   } else alert("this alert should never be executed.");
}

function prevPage(){
    current_page -= 1;
    let from = current_page * 12,
    to = (current_page + 1) * 12,
    length = hitsArray.length;
    if(from >= 0 && to <= length){          /* Display up to a number less than the total number of recipes. */
        displayNextPage(hitsArray, from, to);
        console.log("Current Page: " + current_page + "From: " + from + ", To: " + to);
    } else if(from < length && to > length){    /* Don't display a number greater than the total number of recipes. */ 
        displayNextPage(hitsArray, from, length);
        console.log("Current Page: " + current_page + "From: " + from + ", To: " + length);
    } else alert("this alert should never be executed.");
}

