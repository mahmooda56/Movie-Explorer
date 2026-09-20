export default async function handler(req, res) {
    const { title, year } = req.query;

    if (!title) {
        return res.status(400).json({
            error: "Movie title is required"
        });
    }

    try {
        // OMDb
        const omdbResponse = await fetch(
            `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(title)}`
        );

        const movie = await omdbResponse.json();

        if (movie.Response === "False") {
            return res.status(404).json(movie);
        }

        // TMDB
        const searchResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&year=${encodeURIComponent(year || movie.Year)}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
                    accept: "application/json"
                }
            }
        );

        const searchData = await searchResponse.json();

        let providers = null;

        if (searchData.results?.length) {
            const movieId = searchData.results[0].id;

            const providerResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
                        accept: "application/json"
                    }
                }
            );

            const providerData = await providerResponse.json();
            providers = providerData.results?.IN || null;
        }

        return res.status(200).json({
            movie,
            providers
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Server error"
        });
    }
}