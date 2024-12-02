const searchButton = document.querySelector("nav .desktop-nav .link-search");
const closeButton = document.querySelector(".search-container .link-close");
const desktopNav = document.querySelector(".desktop-nav");
const searchContainer = document.querySelector(".search-container");
const overlay = document.querySelector(".overlay");

searchButton.addEventListener("click", () => {
    desktopNav.classList.add("hide");
    searchContainer.classList.remove("hide");
    overlay.classList.add("show");
});

closeButton.addEventListener("click", () => {
    desktopNav.classList.remove("hide");
    searchContainer.classList.add("hide");
    overlay.classList.remove("show");
});

overlay.addEventListener("click", () => {
    desktopNav.classList.remove("hide");
    searchContainer.classList.add("hide");
    overlay.classList.remove("show");
});

// Mobile Version

const menuIconContainer = document.querySelector("nav .menu-icon-container");
const navContainer = document.querySelector(".nav-container");

menuIconContainer.addEventListener("click", () => {
    navContainer.classList.toggle("active");
});

const searchBar = document.querySelector(".mobile-search-container .search-bar");
const nav = document.querySelector(".nav-container nav");
const searchInput = document.querySelector(".mobile-search-container input");
const cancelBtn = document.querySelector(".mobile-search-container .cancel-btn");

searchInput.addEventListener("click", () => {
    searchBar.classList.add("active");
    nav.classList.add("move-up");
    desktopNav.classList.add("move-down");
});

cancelBtn.addEventListener("click", () => {
    searchBar.classList.remove("active");
    nav.classList.remove("move-up");
    desktopNav.classList.remove("move-down");
});

// API Key for Spoonacular API
const API_KEY = CONFIG.API_KEY; 
const BASE_URL = 'https://api.spoonacular.com/recipes';

async function fetchFeaturedRecipes() {
    try {
        const response = await fetch(`${BASE_URL}/random?&number=5&apiKey=${API_KEY}`);
        const data = await response.json();
        const recipes = data.recipes;

        const recipeGrid = document.querySelector('.recipe-grid');
        recipeGrid.innerHTML = recipes
            .map(recipe => createRecipeCard(recipe))
            .join('');
    } catch (error) {
        console.error('something wrong with fetchFeaturedRecipes: ', error);
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


function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

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
        recipeGrid.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    }
}

function handleSearchFormSubmit(event, inputField) {
    event.preventDefault(); 
    const query = inputField.value.trim(); 

    if (query) {
        window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
    }
}

// Select forms for both search
const desktopSearchForm = document.querySelector('.search-bar form');
const mobileSearchForm = document.querySelector('.mobile-search-container .search-bar form'); 

const desktopSearchInputField = document.querySelector('.search-bar input');
const mobileSearchInputField = document.querySelector('.mobile-search-container .search-bar input');

if (desktopSearchForm) {
    desktopSearchForm.addEventListener('submit', (event) => handleSearchFormSubmit(event, desktopSearchInputField));
}

if (mobileSearchForm) {
    mobileSearchForm.addEventListener('submit', (event) => handleSearchFormSubmit(event, mobileSearchInputField));
}

if (window.location.pathname.includes('search-results.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const query = getQueryParam('query'); 

        if (query) {
            document.getElementById('query').textContent = query; 
            fetchSearchResults(query); 
        } else {
            document.querySelector('.recipe-grid').innerHTML = '<p>No search query provided.</p>';
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchFeaturedRecipes);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.recipe-grid').addEventListener('click', event => {
        if (event.target.classList.contains('quick-view')) {
            const recipeId = event.target.getAttribute('data-id');
            window.location.href = `recipeDetail.html?id=${recipeId}`;
        }
    });
});
