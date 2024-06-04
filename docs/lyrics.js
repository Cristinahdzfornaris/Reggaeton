document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const singer = urlParams.get('singer');
    const decade = urlParams.get('decade');
    const singerName = document.getElementById('singer-name');
    const lyricsContainer = document.getElementById('lyrics-container');

    if (singer && decade) {
        singerName.textContent = singer;
        console.log(`Fetching data for ${singer} in the ${decade}s`);

        fetch(`${decade}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const artist = data.artists.find(a => a.name === singer);
                if (artist) {
                    console.log(`Artist found: ${artist.name}`);

                    artist.songs.forEach(song => {
                        const songTitle = document.createElement('h2');
                        songTitle.textContent = song.title;
                        lyricsContainer.appendChild(songTitle);

                        const songSnippet = document.createElement('p');
                        const snippetLength = 100; // Número de caracteres a mostrar
                        const truncatedLyric = song.lyric.length > snippetLength 
                            ? song.lyric.substring(0, snippetLength) + '...' 
                            : song.lyric;
                        songSnippet.textContent = truncatedLyric;
                        lyricsContainer.appendChild(songSnippet);
                    });
                } else {
                    console.error('Artista no encontrado en los datos.');
                }
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
            });
    } else {
        console.error('No se encontraron parámetros de URL para singer o decade.');
    }
})