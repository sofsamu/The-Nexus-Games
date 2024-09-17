document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const apiKey = 'ebfb1bdef5bf4d1dafb2b3fc19a3beb9';
    const apiUrl = 'https://api.rawg.io/api/games';

    const resultsContainer = document.getElementById('full-search-results');
    const paginationContainer = document.getElementById('pagination');
    const sortSelect = document.getElementById('sort-select'); // Agregado para ordenar
    const pageSize = 16; // Número de resultados por página
    let currentPage = 1;
    let totalPages = 0;
    let sortOrder = 'relevance'; // Orden predeterminado

    // Establece el orden de clasificación cuando cambia la selección
    sortSelect.addEventListener('change', (e) => {
        sortOrder = e.target.value;
        loadResults(); // Recarga los resultados con el nuevo orden
    });

    if (query) {
        await loadResults();
    } else {
        resultsContainer.innerHTML = '<p>No se proporcionó ningún término de búsqueda.</p>';
    }

    async function loadResults(page = 1) {
        try {
            // Construir la URL de solicitud con paginación y ordenación
            const url = `${apiUrl}?key=${apiKey}&page=${page}&page_size=${pageSize}&search=${encodeURIComponent(query)}&ordering=${sortOrder}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Error en la búsqueda');
            }
            
            const data = await response.json();
            totalPages = Math.ceil(data.count / pageSize); // Calcular el número total de páginas
            console.log(data); // Verifica los datos en la consola
            
            // Mostrar los resultados
            displayResults(data.results);
            displayPagination(page);
        } catch (error) {
            console.error('Error:', error);
            resultsContainer.innerHTML = '<p>Error al buscar. Inténtalo de nuevo.</p>';
        }
    }

    function displayResults(results) {
        resultsContainer.innerHTML = ''; // Limpiar resultados anteriores

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
            return;
        }

        const row = document.createElement('div');
        row.classList.add('row');
        results.forEach(result => {
            const col = document.createElement('div');
            col.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'mb-4'); // Ajustar la clase para el tamaño de las tarjetas

            const cardLink = document.createElement('a'); // Envolver la tarjeta en un enlace
            cardLink.href = `game-details.html?gameId=${result.id}`;
            cardLink.classList.add('card-link');
            cardLink.style.textDecoration = 'none'; // Opcional: eliminar subrayado del enlace
            cardLink.style.color = 'inherit'; // Opcional: heredar el color del texto de la tarjeta

            const card = document.createElement('div');
            card.classList.add('card', 'h-100');
            card.innerHTML = `
                <img src="${result.background_image}" class="card-img-top card-img-fixed" alt="${result.name}">
                <div class="card-body card-body-fixed">
                    <h5 class="card-title">${result.name}</h5>
                    <p class="card-text">${result.genres.map(genre => genre.name).join(', ')}</p>
                </div>
            `;

            cardLink.appendChild(card);
            col.appendChild(cardLink);
            row.appendChild(col);
        });

        resultsContainer.appendChild(row);
    }

    function displayPagination(currentPage) {
        paginationContainer.innerHTML = ''; // Limpiar paginación anterior

        const createPageItem = (page, text, isActive = false, isDisabled = false) => {
            const li = document.createElement('li');
            li.classList.add('page-item');
            if (isActive) {
                li.classList.add('active');
            }
            if (isDisabled) {
                li.classList.add('disabled');
            }

            const a = document.createElement('a');
            a.classList.add('page-link');
            a.href = '#';
            a.innerHTML = text;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                if (!isDisabled) {
                    loadResults(page);
                }
            });

            li.appendChild(a);
            return li;
        };

        // Botón de primera página
        paginationContainer.appendChild(createPageItem(1, 'Primera', currentPage === 1, currentPage === 1));

        // Botón de anterior
        paginationContainer.appendChild(createPageItem(currentPage - 1, '←', false, currentPage === 1));

        // Botones de páginas previas
        for (let i = Math.max(2, currentPage - 2); i < currentPage; i++) {
            paginationContainer.appendChild(createPageItem(i, i));
        }

        // Botón de página actual
        paginationContainer.appendChild(createPageItem(currentPage, currentPage, true));

        // Botones de páginas siguientes
        for (let i = currentPage + 1; i <= Math.min(totalPages - 1, currentPage + 2); i++) {
            paginationContainer.appendChild(createPageItem(i, i));
        }

        // Botón de siguiente
        paginationContainer.appendChild(createPageItem(currentPage + 1, '→', false, currentPage === totalPages));

        // Botón de última página
        paginationContainer.appendChild(createPageItem(totalPages, 'Última', currentPage === totalPages, currentPage === totalPages));
    }
});