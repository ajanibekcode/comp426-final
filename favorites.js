const FAVORITES_API_URL = 'http://localhost:3000/favorites';

async function fetchFavoriteRecipes() {
    try {
        const response = await fetch(FAVORITES_API_URL);
        const recipes = await response.json();

        const recipeGrid = document.querySelector('.recipe-grid');
        if (recipes.length > 0) {
            recipeGrid.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
        } else {
            recipeGrid.innerHTML = '<p>No favorite recipes found.</p>';
        }
    } catch (error) {
        console.error('Error fetching favorite recipes:', error);
        const recipeGrid = document.querySelector('.recipe-grid');
        recipeGrid.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    }
}

function createRecipeCard(recipe) {
    return `
        <div class="recipe-card">
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button class="quick-view" data-id="${recipe.id}">Quick View</button>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', fetchFavoriteRecipes);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.recipe-grid').addEventListener('click', event => {
        if (event.target.classList.contains('quick-view')) {
            const recipeId = event.target.getAttribute('data-id');
            window.location.href = `recipeDetail.html?id=${recipeId}`;
        }
    });
});