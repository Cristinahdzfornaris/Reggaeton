const stopwords = [
    "a", "y", "el", "la", "de", "que", "en", "los", "del", "las", "con",
    "un", "por", "una", "para", "es", "al", "lo", "como", "más", "o", "pero",
    "sus", "le", "ha", "me", "si", "sin", "mi", "se", "ya", "yo", "todo", 
    "esta", "está", "cuando", "muy", "él", "son", "todos", "nos", "también", 
    "fue", "hay", "quien", "ser", "qué", "entre", "donde", "tú", "porque", 
    "esa", "estoy", "ni", "ha", "he", "has"
    // Agrega más stopwords según sea necesario
];
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const singer = urlParams.get('singer');
    const decade = urlParams.get('decade');
    const singerName = document.getElementById('singer-name');

    if (singer && decade) {
        singerName.textContent = `Nube de Palabras: ${singer}`;
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
                    const lyrics = artist.songs.map(song => song.lyric).join(' ');
                    console.log(`Lyrics: ${lyrics}`);

                    const words = lyrics.split(/\s+/);
                    const wordCounts = {};

                    words.forEach(word => {
                        word = word.toLowerCase();
                        if (!stopwords.includes(word)) {
                            if (wordCounts[word]) {
                                wordCounts[word]++;
                            } else {
                                wordCounts[word] = 1;
                            }
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

    const positions = [];

    wordArray.forEach(([word, count]) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.style.fontSize = `${10 + count * 2}px`;
        span.textContent = word;
        
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 100) {
            const left = Math.random() * (containerWidth - span.offsetWidth);
            const top = Math.random() * (containerHeight - span.offsetHeight);

            span.style.left =` ${left}px`;
            span.style.top = `${top}px`;

            let overlapping = false;
            for (let pos of positions) {
                if (isOverlapping(span, pos.element)) {
                    overlapping = true;
                    break;
                }
            }

            if (!overlapping) {
                container.appendChild(span);
                positions.push({ element: span, left: left, top: top });
                placed = true;
            }

            attempts++;
        }
    });
}

function isOverlapping(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

// Ejemplo de configuración de wordcloud con opciones adicionales
WordCloud(document.getElementById('word-cloud'), {
    list: wordArray,
    gridSize: 10,
    weightFactor: 2,
    fontFamily: 'Arial, sans-serif',
    color: function (word, weight) {
        return (weight > 50) ? '#f02222' : '#c09292';
    },
    rotateRatio: 0.5,
    backgroundColor: '#f0f0f0'
});