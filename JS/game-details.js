document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId'); // Asegúrate de que el parámetro es 'gameId'

    const gameDetails = document.getElementById('game-details');
    const apiKey = 'ebfb1bdef5bf4d1dafb2b3fc19a3beb9';
    const apiUrl = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;

    if (gameId) {
        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Error al obtener los detalles del juego');
            }

            const data = await response.json();
            console.log(data); // Verifica la estructura de los datos

            displayGameDetails(data);
        } catch (error) {
            console.error('Error:', error);
            gameDetails.innerHTML = '<p>Error al obtener los detalles del juego. Inténtalo de nuevo.</p>';
        }
    } else {
        gameDetails.innerHTML = '<p>No se proporcionó ningún ID de juego.</p>';
    }

    function displayGameDetails(game) {
        const gameDetails = document.getElementById('game-details');
        const gameImage = document.getElementById('game-image');
        const gameTitle = document.getElementById('game-title');
        const gameDescription = document.getElementById('game-description');
        const gameReleaseDate = document.getElementById('game-release-date').querySelector('span');
        const gameGenres = document.getElementById('game-genres').querySelector('span');
        const gamePlatforms = document.getElementById('game-platforms').querySelector('span');
    
        // Actualizar la imagen del juego
        gameImage.src = game.background_image || 'https://via.placeholder.com/150';
        gameImage.alt = game.name;
    
        // Actualizar el título del juego
        gameTitle.textContent = game.name;
    
        // Actualizar la descripción del juego
        gameDescription.textContent = game.description_raw || 'No hay descripción disponible.';
    
        // Actualizar la fecha de lanzamiento
        gameReleaseDate.textContent = new Date(game.released).toLocaleDateString();
    
        // Actualizar los géneros
        gameGenres.textContent = game.genres.map(genre => genre.name).join(', ');
    
        // Actualizar las plataformas con logos
        const platformLogos = game.platforms.map(p => {
            const platformName = p.platform.name.toLowerCase().replace(/\s+/g, '-'); // Normaliza el nombre de la plataforma
            const logoUrl = `/images/logos/${platformName}-logo.png`; // Ajusta la ruta del logo
            return `
                <span class="platform ${platformName}">
                    <img src="${logoUrl}" alt="${p.platform.name} logo" class="platform-logo" />
                    ${p.platform.name}
                </span>`;
        }).join(' ');
        gamePlatforms.innerHTML = platformLogos || 'No disponible';
    
        // Agregar galería de imágenes si está disponible
        if (game.short_screenshots && game.short_screenshots.length > 0) {
            const galleryContainer = document.createElement('div');
            galleryContainer.classList.add('gallery-container');
    
            const galleryTitle = document.createElement('h3');
            galleryTitle.textContent = 'Galería de Imágenes';
            galleryTitle.classList.add('gallery-title');
            galleryContainer.appendChild(galleryTitle);
    
            const galleryRow = document.createElement('div');
            galleryRow.classList.add('gallery-row');
            game.short_screenshots.forEach(screenshot => {
                const col = document.createElement('div');
                col.classList.add('gallery-col');
    
                const img = document.createElement('img');
                img.src = screenshot.image;
                img.alt = 'Captura de pantalla';
                img.classList.add('game-screenshot');
    
                col.appendChild(img);
                galleryRow.appendChild(col);
            });
    
            galleryContainer.appendChild(galleryRow);
            gameDetails.appendChild(galleryContainer);
        }
    }
    
});
