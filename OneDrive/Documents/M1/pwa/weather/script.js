// Définition des clés et URL d'API
const apiKey = '58e6d9f187fc7b5c5b00288a4d7ad65f'; // Votre clé API OpenWeatherMap
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&'; // URL de base de l'API avec paramètre pour unités métriques

// Récupération des éléments du DOM
const cityName = document.getElementById('city-name');           // Élément qui affichera le nom de la ville
const weatherIcon = document.getElementById('weather-icon');     // Élément qui affichera l'icône météo
const temperature = document.getElementById('temperature');      // Élément qui affichera la température
const condition = document.getElementById('condition');          // Élément qui affichera les conditions météo
const precipitation = document.getElementById('precipitation');  // Élément qui affichera les précipitations
const windSpeed = document.getElementById('wind-speed');        // Élément qui affichera la vitesse du vent
const humidity = document.getElementById('humidity');           // Élément qui affichera l'humidité
const pressure = document.getElementById('pressure');           // Élément qui affichera la pression
const searchInput = document.getElementById('search-input');    // Champ de recherche
const searchButton = document.getElementById('search-button');  // Bouton de recherche

// Fonction de mise à jour de l'heure
function updateTime() {
    const now = new Date();  // Crée un nouvel objet Date avec l'heure actuelle
    const options = { 
        hour: '2-digit',     // Format heure sur 2 chiffres
        minute: '2-digit',   // Format minute sur 2 chiffres
        second: '2-digit',   // Format seconde sur 2 chiffres
        hour12: false        // Format 24h
    };
    const timeString = now.toLocaleTimeString([], options);  // Formate l'heure selon les options
    document.getElementById('current-time').textContent = timeString;  // Met à jour l'affichage
}

// Fonction de mise à jour de la date
function updateDate() {
    const now = new Date();  // Crée un nouvel objet Date
    const options = { 
        day: '2-digit',      // Format jour sur 2 chiffres
        month: '2-digit',    // Format mois sur 2 chiffres
        year: 'numeric'      // Année complète
    };
    const dateString = now.toLocaleDateString('en-GB', options);  // Formate la date au format britannique
    document.getElementById('current-date').textContent = dateString;  // Met à jour l'affichage
}

// Fonction de récupération des données météo
async function fetchWeather(city) {
    try {
        // Fait une requête à l'API avec la ville et la clé API
        const response = await fetch(`${apiUrl}q=${city}&appid=${apiKey}`);
        const data = await response.json();  // Convertit la réponse en JSON

        if (data.cod !== 200) {  // Vérifie si la requête a réussi
            alert('Ville non trouvée');
            return;
        }

        // Met à jour tous les éléments de l'interface avec les données reçues
        cityName.textContent = `${data.name}, ${data.sys.country}`;  // Nom de la ville et pays
        temperature.textContent = `${Math.round(data.main.temp)}°`;   // Température arrondie
        condition.textContent = data.weather[0].description;          // Description météo

        // Met à jour l'icône météo
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Met à jour les détails météo
        precipitation.textContent = `${data.clouds.all}%`;          // Couverture nuageuse
        windSpeed.textContent = `${data.wind.speed} km/h`;         // Vitesse du vent
        humidity.textContent = `${data.main.humidity}%`;           // Humidité
        pressure.textContent = `${data.main.pressure} hPa`;        // Pression

    } catch (error) {
        console.error('Erreur lors de la récupération des données météo:', error);
    }
}

// Écouteur d'événement pour le bouton de recherche
searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();  // Récupère et nettoie la valeur du champ de recherche
    if (city) {
        fetchWeather(city);  // Si une ville est entrée, lance la recherche
    } else {
        alert('Veuillez entrer un nom de ville');  // Sinon affiche une alerte
    }
});

// Initialisation
updateDate();  // Met à jour la date initiale
updateTime();  // Met à jour l'heure initiale
setInterval(updateTime, 60000);  // Met à jour l'heure toutes les minutes (60000ms = 1 minute)
fetchWeather('Algeria');  // Charge les données météo initiales pour l'Algérie