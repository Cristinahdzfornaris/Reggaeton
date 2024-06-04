
// js/singer.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const singer = urlParams.get('singer');
    const decade = urlParams.get('decade');
    const singerName = document.getElementById('singer-name');

    if (singer && decade) {
        singerName.textContent = singer;
        fetch(`${decade}.json`)
            .then(response => response.json())
            .then(data => {
                const artist = data.artists.find(a => a.name === singer);
                if (artist) {
                    let lyrics = artist.songs.map(song => song.lyric).join(' ');
                    let words = lyrics.split(/\s+/);
                    let wordMap = {};

                    words.forEach(word => {
                        word = word.toLowerCase().replace(/[^a-zñáéíóúü]/g, '');
                        if (word && !stopwords.includes(word)) {
                            if (!wordMap[word]) {
                                wordMap[word] = 0;
                            }
                            wordMap[word]++;
                        }
                    });

                    let wordArray = Object.keys(wordMap).map(word => [word, wordMap[word]]);
                    wordArray.sort((a, b) => b[1] - a[1]);

                    const wordCloud = document.getElementById('word-cloud');
                    wordArray.forEach(([word, count]) => {
                        let span = document.createElement('span');
                        span.className = 'word';
                        span.style.fontSize = `${Math.log(count + 1) * 15}px`;
                        span.style.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
                        span.textContent = word;
                        wordCloud.appendChild(span);
                    });

                    // Position words using a better layout algorithm
                    positionWords();
                } else {
                    console.error('Artista no encontrado en los datos.');
                }
            })
            .catch(error => console.error('Error al cargar el archivo JSON:', error));
    } else {
        console.error('No se encontraron parámetros de URL para singer o decade.');
    }
});

function positionWords() {
    const wordCloud = document.getElementById('word-cloud');
    const words = wordCloud.getElementsByClassName('word');
    const cloudWidth = wordCloud.clientWidth;
    const cloudHeight = wordCloud.clientHeight;

    const positions = [];

    Array.from(words).forEach(word => {
        let wordWidth = word.clientWidth;
        let wordHeight = word.clientHeight;
        let left, top, collision;

        do {
            left = Math.random() * (cloudWidth - wordWidth);
            top = Math.random() * (cloudHeight - wordHeight);
            collision = positions.some(pos => {
                return !(left + wordWidth < pos.left || left > pos.left + pos.width || top + wordHeight < pos.top || top > pos.top + pos.height);
            });
        } while (collision);

        positions.push({ left, top, width: wordWidth, height: wordHeight });
        word.style.left = `${left}px`;
        word.style.top = `${top}px`;
    });
}

const stopwords = ["peor","ti","oh","soy",
    "a","mm","la", "y", "de", "el", "que", "en", "los", "del", "se", "las", "por", "un", "con", "no", "una", "su", "para", "es", "al", "lo", "como", "más", "pero", "sus", "le", "ya", "o", "este", "sí", "porque", "esta", "entre", "cuando", "muy", "sin", "sobre", "también", "me", "hasta", "hay", "donde", "quien", "desde", "todo", "nos", "durante", "todos", "uno", "les", "ni", "contra", "otros", "ese", "eso", "ante", "ellos", "e", "esto", "mí", "antes", "algunos", "qué", "unos", "yo", "otro", "otras", "otra", "él", "tanto", "esa", "estos", "mucho", "quienes", "nada", "muchos", "cual", "poco", "ella", "estar", "estas", "algunas", "algo", "nosotros", "mi", "mis", "tú", "te", "ti", "tu", "tus", "ellas", "nosotras", "vosotros", "vosotras", "os", "mío", "mía", "míos", "mías", "tuyo", "tuya", "tuyos", "tuyas",
"suyo", "suya", "suyos", "suyas", "nuestro", "nuestra", "nuestros", "nuestras", "vuestro", "vuestra", "vuestros", "vuestras"
];