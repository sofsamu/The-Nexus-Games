document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('instant-search-results');

    const apiKey = 'ebfb1bdef5bf4d1dafb2b3fc19a3beb9';
    const apiUrl = 'https://api.rawg.io/api/games';

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 

            const query = searchInput.value.trim();
            if (query.length > 0) {
                window.location.href = `results.html?query=${encodeURIComponent(query)}`;
            }
        }
    });

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();

        if (query.length === 0) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none'; 
            return;
        }

        try {
            const url = `${apiUrl}?key=${apiKey}&page_size=10&search=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error en la búsqueda');
            }
            const data = await response.json();
            
            displayResults(data.results);
        } catch (error) {
            console.error('Error:', error);
            searchResults.innerHTML = '<p>Error al buscar. Inténtalo de nuevo.</p>';
            searchResults.style.display = 'block';
        }
    });

    function displayResults(results) {
        searchResults.innerHTML = ''; 

        if (results.length === 0) {
            searchResults.innerHTML = '<p>No se encontraron resultados.</p>';
            searchResults.style.display = 'block';
            return;
        }

        const list = document.createElement('ul');
        list.classList.add('list-unstyled');
        results.forEach(result => {
            const listItem = document.createElement('li');
            listItem.textContent = result.name;

            listItem.addEventListener('click', () => {
                window.location.href = `game-details.html?gameId=${result.id}`; 
            });
            

            list.appendChild(listItem);
        });

        searchResults.appendChild(list);
        searchResults.style.display = 'block';
    }

    document.addEventListener('click', (event) => {
        const isClickInsideSearch = searchInput.contains(event.target);
        const isClickInsideResults = searchResults.contains(event.target);

        if (!isClickInsideSearch && !isClickInsideResults) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
        }
    });
});