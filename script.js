 const searchButton = document.querySelector(".search-box button");
const searchInput = document.querySelector(".search-box input");
searchButton.addEventListener("click", function () {

    const movieName = searchInput.value;

    if (movieName === "") {
        alert("Please enter a movie name!");
        return;
    }

    const apiKey = "cc19153d";
    document.getElementById("movie-details").innerHTML = `
    <h2>🔄 Searching...</h2>
    <p>Finding your movie...</p>
`;

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${movieName}`)
        .then(response => response.json())
        .then(data => {

            if (data.Response === "False") {
                document.getElementById("movie-details").innerHTML = `
                    <h2>Movie Not Found 😢</h2>
                    <p>${data.Error}</p>
                `;
                return;
            }
                 document.body.classList.remove(
    "horror-theme",
    "action-theme",
    "horror-action-theme"
);

const isHorror = data.Genre.includes("Horror");
const isAction = data.Genre.includes("Action");

if (isHorror && isAction) {
    document.body.classList.add("horror-action-theme");
} else if (isHorror) {
    document.body.classList.add("horror-theme");
} else if (isAction) {
    document.body.classList.add("action-theme");
}  
                console.log(data.Genre);
            document.getElementById("movie-details").innerHTML = `
                <h2>${data.Title}</h2>
                <img src="${data.Poster}" width="200">
                <p>⭐ IMDb Rating: ${data.imdbRating}</p>
                <p>📅 Year: ${data.Year}</p>
                <p>🎭 Genre: ${data.Genre}</p>
                <p>🎭 Actors: ${data.Actors}</p>
                <p>📖 Plot: ${data.Plot}</p>
                <button onclick="addFavourite('${data.Title}')">
                 ❤️ Add to Favourites
                 </button>
            `;
        });
});

function showDetails(movieName, rating) {
    const details = document.getElementById("movie-details");

    details.innerHTML = `
        <h2>${movieName}</h2>
        <p>🎬 This is a great movie to explore!</p>
        <p>⭐ Rating: ${rating}</p>
        <p>📅 Release Year: 2025</p>
    `;
}
function addFavourite(movieName) {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

    if (!favourites.includes(movieName)) {
        favourites.push(movieName);
        localStorage.setItem("favourites", JSON.stringify(favourites));
        alert(movieName + " added to favourites ❤️");
    } else {
        alert(movieName + " is already in favourites!");
    }
}
function showFavourites() {
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];

    const details = document.getElementById("movie-details");

    if (favourites.length === 0) {
        details.innerHTML = `
            <h2>❤️ Favourites</h2>
            <p>No favourite movies yet.</p>
        `;
        return;
    }

    details.innerHTML = `
        <h2>❤️ My Favourites</h2>
        ${favourites.map(movie => `
    <p>
        🎬 ${movie}
        <button onclick="removeFavourite('${movie}')">❌ Remove</button>
    </p>
        `).join("")}
    `;
}
function removeFavourite(movieName) {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

    favourites = favourites.filter(movie => movie !== movieName);

    localStorage.setItem("favourites", JSON.stringify(favourites));

    showFavourites();
}