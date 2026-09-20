const searchButton = document.querySelector(".search-box button");
const searchInput = document.querySelector(".search-box input");

searchButton.addEventListener("click", async function () {

    const movieName = searchInput.value.trim();

    if (movieName === "") {
        alert("Please enter a movie name!");
        return;
    }

    document.getElementById("movie-details").innerHTML = `
        <h2>🔄 Searching...</h2>
        <p>Finding your movie...</p>
    `;

    document.getElementById("watch-options").innerHTML = "";

    try {

        const response = await fetch(
            `/api/movie?title=${encodeURIComponent(movieName)}`
        );

        const result = await response.json();

        if (!response.ok || !result.movie) {
            document.getElementById("movie-details").innerHTML = `
                <h2>Movie Not Found 😢</h2>
                <p>${result.Error || result.error || "Movie could not be found."}</p>
            `;
            return;
        }

        const data = result.movie;

        document.body.classList.remove(
            "horror-theme",
            "action-theme",
            "horror-action-theme"
        );

        const genre = data.Genre || "";

        const isHorror = genre.includes("Horror");
        const isAction = genre.includes("Action");

        if (isHorror && isAction) {
            document.body.classList.add("horror-action-theme");
        } else if (isHorror) {
            document.body.classList.add("horror-theme");
        } else if (isAction) {
            document.body.classList.add("action-theme");
        }

        document.getElementById("movie-details").innerHTML = `
            <h2>${data.Title}</h2>

            ${
                data.Poster && data.Poster !== "N/A"
                ? `<img src="${data.Poster}" width="200" alt="${data.Title}">`
                : `<div class="movie-poster">🎬</div>`
            }

            <p>⭐ IMDb Rating: ${data.imdbRating}</p>
            <p>📅 Year: ${data.Year}</p>
            <p>🎭 Genre: ${data.Genre}</p>
            <p>🎭 Actors: ${data.Actors}</p>
            <p>📖 Plot: ${data.Plot}</p>

            <button onclick="addFavourite('${data.Title.replace(/'/g, "\\'")}')">
                ❤️ Add to Favourites
            </button>
        `;

        showWatchProviders(result.providers);

    } catch (error) {

        console.error("Movie search error:", error);

        document.getElementById("movie-details").innerHTML = `
            <h2>⚠️ Something went wrong</h2>
            <p>Please try again.</p>
        `;
    }
});


function showWatchProviders(india) {

    const watchOptions = document.getElementById("watch-options");

    if (!india) {
        watchOptions.innerHTML = `
            <h2>🎬 Where to Watch in India</h2>
            <div class="watch-card">
                <p>😔 No legal viewing information is currently listed for India.</p>
            </div>
        `;
        return;
    }

    let providers = [];

    if (india.free) {
        india.free.forEach(provider => {
            providers.push({
                name: provider.provider_name,
                type: "🆓 Free",
                logo: provider.logo_path
            });
        });
    }

    if (india.ads) {
        india.ads.forEach(provider => {
            providers.push({
                name: provider.provider_name,
                type: "📺 Free with Ads",
                logo: provider.logo_path
            });
        });
    }

    if (india.flatrate) {
        india.flatrate.forEach(provider => {
            providers.push({
                name: provider.provider_name,
                type: "📺 Subscription",
                logo: provider.logo_path
            });
        });
    }

    if (india.rent) {
        india.rent.forEach(provider => {
            providers.push({
                name: provider.provider_name,
                type: "💰 Rent",
                logo: provider.logo_path
            });
        });
    }

    if (india.buy) {
        india.buy.forEach(provider => {
            providers.push({
                name: provider.provider_name,
                type: "🛒 Buy",
                logo: provider.logo_path
            });
        });
    }

    if (providers.length === 0) {
        watchOptions.innerHTML = `
            <h2>🎬 Where to Watch in India</h2>
            <div class="watch-card">
                <p>😔 No viewing options are currently listed.</p>
            </div>
        `;
        return;
    }

    providers = providers.filter(
        (provider, index, array) =>
            index === array.findIndex(
                p =>
                    p.name === provider.name &&
                    p.type === provider.type
            )
    );

    watchOptions.innerHTML = `
        <h2>🎬 Where to Watch in India</h2>

        ${providers.map(provider => `
            <div class="watch-card">

                <h3>${provider.type}</h3>

                ${
                    provider.logo
                    ? `
                    <img
                        src="https://image.tmdb.org/t/p/w92${provider.logo}"
                        alt="${provider.name}"
                        width="60"
                    >
                    `
                    : ""
                }

                <p>
                    📺 Platform:
                    <strong>${provider.name}</strong>
                </p>

                <p>
                    🎞️ Quality:
                    Information not specified
                </p>

                ${
                    india.link
                    ? `
                    <a
                        href="${india.link}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="watch-btn"
                    >
                        ▶️ View Watch Options
                    </a>
                    `
                    : ""
                }

            </div>
        `).join("")}

        <p style="font-size: 12px; opacity: 0.7; margin-top: 20px;">
            Viewing availability powered by TMDB/JustWatch.
        </p>
    `;
}


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

    let favourites =
        JSON.parse(localStorage.getItem("favourites")) || [];

    if (!favourites.includes(movieName)) {

        favourites.push(movieName);

        localStorage.setItem(
            "favourites",
            JSON.stringify(favourites)
        );

        alert(movieName + " added to favourites ❤️");

    } else {

        alert(movieName + " is already in favourites!");
    }
}


function showFavourites() {

    const favourites =
        JSON.parse(localStorage.getItem("favourites")) || [];

    const details =
        document.getElementById("movie-details");

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

                <button onclick="removeFavourite('${movie.replace(/'/g, "\\'")}')">
                    ❌ Remove
                </button>
            </p>
        `).join("")}
    `;
}


function removeFavourite(movieName) {

    let favourites =
        JSON.parse(localStorage.getItem("favourites")) || [];

    favourites =
        favourites.filter(movie => movie !== movieName);

    localStorage.setItem(
        "favourites",
        JSON.stringify(favourites)
    );

    showFavourites();
}