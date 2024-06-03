document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const singer = urlParams.get('singer');
    const decade = urlParams.get('decade');
    const singerName = document.getElementById('singer-name');

    if (singer && decade) {
        singerName.textContent =` Nube de Palabras: ${singer}`;
        console.log(`Fetching data for ${singer} in the ${decade}s`);

        fetch(`${decade}.json`)
            .then(response => response.json())
            .then(data => {
                const artist = data.artists.find(a => a.name === singer);
                if (artist) {
                    console.log(`Artist found: ${artist.name}`);
                    const lyrics = artist.songs.map(song => song.lyric).join(' ');
                    console.log(`Lyrics: ${lyrics}`);

                    const words = lyrics.split(/\s+/);
                    const wordCounts = {};

                    words.forEach(word => {
                        word = word.toLowerCase();
                        if (wordCounts[word]) {
                            wordCounts[word]++;
                        } else {
                            wordCounts[word] = 1;
                        }
                    });

                    const wordArray = Object.keys(wordCounts).map(word => [word, wordCounts[word]]);
                    console.log('Word array:', wordArray);

                    generateWordCloud(wordArray);
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
});

function generateWordCloud(wordArray) {
    const container = document.getElementById('word-cloud-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    wordArray.forEach(([word, count]) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.style.fontSize = `${10 + count * 2}px`;
        span.style.left = `${Math.random() * (containerWidth - 100)}px`;
        span.style.top = `${Math.random() * (containerHeight - 50)}px`;
        span.textContent = word;
        container.appendChild(span);
    });
}