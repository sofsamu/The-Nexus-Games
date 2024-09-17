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
        gameDetails.innerHTML = '';

        // Contenedor principal
        const container = document.createElement('div');
        container.classList.add('d-flex', 'align-items-start', 'mb-4');

        // Imagen del juego
        const img = document.createElement('img');
        img.src = game.background_image || 'https://via.placeholder.com/150';
        img.alt = game.name;
        img.style.width = '200px'; // Tamaño más pequeño
        img.style.height = 'auto';
        img.classList.add('me-4'); // Margen a la derecha

        // Información del juego
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('flex-grow-1');

        const title = document.createElement('h2');
        title.textContent = game.name;
        title.classList.add('mb-3');

        const description = document.createElement('p');
        description.textContent = game.description_raw || 'No hay descripción disponible.';
        description.classList.add('mb-3');

        const platforms = document.createElement('p');
        platforms.textContent = `Plataformas: ${game.platforms.map(p => p.platform.name).join(', ')}`;
        platforms.classList.add('mb-3');

        const releaseYear = document.createElement('p');
        releaseYear.textContent = `Año de lanzamiento: ${new Date(game.released).getFullYear()}`;
        releaseYear.classList.add('mb-3');

        infoContainer.appendChild(title);
        infoContainer.appendChild(description);
        infoContainer.appendChild(platforms);
        infoContainer.appendChild(releaseYear);

        // Agregar galería de imágenes si está disponible
        if (game.short_screenshots && game.short_screenshots.length > 0) {
            const galleryContainer = document.createElement('div');
            galleryContainer.classList.add('mt-4');

            const galleryTitle = document.createElement('h3');
            galleryTitle.textContent = 'Galería de Imágenes';
            galleryContainer.appendChild(galleryTitle);

            const galleryRow = document.createElement('div');
            galleryRow.classList.add('row', 'g-2');
            game.short_screenshots.forEach(screenshot => {
                const col = document.createElement('div');
                col.classList.add('col-4');

                const img = document.createElement('img');
                img.src = screenshot.image;
                img.alt = 'Captura de pantalla';
             img.classList.add('img-fluid', 'rounded');
                img.style.objectFit = 'cover'; // Ajustar imagen

                col.appendChild(img);
                galleryRow.appendChild(col);
            });

            galleryContainer.appendChild(galleryRow);
            infoContainer.appendChild(galleryContainer);
        }

        container.appendChild(img);
        container.appendChild(infoContainer);
        gameDetails.appendChild(container);
    }
});
