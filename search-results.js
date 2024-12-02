const API_KEY = CONFIG.API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

const params = new URLSearchParams(window.location.search);
const query = params.get('query');

const queryElement = document.getElementById('query');
queryElement.textContent = query;

async function fetchSearchResults(query) {
  try {
    const response = await fetch(`${BASE_URL}/complexSearch?query=${query}&number=10&apiKey=${API_KEY}`);
    const data = await response.json();
    const recipes = data.results;

    const recipeGrid = document.querySelector('.recipe-grid');
    if (recipes.length > 0) {
      recipeGrid.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
    } else {
      recipeGrid.innerHTML = `<p>No recipes found for "${query}".</p>`;
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
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

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const newQuery = searchInput.value.trim();
  if (newQuery) {
    window.location.href = `search-results.html?query=${encodeURIComponent(newQuery)}`;
  }
});

const backButton = document.getElementById('back-button');

backButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});

if (query) {
  fetchSearchResults(query);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.recipe-grid').addEventListener('click', event => {
      if (event.target.classList.contains('quick-view')) {
          const recipeId = event.target.getAttribute('data-id');
          window.location.href = `recipeDetail.html?id=${recipeId}`;
      }
  });
});