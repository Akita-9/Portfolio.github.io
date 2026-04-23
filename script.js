// Attendre que toute la page (images, styles, etc.) soit chargée
window.addEventListener('load', () => {
    const loader = document.querySelector('#loader');
    
    // On laisse le logo affiché pendant 1 seconde (1000 millisecondes)
    setTimeout(() => {
        // On ajoute la classe CSS qui cache le loader
        loader.classList.add('loader-hidden');
    }, 1000);
});