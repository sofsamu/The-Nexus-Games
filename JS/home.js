const prohibitedKeywords = ['hentai', 'adult', '18+', 'explicit', 'sex', 'sexual', 'erotic', 'ecchi', 'nude', 'engaging', 'girl', 'porn', 'pornstar', 'massage'];

async function fetchGames(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Fetched data:', data.results);
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

function filterResults(results) {
    return results.filter(result => {
        const name = result.name.toLowerCase();
        return !prohibitedKeywords.some(keyword => name.includes(keyword));
    });
}

function displayResults(games, container) {
    container.innerHTML = '';

    games.forEach(game => {
        const card = document.createElement('div');
        card.classList.add('col-md-3');

        const cardLink = document.createElement('a');
        cardLink.href = `game-details.html?gameId=${game.id}`;
        cardLink.classList.add('card-link');
        cardLink.style.textDecoration = 'none';
        cardLink.style.color = 'inherit';

        // Mostrar solo las 3 primeras plataformas y añadir "+N" si hay más
        const maxPlatformsToShow = 3;
        const platforms = game.platforms ? game.platforms.slice(0, maxPlatformsToShow).map(p => {
            const platformName = p.platform.name.toLowerCase().replace(/\s+/g, '-');
            const logoUrl = `/images/logos/${platformName}-logo.png`; 
            return `
                <span class="platform ${platformName}">
                    <img src="${logoUrl}" alt="${p.platform.name} logo" class="platform-logo" />
                    ${p.platform.name}
                </span>`;
        }).join(' ') : 'No disponible';

        const additionalPlatforms = game.platforms.length > maxPlatformsToShow ? `+${game.platforms.length - maxPlatformsToShow}` : '';

        cardLink.innerHTML = `
            <div class="card card-fixed" data-game-id="${game.id}">
                <img src="${game.background_image}" class="card-img-top card-img-fixed" alt="${game.name}">
                <div class="card-overlay">
                    <h5 class="card-title">${game.name}</h5>
                    <p class="card-text">${platforms} ${additionalPlatforms}</p>
                </div>
            </div>
        `;

        card.appendChild(cardLink);
        container.appendChild(card);
    });

    addClickEventToCards(container);
}

function addClickEventToCards(container) {}

function getDateRange(startYearsBack = 0, endYearsAhead = 0) {
    const today = new Date();
    const start = new Date(today.getFullYear() - startYearsBack, 0, 1);
    const end = new Date(today.getFullYear() + endYearsAhead, 11, 31);
    return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        todayDate: today.toISOString().split('T')[0]
    };
}

function getUrlWithTimestamp(baseUrl) {
    const timestamp = new Date().toISOString();
    return `${baseUrl}&timestamp=${encodeURIComponent(timestamp)}`;
}

function showLoader(container) {
    container.innerHTML = '<p>Loading...</p>';
}

const { startDate: pastDate, todayDate: today, endDate: futureDate } = getDateRange();

const baseMostSearchedUrl = `https://api.rawg.io/api/games?key=ebfb1bdef5bf4d1dafb2b3fc19a3beb9&ordering=-added`;
const baseNewReleasesUrl = `https://api.rawg.io/api/games?key=ebfb1bdef5bf4d1dafb2b3fc19a3beb9&dates=${pastDate},${today}&ordering=-released`;
const baseUpcomingReleasesUrl = `https://api.rawg.io/api/games?key=ebfb1bdef5bf4d1dafb2b3fc19a3beb9&dates=${futureDate}&ordering=released`;

async function loadGames() {
    const mostSearchedContainer = document.querySelector('#most-searched');
    const newReleasesContainer = document.querySelector('#new-releases');
    const upcomingReleasesContainer = document.querySelector('#upcoming-releases');

    showLoader(mostSearchedContainer);
    showLoader(newReleasesContainer);
    showLoader(upcomingReleasesContainer);

    const mostSearchedGames = await fetchGames(getUrlWithTimestamp(baseMostSearchedUrl));
    displayResults(mostSearchedGames, mostSearchedContainer);

    const newReleasesGames = await fetchGames(getUrlWithTimestamp(baseNewReleasesUrl));
    displayResults(newReleasesGames, newReleasesContainer);

    const upcomingReleasesGames = await fetchGames(getUrlWithTimestamp(baseUpcomingReleasesUrl));
    displayResults(upcomingReleasesGames, upcomingReleasesContainer);
}

document.addEventListener('DOMContentLoaded', loadGames);
