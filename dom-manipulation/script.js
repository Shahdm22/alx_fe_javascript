let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        try {
            quotes = JSON.parse(storedQuotes);
        } catch (error) {
            console.error("Error parsing stored quotes:", error);
            quotes = [];
        }
    } else {
        // Default quotes
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

// Show a random quote
function showRandomQuote() {
    const selectedCategory = categorySelect.value;
    let filteredQuotes = quotes;

    if (selectedCategory !== "all") {
        filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const selectedQuote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${selectedQuote.text}" — ${selectedQuote.category}`;

    // Save last shown quote to session storage
    sessionStorage.setItem("lastQuote", JSON.stringify(selectedQuote));
}

// Update category options
function updateCategories() {
    const categories = new Set(quotes.map(q => q.category));
    categorySelect.innerHTML = '<option value="all">All</option>';
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
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
        updateCategories();
        saveQuotes();
        alert("Quote added successfully!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Dynamically create form
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

// Export quotes to a downloadable JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();

    URL.revokeObjectURL(url); // Clean up
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
                updateCategories();
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

// Load last quote from session storage (optional enhancement)
function loadLastSessionQuote() {
    const last = sessionStorage.getItem("lastQuote");
    if (last) {
        const quote = JSON.parse(last);
        quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
    }
}

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");
const newQuoteBtn = document.getElementById("newQuote");

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
categorySelect.addEventListener("change", showRandomQuote);

// Initialize
loadQuotes();
updateCategories();
createAddQuoteForm();
loadLastSessionQuote();
