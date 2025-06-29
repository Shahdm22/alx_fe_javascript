function filterQuotes() {
    const category = document.getElementById("categoryFilter").value;
    saveSelectedFilter(category);

    let filtered = (category === "all")
        ? quotes
        : quotes.filter(q => q.category === category);

    const display = document.getElementById("quoteDisplay");
    display.innerHTML = "";

    if (filtered.length === 0) {
        display.textContent = "No quotes available for this category.";
        return;
    }

    // ✅ Show one random quote
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];

    display.textContent = `"${quote.text}" — ${quote.category}`;
}
