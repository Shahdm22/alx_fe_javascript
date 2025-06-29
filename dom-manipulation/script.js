let quotes = [];

// Load quotes from localStorage or set default
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        try {
            quotes = JSON.parse(storedQuotes);
        } catch (error) {
            console.error("Failed to parse stored quotes:", error);
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

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Save selected category filter
function saveSelectedFilter(category) {
    localStorage.setItem("lastSelectedFilter", category);
}

// Load selected category filter
function loadSelectedFilter() {
    return localStorage.getItem("lastSelectedFilter") || "all";
}

// Populate categories in filter dropdown
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");

    const categories = quotes.map(q => q.category);
    const uniqueCategories = [...new Set(categories)];

    categoryFilter.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Categories";
    categoryFilter.appendChild(allOption); // ✅ appendChild

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option); // ✅ appendChild
    });

    // Restore last selected filter
    const savedFilter = loadSelectedFilter();
    categoryFilter.value = savedFilter;
    filterQuotes();
}

// Show one random quote from selected category
function filterQuotes() {
    const category = document.getElementById("categoryFilter").value;
    saveSelectedFilter(category);

    let filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);

    const display = document.getElementById("quoteDisplay");
    display.innerHTML = "";

    if (filtered.length === 0) {
        display.textContent = "No quotes available for this category.";
        return;
    }

    // ✅ Use Math.random
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];

    display.textContent = `"${quote.text}" — ${quote.category}`;

    // Save last quote to sessionStorage
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Create form dynamically
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
        populateCategories();
        alert("Quote added successfully!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Export quotes to JSON file
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

// Import quotes from JSON file
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

// Load last viewed quote from sessionStorage (optional)
function loadLastSessionQuote() {
    const last = sessionStorage.getItem("lastQuote");
    if (last) {
        const quote = JSON.parse(last);
        const display = document.getElementById("quoteDisplay");
        display.textContent = `"${quote.text}" — ${quote.category}`;
    }
}

// Initialize
loadQuotes();
createAddQuoteForm();
populateCategories();
loadLastSessionQuote();

// Event Listeners
document.getElementById("newQuote").addEventListener("click", filterQuotes);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
