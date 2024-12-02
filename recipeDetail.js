const API_KEY = CONFIG.API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

async function fetchRecipeDetails(recipeId) {
    try {
        const response = await fetch(`${BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`);
        const recipe = await response.json();
        displayRecipeDetails(recipe);
    } catch (error) {
        console.error('Error fetching recipe details: ', error);
    }
}

function displayRecipeDetails(recipe) {
    const recipeDetailContainer = document.querySelector('.recipe-detail');
    recipeDetailContainer.innerHTML = `
        <button class="back-button">Back</button>
        <div class="recipe-info">
            <img src="${recipe.image}" alt="${recipe.title}">
            <h2>${recipe.title}</h2>
            <p>${recipe.instructions}</p>
            <button class="favorite-button" data-id="${recipe.id}">Favorite</button>
        </div>
        <ul class="ingredients-list">
            ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
        </ul>
    `;

    document.querySelector('.back-button').addEventListener('click', () => {
        window.history.back();
    });

    document.querySelector('.favorite-button').addEventListener('click', toggleFavorite);
}

function toggleFavorite(event) {
    const button = event.target;
    const recipeId = button.getAttribute('data-id');

    if (button.textContent === 'Unfavorite') {
        button.textContent = 'Favorite';
    } else {
        button.textContent = 'Unfavorite';
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

document.addEventListener('DOMContentLoaded', () => {
    const recipeId = new URLSearchParams(window.location.search).get('id');
    if (recipeId) {
        fetchRecipeDetails(recipeId);
    }
});