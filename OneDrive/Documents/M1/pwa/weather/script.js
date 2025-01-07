// Définition des clés et URL d'API
const apiKey = "58e6d9f187fc7b5c5b00288a4d7ad65f"; // Votre clé API OpenWeatherMap
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&"; // URL de base de l'API avec paramètre pour unités métriques
// Récupération des éléments du DOM
const cityName = document.getElementById("city-name"); // Élément qui affichera le nom de la ville
const weatherIcon = document.getElementById("weather-icon"); // Élément qui affichera l'icône météo
const temperature = document.getElementById("temperature"); // Élément qui affichera la température
const condition = document.getElementById("condition"); // Élément qui affichera les conditions météo
const precipitation = document.getElementById("precipitation"); // Élément qui affichera les précipitations
const windSpeed = document.getElementById("wind-speed"); // Élément qui affichera la vitesse du vent
const humidity = document.getElementById("humidity"); // Élément qui affichera l'humidité
const pressure = document.getElementById("pressure"); // Élément qui affichera la pression
const searchInput = document.getElementById("search-input"); // Champ de recherche
const searchButton = document.getElementById("search-button"); // Bouton de recherche
const searchCurrentButton = document.getElementById("search-current-button"); // Bouton de recherche

// Fonction de mise à jour de l'heure
function updateTime() {
  const now = new Date(); // Crée un nouvel objet Date avec l'heure actuelle
  const options = {
    hour: "2-digit", // Format heure sur 2 chiffres
    minute: "2-digit", // Format minute sur 2 chiffres
    second: "2-digit", // Format seconde sur 2 chiffres
    hour12: false, // Format 24h
  };
  const timeString = now.toLocaleTimeString([], options); // Formate l'heure selon les options
  document.getElementById("current-time").textContent = timeString; // Met à jour l'affichage
}

// Fonction de mise à jour de la date
function updateDate() {
  const now = new Date(); // Crée un nouvel objet Date
  const options = {
    day: "2-digit", // Format jour sur 2 chiffres
    month: "2-digit", // Format mois sur 2 chiffres
    year: "numeric", // Année complète
  };
  const dateString = now.toLocaleDateString("en-GB", options); // Formate la date au format britannique
  document.getElementById("current-date").textContent = dateString; // Met à jour l'affichage
}

// Fonction de récupération des données météo
async function fetchWeather(city) {
  try {
    // Fait une requête à l'API avec la ville et la clé API
    const response = await fetch(`${apiUrl}q=${city}&appid=${apiKey}`);//creer fonction fetch
    const data = await response.json(); // Convertit la réponse en JSON

    if (data.cod !== 200) {
      // Vérifie si la requête a réussi
      alert("Ville non trouvée");
      return;
    }

    // Met à jour tous les éléments de l'interface avec les données reçues
    cityName.textContent = `${data.name}, ${data.sys.country}`; // Nom de la ville et pays
    temperature.textContent = `${Math.round(data.main.temp)}°`; // Température arrondie
    condition.textContent = data.weather[0].description; // Description météo

    // Met à jour l'icône météo
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Met à jour les détails météo
    precipitation.textContent = `${data.clouds.all}%`; // Couverture nuageuse
    windSpeed.textContent = `${data.wind.speed} km/h`; // Vitesse du vent
    humidity.textContent = `${data.main.humidity}%`; // Humidité
    pressure.textContent = `${data.main.pressure} hPa`; // Pression
  } catch (error) {
    console.error("Erreur lors de la récupération des données météo:", error);
  }
}

