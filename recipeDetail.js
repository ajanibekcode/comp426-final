const API_KEY = CONFIG.API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';
const FAVORITES_API_URL = 'http://localhost:3000/favorites';

async function fetchRecipeDetails(recipeId) {
    try {
        const response = await fetch(`${BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`);
        const recipe = await response.json();
        const favResponse = await fetch(`${FAVORITES_API_URL}/${recipeId}`);
        const isFavorite = favResponse.ok;
        displayRecipeDetails(recipe, isFavorite);
    } catch (error) {
        console.error('Error fetching recipe details: ', error);
    }
}

function displayRecipeDetails(recipe, isFavorite) {
    const recipeDetailContainer = document.querySelector('.recipe-detail');
    recipeDetailContainer.innerHTML = `
        <button class="back-button">Back</button>
        <div class="recipe-info">
            <img src="${recipe.image}" alt="${recipe.title}">
            <h2>${recipe.title}</h2>
            <p>${recipe.instructions}</p>
            <button class="favorite-button" data-id="${recipe.id}">${isFavorite ? 'Unfavorite' : 'Favorite'}</button>
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

async function toggleFavorite(event) {
    const button = event.target;
    const recipeId = button.getAttribute('data-id');
    const recipeTitle = document.querySelector('.recipe-info h2').textContent;
    const recipeImage = document.querySelector('.recipe-info img').src;

    try {
        const response = await fetch(`${FAVORITES_API_URL}/${recipeId}`);
        const isFavorite = response.ok;

        if (isFavorite) {
            await fetch(`${FAVORITES_API_URL}/${recipeId}`, { method: 'DELETE' });
            button.textContent = 'Favorite';
        } else {
            await fetch(FAVORITES_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: recipeId, title: recipeTitle, image: recipeImage })
            });
            button.textContent = 'Unfavorite';
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const recipeId = new URLSearchParams(window.location.search).get('id');
    if (recipeId) {
        fetchRecipeDetails(recipeId);
    }
});