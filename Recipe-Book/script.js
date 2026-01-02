let recipes = JSON.parse(localStorage.getItem("recipes")) || []
let editId = null

const form = document.getElementById("recipeForm")
const list = document.getElementById("recipeList")

form.addEventListener("submit", function (e) {
    e.preventDefault()

    const title = document.getElementById("title").value.trim()
    const ingredients = document.getElementById("ingredients").value.trim()
    const instructions = document.getElementById("instructions").value.trim()
    const cuisine = document.getElementById("cuisine").value

    if (title === "" || ingredients === "") {
        alert("Title and ingredients required")
        return
    }

    if (editId) {
        recipes = recipes.map(r =>
            r.id === editId ? { id: editId, title, ingredients, instructions, cuisine } : r
        )
        editId = null
    } else {
        recipes.push({
            id: Date.now(),
            title,
            ingredients,
            instructions,
            cuisine
        })
    }

    localStorage.setItem("recipes", JSON.stringify(recipes))
    form.reset()
    displayRecipes()
})

function displayRecipes() {
    const text = document.getElementById("searchText").value.toLowerCase()
    const cuisineFilter = document.getElementById("filterCuisine").value

    list.innerHTML = ""

    recipes
        .filter(r =>
            (r.title.toLowerCase().includes(text) ||
                r.ingredients.toLowerCase().includes(text)) &&
            (cuisineFilter === "" || r.cuisine === cuisineFilter)
        )
        .forEach(r => {
            const div = document.createElement("div")
            div.className = "recipe"

            div.innerHTML = `
        <h3>${r.title}</h3>
        <p><strong>Ingredients:</strong> ${r.ingredients}</p>
        <p><strong>Instructions:</strong> ${r.instructions}</p>
        <p><strong>Cuisine:</strong> ${r.cuisine}</p>
        <div class="actions">
          <button onclick="editRecipe(${r.id})">Edit</button>
          <button onclick="deleteRecipe(${r.id})">Delete</button>
        </div>
      `

            list.appendChild(div)
        })
}

function editRecipe(id) {
    const r = recipes.find(x => x.id === id)
    document.getElementById("title").value = r.title
    document.getElementById("ingredients").value = r.ingredients
    document.getElementById("instructions").value = r.instructions
    document.getElementById("cuisine").value = r.cuisine
    editId = id
}

function deleteRecipe(id) {
    recipes = recipes.filter(r => r.id !== id)
    localStorage.setItem("recipes", JSON.stringify(recipes))
    displayRecipes()
}

document.getElementById("searchText").addEventListener("input", displayRecipes)
document.getElementById("filterCuisine").addEventListener("change", displayRecipes)

displayRecipes()
