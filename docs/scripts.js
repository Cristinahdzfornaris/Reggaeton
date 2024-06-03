document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const decade = urlParams.get('decade');
    const decadeTitle = document.getElementById('decade-title');
    const artistsList = document.getElementById('artists-list');
    const lyricsList = document.getElementById('lyrics-list');

    if (decade) {
        fetch(`${decade}.json`)
            .then(response => response.json())
            .then(data => {
                decadeTitle.textContent = `Década de los ${decade}`;
                artistsList.innerHTML = '';
                lyricsList.innerHTML = '';

                data.artists.forEach(artist => {
                    const li = document.createElement('li');
                    li.textContent = artist.name;
                    li.addEventListener('click', () => {
                        window.location.href = `singer.html?singer=${artist.name}&decade=${decade}`;
                    });
                    artistsList.appendChild(li);
                });

                data.artists.forEach(artist => {
                    artist.songs.forEach(song => {
                        const li = document.createElement('li');
                        li.innerHTML = `<strong>${artist.name} - ${song.title}:</strong> ${song.lyric}`;
                        lyricsList.appendChild(li);
                    });
                });
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
            });
    }
});