// Handle expense creation
document.getElementById("expense-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;

    const expense = {
        date: form.date.value,
        amount: parseFloat(form.amount.value),
        category: form.category.value,
        description: form.description.value,
    };

    const token = localStorage.getItem("authCode"); // Note: still using code, not actual token

    const res = await fetch('https://tcs5rtqpz9.execute-api.us-east-1.amazonaws.com/Prod/expenses', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(expense)
    });

    const data = await res.json();
    console.log("Expense saved:", data);
    form.reset();
    fetchExpenses();
});

// Load expenses
async function fetchExpenses() {
  const res = await fetch('https://tcs5rtqpz9.execute-api.us-east-1.amazonaws.com/Prod/expenses');
  const expenses = await res.json();
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  expenses.forEach((exp) => {
    const item = document.createElement("li");
    item.className = "expense-item";
    item.innerHTML = `
      <span><strong>${exp.date}</strong> - $${exp.amount.toFixed(2)} - ${exp.category}</span>
      <p>${exp.description}</p>
    `;

    console.log("Fetched expenses:", expenses);

    const actions = document.createElement("div");
    actions.className = "actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete";
    deleteBtn.onclick = async () => {
      await fetch(`https://tcs5rtqpz9.execute-api.us-east-1.amazonaws.com/Prod/expenses/${exp.expenseId}`, {
        method: "DELETE"
      });
      fetchExpenses();
    };

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit";
    editBtn.onclick = async () => {
      const newAmount = prompt("Enter new amount:", exp.amount);
      const newCategory = prompt("Enter new category:", exp.category);
      const newDescription = prompt("Enter new description:", exp.description);

      if (!exp.expenseId) {
        alert("Missing expense ID!");
        return;
      }

      await fetch(`https://tcs5rtqpz9.execute-api.us-east-1.amazonaws.com/Prod/expenses/${exp.expenseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: parseFloat(newAmount),
          category: newCategory,
          description: newDescription
        }),
      });

      fetchExpenses();
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    item.appendChild(actions);
    list.appendChild(item);
  });
}


document.addEventListener("DOMContentLoaded", fetchExpenses);

// --- Config ---
const domain = "https://us-east-1gzfiqu7lo.auth.us-east-1.amazoncognito.com";
const clientId = "3rtn21q7juncon6lf9r5sns5ll";
const redirectUri = "https%3A%2F%2Fd3nx33vphucgqw.cloudfront.net";

// --- Handle login redirect ---
function parseToken() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (code) {
    localStorage.setItem("authCode", code);
    window.history.replaceState({}, document.title, "/"); // Clean URL
  }
}

parseToken(); // Run on page load

// --- UI setup ---
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const token = localStorage.getItem("authCode");

if (token) {
  loginBtn.style.display = "none";
  logoutBtn.style.display = "inline";
} else {
  loginBtn.style.display = "inline";
  logoutBtn.style.display = "none";
}

// --- Login link ---
loginBtn.href = `https://us-east-1gzfiqu7lo.auth.us-east-1.amazoncognito.com/login?client_id=3rtn21q7juncon6lf9r5sns5ll&redirect_uri=https://d3nx33vphucgqw.cloudfront.net&response_type=code&scope=email+openid+profile`;

// --- Logout handler ---
logoutBtn.onclick = () => {
  localStorage.removeItem("authCode");
  window.location.href = `https://us-east-1gzfiqu7lo.auth.us-east-1.amazoncognito.com/login?client_id=3rtn21q7juncon6lf9r5sns5ll&redirect_uri=https://d3nx33vphucgqw.cloudfront.net&response_type=code&scope=email+openid+profile`;
};
