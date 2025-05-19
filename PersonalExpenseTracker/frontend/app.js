async function getToken() {
    const session = await Auth.currentSession();
    return session.getIdToken().getJwtToken();
}

document.getElementById("expense-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const expense = {
    date: form.date.value,
    amount: parseFloat(form.amount.value),
    category: form.category.value,
    description: form.description.value
  };

  const res = await fetch("https://kwmq9ulhhg.execute-api.us-east-1.amazonaws.com/Prod", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(expense)
});

  const data = await res.json();
  console.log("Expense saved:", data);
});
