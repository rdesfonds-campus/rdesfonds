// you can write js here
function createAndStyleElement(tag, className, content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content; // OK ici car tu mets du HTML
    return element;
}

function createPage() {
    const app = document.getElementById('app');

    // === NAVIGATION ===
    const nav = document.createElement('nav');

    const homeLink = createAndStyleElement('a', '', 'Accueil');
    const profilLink = createAndStyleElement('a', '', 'A propos');
    const fetchDataLink = createAndStyleElement('a', '', 'Fetch');
    const contactLink = createAndStyleElement('a', '', 'Contact');

    nav.appendChild(homeLink);
    nav.appendChild(profilLink);
    nav.appendChild(fetchDataLink);
    nav.appendChild(contactLink);

    // === CONTENU PRINCIPAL ===
    const mainContent = createAndStyleElement('div', 'main-content');

    const homeSection = createAndStyleElement(
        'div',
        'section active',
        `
        <h2>Bienvenue sur le site</h2>
        <p>Cliquez sur le bouton pour augmenter le compteur</p>
        <div id="counter" class="counter"></div>    
        `
    );

    const profilSection = createAndStyleElement('div', 'section', 'Cette page a entièrement été créée en Javascript.'
    );

    const dataSection = createAndStyleElement('div', 'section data-container', ''
    );

    // On ajoute toutes les sections au mainContent
    mainContent.appendChild(homeSection);
    mainContent.appendChild(profilSection);
    mainContent.appendChild(dataSection);

    homeLink.addEventListener('click', () => {
        showSection(homeSection)
    })

    profilLink.addEventListener('click', () => {
        showSection(profilSection)
    })

    fetchDataLink.addEventListener('click', () => {
        showSection(dataSection);
        fetchData();
    })

    function showSection(section) {
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'))
        section.classList.add('active');

    }

    // === FOOTER ===
    const footer = createAndStyleElement(
        'footer', '', `
        <p>&copy; 2025 Javascript DOM, Tous droits réservés</p>
        <p>
            <a href="https://google.fr" target="_blank">Google</a>
        </p>
        `
    );

    // AJOUT AU DOM
    app.appendChild(nav);
    app.appendChild(mainContent);
    app.appendChild(footer);
}

async function fetchData() {
    const dataContainer = document.querySelector('.data-container')
    dataContainer.innerHTML = '';
    
    const loadingElement = createAndStyleElement('div', 'loading', 'Loading...');
    dataContainer.appendChild(loadingElement);
    try {
const response = await fetch('https://jsonplaceholder.typicode.com/posts');
const data = await response.json();

setTimeout(()=>{
dataContainer.removeChild(loadingElement);

data.slice(0, 5).forEach(item => {
    const dataTitle = createAndStyleElement('h2', '', item.title)
    const databody = createAndStyleElement('p', '', item.body)

    dataContainer.appendChild(dataTitle)
    dataContainer.appendChild(dataBody)
})
}, 1000);
    }
    catch (error) {
dataContainer.removeChild(loadingElement);
dataContainer.textContent= 'Failed to fetch data';
    }
}

createPage();
