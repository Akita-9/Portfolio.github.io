/* ================================================================
   SCRIPT.JS — Portfolio Aki TANAKA
   Deux responsabilités :
     1. Loader de page (AT logo pendant 1s au démarrage)
     2. Formulaire de contact via EmailJS
   ================================================================ */


/* ================================================================
   PARTIE 1 — LOADER DE PAGE
================================================================ */
window.addEventListener('load', () => {
    const loader = document.querySelector('#loader');

    // On laisse le logo affiché pendant 1 seconde
    setTimeout(() => {
        loader.classList.add('loader-hidden');
    }, 1000);
});


/* ================================================================
   PARTIE 2 — FORMULAIRE DE CONTACT (EmailJS)
================================================================ */

// ——— Identifiants EmailJS ———
const EMAILJS_PUBLIC_KEY  = 'oqzbBr6TRd04G_OeM';
const EMAILJS_SERVICE_ID  = 'service_t4ktzps';
const EMAILJS_TEMPLATE_ID = 'template_i62i8pb';


document.addEventListener('DOMContentLoaded', () => {

    // Vérification : SDK EmailJS bien chargé ?
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS SDK introuvable. Vérifie le CDN dans index.html.');
        return;
    }

    // Initialisation — on passe la CONSTANTE (pas la valeur brute)
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    // Sélection des éléments
    const contactForm  = document.getElementById('contact-form');
    const feedbackZone = document.getElementById('form-feedback');
    const submitButton = contactForm.querySelector('.btn--submit');

    // Écouteur du formulaire
    contactForm.addEventListener('submit', async (event) => {

        // Empêche le rechargement natif de la page
        event.preventDefault();

        // Validation HTML5 (champs required, type email…)
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // Bouton en état "chargement" — évite le double-clic
        setButtonLoading(submitButton, true);

        // Données à envoyer — les clés doivent correspondre aux
        // variables {{…}} définies dans ton template EmailJS
        const templateParams = {
            from_name:  document.getElementById('contact-name').value.trim(),
            from_email: document.getElementById('contact-email').value.trim(),
            subject:    document.getElementById('contact-subject').value.trim() || '(sans sujet)',
            message:    document.getElementById('contact-message').value.trim(),
        };

        try {
            // Appel à l'API EmailJS (asynchrone)
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

            // Succès : message de confirmation vert
            showFeedback(
                feedbackZone,
                'success',
                'ri-checkbox-circle-line',
                'Message envoyé avec succès ! Je vous répondrai dès que possible.'
            );

            contactForm.reset();

        } catch (error) {
            // Erreur réseau ou identifiants incorrects
            console.error('Erreur EmailJS :', error);
            showFeedback(
                feedbackZone,
                'error',
                'ri-error-warning-line',
                "Une erreur est survenue lors de l'envoi. Réessayez ou contactez-moi directement par e-mail."
            );

        } finally {
            // Dans tous les cas : réactiver le bouton
            setButtonLoading(submitButton, false);
        }
    });

}); // fin DOMContentLoaded


/* ================================================================
   FONCTIONS UTILITAIRES
   ⚠️  Ces fonctions étaient ABSENTES du fichier précédent — c'est
       la cause du bug : elles étaient appelées sans être définies,
       provoquant un ReferenceError silencieux au clic sur "Envoyer".
================================================================ */

/**
 * setButtonLoading
 * Bloque / débloque le bouton pendant l'appel API pour éviter
 * qu'un double-clic envoie deux e-mails.
 *
 * @param {HTMLButtonElement} btn     - Le bouton ciblé
 * @param {boolean}           loading - true = en cours, false = prêt
 */
function setButtonLoading(btn, loading) {
    if (loading) {
        // Sauvegarde du contenu HTML original pour le restaurer ensuite
        btn.dataset.originalHtml = btn.innerHTML;
        btn.disabled  = true;
        btn.innerHTML = '<i class="ri-loader-4-line" aria-hidden="true"></i> Envoi en cours…';

        // Animation de rotation sur l'icône loader
        const icon = btn.querySelector('.ri-loader-4-line');
        if (icon) icon.style.animation = 'spin 1s linear infinite';

    } else {
        btn.disabled  = false;
        // On restaure le contenu original sauvegardé ci-dessus
        btn.innerHTML = btn.dataset.originalHtml || btn.innerHTML;
    }
}


/**
 * showFeedback
 * Affiche la zone de retour utilisateur (succès ou erreur)
 * sous le formulaire, puis la masque automatiquement après 8s.
 *
 * @param {HTMLElement} zone    - div#form-feedback
 * @param {string}      type    - 'success' ou 'error'
 * @param {string}      icon    - Classe d'icône Remix Icons
 * @param {string}      message - Texte à afficher
 */
function showFeedback(zone, type, icon, message) {
    // Retirer l'éventuelle classe d'un envoi précédent
    zone.classList.remove('form-feedback--success', 'form-feedback--error');

    // Ajouter la classe modificatrice BEM correspondante
    zone.classList.add(`form-feedback--${type}`);

    // Injecter l'icône (aria-hidden : le texte suffit pour les lecteurs d'écran)
    // et le message
    zone.innerHTML = `
        <i class="form-feedback__icon ${icon}" aria-hidden="true"></i>
        <span>${message}</span>
    `;

    // Rendre la zone visible (retire l'attribut HTML "hidden")
    zone.removeAttribute('hidden');

    // Auto-masquage après 8 secondes
    setTimeout(() => {
        zone.setAttribute('hidden', '');
        zone.innerHTML = '';
        zone.classList.remove('form-feedback--success', 'form-feedback--error');
    }, 8000);
}


/* ================================================================
   KEYFRAME — rotation du spinner sur le bouton d'envoi
   Injectée ici (en JS) plutôt que dans style.css car elle est
   uniquement liée à ce comportement fonctionnel.
================================================================ */
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(spinnerStyle);