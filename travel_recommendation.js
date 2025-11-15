// Global data variable
let travelData = null;

// Load JSON data when the page loads
async function loadTravelData() {
  const resultsSection = document.getElementById("results");

  try {
    // IMPORTANT: same folder as HTML
    const response = await fetch("./travel_recommendation_api.json");

    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }

    travelData = await response.json();
    console.log("Travel data loaded:", travelData);
  } catch (error) {
    console.error("Error loading data:", error);
    if (resultsSection) {
      resultsSection.innerHTML = `<p style="color: red;">
        Error loading data: ${error.message}
      </p>`;
    }
  }
}

// Create one result card
function createCard(place) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${place.imageUrl}" alt="${place.name}">
    <h3>${place.name}</h3>
    <p>${place.description}</p>
  `;

  return card;
}

// Show the list of places in the results section
function renderResults(places) {
  const resultsSection = document.getElementById("results");
  resultsSection.innerHTML = "";

  if (!places || places.length === 0) {
    resultsSection.innerHTML = "<p>No results found.</p>";
    return;
  }

  places.forEach((place) => {
    const card = createCard(place);
    resultsSection.appendChild(card);
  });
}

// Main search logic
function handleSearch() {
  const searchInput = document.getElementById("searchInput");
  const resultsSection = document.getElementById("results");

  const keyword = searchInput.value.trim().toLowerCase();

  if (!travelData) {
    resultsSection.innerHTML = `
      <p style="color: red;">
        Data not loaded yet. Please wait a moment and try again.
      </p>`;
    return;
  }

  if (!keyword) {
    resultsSection.innerHTML = `
      <p>Please type a keyword like "beach", "temple", or a country name.</p>`;
    return;
  }

  let results = [];

  // 1) Beaches
  if (keyword.includes("beach")) {
    results = results.concat(travelData.beaches);
  } else {
    travelData.beaches.forEach((beach) => {
      if (beach.name.toLowerCase().includes(keyword)) {
        results.push(beach);
      }
    });
  }

  // 2) Temples
  if (keyword.includes("temple")) {
    results = results.concat(travelData.temples);
  } else {
    travelData.temples.forEach((temple) => {
      if (temple.name.toLowerCase().includes(keyword)) {
        results.push(temple);
      }
    });
  }

  // 3) Countries (search by country name; add their cities)
  travelData.countries.forEach((country) => {
    if (country.name.toLowerCase().includes(keyword)) {
      results = results.concat(country.cities);
    }
  });

  renderResults(results);
}

// Called from the HTML "Search" button
function search() {
  handleSearch();
}

// Called from the HTML "Clear" button
function clearResults() {
  const searchInput = document.getElementById("searchInput");
  const resultsSection = document.getElementById("results");

  searchInput.value = "";
  resultsSection.innerHTML = "";
}

// Run when the DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  loadTravelData();

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    });
  }
});
