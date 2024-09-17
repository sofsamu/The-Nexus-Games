// Lista de palabras clave para filtrar contenido no deseado
const prohibitedKeywords = ['hentai', 'adult', '18+', 'explicit'];

// Función para obtener los datos de juegos de la API de RawG
async function fetchGames(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Fetched data:', data.results); // Verifica los datos recibidos

        // Filtrar los resultados para eliminar contenido no deseado
        const filteredResults = filterResults(data.results);

        if (filteredResults.length > 0) {
            localStorage.setItem('games', JSON.stringify(filteredResults));
        }
        return filteredResults;
    } catch (error) {
        console.error('Error fetching games:', error);
        return [];
    }
}

// Función para filtrar los resultados
function filterResults(results) {
    return results.filter(result => {
        const name = result.name.toLowerCase();
        return !prohibitedKeywords.some(keyword => name.includes(keyword));
    });
}

// Función para mostrar los datos de juegos en la sección correspondiente
function displayResults(games, container) {
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas tarjetas

    games.forEach(game => {
        const card = document.createElement('div');
        card.classList.add('col-md-3');
    
        const cardLink = document.createElement('a');
        cardLink.href = `game-details.html?gameId=${game.id}`;
        cardLink.classList.add('card-link');
        cardLink.style.textDecoration = 'none'; // Opcional: eliminar subrayado del enlace
        cardLink.style.color = 'inherit'; // Opcional: heredar el color del texto de la tarjeta
    
        cardLink.innerHTML = `
            <div class="card card-fixed" data-game-id="${game.id}">
                <img src="${game.background_image}" class="card-img-top card-img-fixed" alt="${game.name}">
                <div class="card-body card-body-fixed">
                    <h5 class="card-title">${game.name}</h5>
                    <p class="card-text">${game.released}</p>
                </div>
            </div>
        `;
    
        card.appendChild(cardLink);
        container.appendChild(card);
    });

    // Asegúrate de agregar el evento de clic después de que se hayan renderizado las tarjetas
    addClickEventToCards(container);
}

// Función para agregar el evento de clic a las tarjetas
function addClickEventToCards(container) {
    // El botón ya está en el HTML generado, por lo que no es necesario agregar eventos de clic adicionales aquí.
}

// Función para obtener la fecha en formato YYYY-MM-DD
function getDateRange(startYearsBack = 0, endYearsAhead = 0) {
    const today = new Date();
    const start = new Date(today.getFullYear() - startYearsBack, 0, 1);
    const end = new Date(today.getFullYear() + endYearsAhead, 11, 31);
    return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        todayDate: today.toISOString().split('T')[0] // Fecha de hoy
    };
}

// Función para generar URL con timestamp para evitar caché
function getUrlWithTimestamp(baseUrl) {
    const timestamp = new Date().toISOString();
    return `${baseUrl}&timestamp=${encodeURIComponent(timestamp)}`;
}

// Mostrar el loader antes de cargar los juegos
function showLoader(container) {
    container.innerHTML = '<p>Loading...</p>'; // Puedes cambiar esto por un spinner o cualquier otra animación
}

// Obtener las fechas para las consultas
const { startDate: pastDate, todayDate: today, endDate: futureDate } = getDateRange();

// URLs para obtener los datos de juegos para cada sección

// Lo más buscado: juegos añadidos recientemente
const baseMostSearchedUrl = `https://api.rawg.io/api/games?key=ebfb1bdef5bf4d1dafb2b3fc19a3beb9&ordering=-added`;

// Lo más nuevo: juegos lanzados recientemente (en el último mes hasta hoy)
const baseNewReleasesUrl = `https://api.rawg.io/api/games?key=ebfb1bdef5bf4d1dafb2b3fc19a3beb9&dates=${pastDate},${today}&ordering=-released`;

// Próximos lanzamientos: juegos que aún no han salido (mañana en adelante)
const baseUpcomingReleasesUrl = `https://api.rawg.io/api/games?key=ebfb1bdef5bf4d1dafb2b3fc19a3beb9&dates=${futureDate}&ordering=released`;

// Función para cargar y mostrar los juegos
async function loadGames() {
    const mostSearchedContainer = document.querySelector('#most-searched');
    const newReleasesContainer = document.querySelector('#new-releases');
    const upcomingReleasesContainer = document.querySelector('#upcoming-releases');

    // Mostrar el loader antes de cargar los juegos
    showLoader(mostSearchedContainer);
    showLoader(newReleasesContainer);
    showLoader(upcomingReleasesContainer);

    // Cargar juegos y mostrar resultados
    const mostSearchedGames = await fetchGames(getUrlWithTimestamp(baseMostSearchedUrl));
    displayResults(mostSearchedGames, mostSearchedContainer);

    const newReleasesGames = await fetchGames(getUrlWithTimestamp(baseNewReleasesUrl));
    displayResults(newReleasesGames, newReleasesContainer);

    const upcomingReleasesGames = await fetchGames(getUrlWithTimestamp(baseUpcomingReleasesUrl));
    displayResults(upcomingReleasesGames, upcomingReleasesContainer);
}

// Llamar a la función para cargar los juegos cuando se carga el DOM
document.addEventListener('DOMContentLoaded', loadGames);