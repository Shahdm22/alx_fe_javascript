let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        try {
            quotes = JSON.parse(storedQuotes);
        } catch (error) {
            console.error("Failed to parse quotes:", error);
            quotes = [];
        }
    } else {
        quotes = [
            { text: "Believe in yourself!", category: "Motivation" },
            { text: "Stay hungry, stay foolish.", category: "Inspiration" },
            { text: "Simplicity is the ultimate sophistication.", category: "Design" },
            { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
        ];
        saveQuotes();
    }
}

// Save to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Save selected filter
function saveSelectedFilter(category) {
    localStorage.setItem("lastSelectedFilter", category);
}

// Load last selected filter
function loadSelectedFilter() {
    return localStorage.getItem("lastSelectedFilter") || "all";
}

// Populate categories in both dropdowns
function populateCategories() {
    const categories = new Set(quotes.map(q => q.category));

    // Populate filter dropdown
    const filterDropdown = document.getElementById("categoryFilter");
    filterDropdown.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        filterDropdown.appendChild(option);
    });

    // Apply last filter
    const savedFilter = loadSelectedFilter();
    filterDropdown.value = savedFilter;
    filterQuotes();
}

// Filter quotes based on selected category
function filterQuotes() {
    const category = document.getElementById("categoryFilter").value;
    saveSelectedFilter(category);

    const filtered = (category === "all")
        ? quotes
        : quotes.filter(q => q.category === category);

    const display = document.getElementById("quoteDisplay");
    display.innerHTML = "";

    if (filtered.length === 0) {
        display.textContent = "No quotes available for this category.";
        return;
    }

    filtered.forEach(q => {
        const div = document.createElement("div");
        div.textContent = `"${q.text}" — ${q.category}`;
        div.style.marginBottom = "10px";
        display.appendChild(div);
    });
}

// Add new quote
function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newText && newCategory) {
        quotes.push({ text: newText, category: newCategory });
        textInput.value = "";
        categoryInput.value = "";

        saveQuotes();
        populateCategories(); // updates dropdowns with any new categories
        alert("Quote added successfully!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Create add-quote form
function createAddQuoteForm() {
    const formContainer = document.getElementById("formContainer");

    const heading = document.createElement("h2");
    heading.textContent = "Add a New Quote";

    const quoteInput = document.createElement("input");
    quoteInput.type = "text";
    quoteInput.id = "newQuoteText";
    quoteInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "newQuoteCategory";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.addEventListener("click", addQuote);

    formContainer.appendChild(heading);
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
}

// Import/export from JSON
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid JSON structure.");
            }
        } catch (err) {
            alert("Failed to import quotes. Check your file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();

    URL.revokeObjectURL(url);
}

// DOM elements
const newQuoteBtn = document.getElementById("newQuote");
newQuoteBtn.addEventListener("click", () => {
    const current = document.getElementById("categoryFilter").value;
    document.getElementById("categoryFilter").value = current;
    filterQuotes(); // Refilter and refresh
});

// Init
loadQuotes();
createAddQuoteForm();
populateCategories();
