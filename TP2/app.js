// app.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then((registration) => {
                console.log('Service Worker enregistré avec succès:', registration);
            })
            .catch((error) => {
                console.log('Échec de l’enregistrement du Service Worker:', error);
            });
    });
}

// Gestion du formulaire
document.getElementById('rental-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const car = document.getElementById('car').value;
    const duration = document.getElementById('duration').value;
    const confirmation = document.getElementById('confirmation');
    confirmation.textContent = `Car rented: ${car}. Rental duration: ${duration} days.`;
});
