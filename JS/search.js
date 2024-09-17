document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('instant-search-results');

    // La clave de API
    const apiKey = 'ebfb1bdef5bf4d1dafb2b3fc19a3beb9';
    const apiUrl = 'https://api.rawg.io/api/games';

    // Función para realizar la búsqueda cuando se presiona Enter
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evitar que el formulario se envíe si es parte de un form

            const query = searchInput.value.trim();
            if (query.length > 0) {
                // Redirigir a la página de resultados con el parámetro de búsqueda en la URL
                window.location.href = `results.html?query=${encodeURIComponent(query)}`;
            }
        }
    });

    // Búsqueda en tiempo real mientras el usuario escribe
    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();

        if (query.length === 0) {
            searchResults.innerHTML = ''; // Limpiar resultados si la búsqueda está vacía
            searchResults.style.display = 'none'; // Ocultar resultados
            return;
        }

        try {
            // Construir la URL de solicitud
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
            searchResults.style.display = 'block'; // Mostrar mensaje de error
        }
    });

    // Mostrar los resultados en la lista desplegable
    function displayResults(results) {
        searchResults.innerHTML = ''; // Limpiar resultados anteriores

        if (results.length === 0) {
            searchResults.innerHTML = '<p>No se encontraron resultados.</p>';
            searchResults.style.display = 'block'; // Mostrar mensaje de no resultados
            return;
        }

        const list = document.createElement('ul');
        list.classList.add('list-unstyled');
        results.forEach(result => {
            const listItem = document.createElement('li');
            listItem.textContent = result.name;

            // Añadir evento de clic en cada resultado
            listItem.addEventListener('click', () => {
                alert(`Has hecho clic en: ${result.name}`);
            });

            list.appendChild(listItem);
        });

        searchResults.appendChild(list);
        searchResults.style.display = 'block'; // Mostrar resultados
    }

    // Ocultar los resultados al hacer clic fuera del área de búsqueda
    document.addEventListener('click', (event) => {
        const isClickInsideSearch = searchInput.contains(event.target);
        const isClickInsideResults = searchResults.contains(event.target);

        if (!isClickInsideSearch && !isClickInsideResults) {
            searchResults.innerHTML = ''; // Limpiar resultados
            searchResults.style.display = 'none'; // Ocultar resultados
        }
    });
});