async function fetchWeatherByCoords(lon, lat, limit = 1) {
  try {
    // Fait une requête à l'API avec la ville et la clé API
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit${limit}&appid=${apiKey}`
    );
    const data = await response.json(); // Convertit la réponse en JSON
    console.log(data);
    city = data[0].name;
    fetchWeather(city);
  } catch (error) {
    console.log(error.message);
  }
}
function getUserLocation() {
  // Vérifie si la géolocalisation est prise en charge par le navigateur
  if (navigator.geolocation) {
    // Met à jour le texte pour informer l'utilisateur que la position est en cours de récupération
    cityName.textContent = "Récupération de votre position...";

    // Demande la position actuelle de l'utilisateur
    navigator.geolocation.getCurrentPosition(
      // Callback de succès : appelé lorsque la position est récupérée avec succès
      (position) => {
        // Récupère la latitude et la longitude des coordonnées
        const { latitude, longitude } = position.coords;
        // Appelle une fonction pour récupérer la météo à partir des coordonnées
        fetchWeatherByCoords(longitude, latitude);
      },
      // Callback d'erreur : appelé lorsque la récupération de la position échoue
      (error) => {
        // Affiche l'erreur dans la console
        console.error("Erreur de géolocalisation:", error);

        // Gère les différents types d'erreurs possibles
        switch (error.code) {
          case error.PERMISSION_DENIED:
            // L'utilisateur a refusé l'accès à la géolocalisation
            alert(
              "Veuillez autoriser l'accès à votre position pour obtenir la météo locale"
            );
            break;
          case error.POSITION_UNAVAILABLE:
            // Les informations de position ne sont pas disponibles
            alert("Information de position non disponible");
            break;
          case error.TIMEOUT:
            // La demande de géolocalisation a expiré
            alert("Délai d'attente de la requête de position dépassé");
            break;
          default:
            // Une erreur inconnue s'est produite
            alert("Erreur lors de la récupération de la position");
        }

        // Si la géolocalisation échoue, récupère la météo pour une ville par défaut (ici "Algeria")
        fetchWeather("Algeria");
      },
      // Options pour la géolocalisation
      {
        enableHighAccuracy: true, // Demande des informations de position les plus précises possibles
        timeout: 5000, // Définit un délai d'attente de 5 secondes pour la demande
        maximumAge: 0, // Ne réutilise pas les données mises en cache, demande une position fraîche
      }
    );
  } else {
    // Avertit l'utilisateur que la géolocalisation n'est pas supportée par son navigateur
    alert("La géolocalisation n'est pas supportée par votre navigateur");
    // Repli sur une ville par défaut (ici "Algeria") si la géolocalisation n'est pas disponible
    fetchWeather("Algeria");
  }
}


// Écouteur d'événement pour le bouton de recherche
elements.searchButton.addEventListener("click", () => {
  const searchValue = elements.searchInput.value.trim();  // Récupère la valeur saisie et supprime les espaces inutiles au début et à la fin
  
  // Vérifie si le champ de recherche est vide
  if (!searchValue) {
      alert("Veuillez entrer un nom de ville ou des coordonnées");
      return;
  }

  // Expression régulière pour vérifier le format des coordonnées
  // Accepte les formats comme: "48.8566,2.3522" ou "-35.2809,-149.1300"
  const coordsRegex = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
  
  // Vérifie si la valeur saisie correspond au format des coordonnées
  if (coordsRegex.test(searchValue)) {
      // Si ce sont des coordonnées, on les divise en latitude et longitude
      // .split(",") sépare la chaîne au niveau de la virgule
      // .map() convertit chaque partie en nombre
      const [lat, lon] = searchValue.split(",").map(coord => parseFloat(coord.trim()));
      
      // Vérifie si les coordonnées sont dans des plages valides
      // Latitude : de -90° à +90°
      // Longitude : de -180° à +180°
      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
          // Si les coordonnées sont valides, on récupère la météo pour ces coordonnées
          fetchWeatherByCoords(lon, lat);
      } else {
          // Si les coordonnées sont hors limites, on affiche une erreur
          alert("Coordonnées invalides. La latitude doit être entre -90 et 90, et la longitude entre -180 et 180");
      }
  } else {
      // Si ce n'est pas des coordonnées, on traite la valeur comme un nom de ville
      fetchWeather(searchValue);
  }
});

// Initialisation
updateDate(); // Met à jour la date initiale
updateTime(); // Met à jour l'heure initiale
setInterval(updateTime, 60000); // Met à jour l'heure toutes les minutes (60000ms = 1 minute)
getUserLocation(); // Charge les données météo initiales pour l'Algérie
