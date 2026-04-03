let travelData = null;

fetch("./travel_recommendation_api.json")
    .then(res => res.json())
    .then(data => {
        travelData = data;
        console.log("✅ Travel data loaded");
    });

function searchTravel(query) {
    if (!travelData) return [];

    query = query.toLowerCase();
    const results = [];

    travelData.countries.forEach(country => {
        country.cities.forEach(city => {
            if (
                city.name.toLowerCase().includes(query) ||
                city.description.toLowerCase().includes(query)
            ) {
                results.push(city);
            }
        });
    });

    travelData.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(query)) results.push(temple);
    });

    travelData.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(query)) results.push(beach);
    });

    return results;
}

function showDropdown() {
    const query = document.getElementById("conditionInput").value;
    const dropdown = document.getElementById("dropdownResults");

    if (query.trim() === "") {
        dropdown.style.display = "none";
        return;
    }

    const results = searchTravel(query);
    dropdown.innerHTML = results
        .map(item => `
            <div class="dropdown-item" onclick="selectItem('${item.name}')">
                ${item.name}
            </div>
        `)
        .join("");

    dropdown.style.display = results.length > 0 ? "block" : "none";
}

function selectItem(name) {
    document.getElementById("conditionInput").value = name;
    document.getElementById("dropdownResults").style.display = "none";
    showResults();
}

function showResults() {
    const query = document.getElementById("conditionInput").value;
    const results = searchTravel(query);

    const html = results
        .map(item => `
            <div class="result-card">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <img src="${item.imageUrl}" alt="${item.name}">
            </div>
        `)
        .join("");

    document.getElementById("results").innerHTML =
        html || `<p style="color:white;">No results found.</p>`;
}

document.getElementById("btnClear").onclick = function () {
    document.getElementById("conditionInput").value = "";
    document.getElementById("dropdownResults").style.display = "none";
    document.getElementById("results").innerHTML = "";
};