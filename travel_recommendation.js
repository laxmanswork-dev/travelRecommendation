let travelData = null;

async function loadTravelData() {
  try {
    const response = await fetch("travel_recommendation_api.json");
    travelData = await response.json();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function renderResults(results) {
  const container = document.getElementById("results-container");
  container.innerHTML = "";

  if (!results || results.length === 0) {
    container.innerHTML = "<p>No destinations found. Try another keyword.</p>";
    return;
  }

  results.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.name;

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const tag = document.createElement("div");
    tag.className = "tag";
    tag.textContent = item.type + " • " + item.country;

    const desc = document.createElement("p");
    desc.textContent = item.description;

    const bookBtn = document.createElement("button");
    bookBtn.className = "book-btn";
    bookBtn.textContent = "Book Now";
    bookBtn.addEventListener("click", () => {
      alert(`Booking initiated for ${item.name}!`);
    });

    body.appendChild(title);
    body.appendChild(tag);
    body.appendChild(desc);
    body.appendChild(bookBtn);

    card.appendChild(img);
    card.appendChild(body);

    container.appendChild(card);
  });
}

function searchDestinations(keyword) {
  if (!travelData || !travelData.destinations) return [];

  const term = keyword.trim().toLowerCase();
  if (term === "") return [];

  return travelData.destinations.filter((item) => {
    return (
      item.name.toLowerCase().includes(term) ||
      item.country.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
  });
}

function handleSearch() {
  const input = document.getElementById("search-input");
  const keyword = input.value;

  const results = searchDestinations(keyword);
  renderResults(results);
}

function handleClear() {
  const input = document.getElementById("search-input");
  input.value = "";
  renderResults([]);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadTravelData();

  const searchBtn = document.getElementById("search-btn");
  const clearBtn = document.getElementById("clear-btn");

  searchBtn.addEventListener("click", handleSearch);
  clearBtn.addEventListener("click", handleClear);
});
