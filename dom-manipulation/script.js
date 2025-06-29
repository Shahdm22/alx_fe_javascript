const quotes = [
    { text: "Believe in yourself!", category: "Motivation" },
    { text: "Stay hungry, stay foolish.", category: "Inspiration" },
    { text: "Simplicity is the ultimate sophistication.", category: "Design" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");
const newQuoteBtn = document.getElementById("newQuote");

// Populate dropdown with categories
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
    quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;
}

// Create Add Quote Form dynamically
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

// Add new quote from form
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
        alert("Quote added successfully!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
categorySelect.addEventListener("change", showRandomQuote);

// Initialize
updateCategories();
createAddQuoteForm(); // generate the form dynamically
