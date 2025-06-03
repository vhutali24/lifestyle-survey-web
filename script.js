function showFillSurvey() {
  document.getElementById("fillSurvey").style.display = "block";
  document.getElementById("viewResults").style.display = "none";
}

function showResults() {
  document.getElementById("fillSurvey").style.display = "none";
  document.getElementById("viewResults").style.display = "block";
  displayResults();
}

let lastClearedSurveys = [];

document.getElementById("surveyForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const survey = {
    name: document.getElementById("name").value,
    surname: document.getElementById("surname").value,
    contact: document.getElementById("contact").value,
    email: document.getElementById("email").value,
    dob: document.getElementById("dob").value,
    surveyDate: document.getElementById("surveyDate").value,
    favouriteFood: Array.from(document.querySelectorAll("input[name='food']:checked")).map(f => f.value).join(", "),
    eatOutRating: document.querySelector("input[name='eatOutRating']:checked")?.value || "",
    q1: document.querySelector("input[name='q1']:checked")?.value || "",
    q2: document.querySelector("input[name='q2']:checked")?.value || "",
    q3: document.querySelector("input[name='q3']:checked")?.value || "",
    q4: document.querySelector("input[name='q4']:checked")?.value || ""
  };

  let surveys = JSON.parse(localStorage.getItem("surveys")) || [];
  surveys.push(survey);
  localStorage.setItem("surveys", JSON.stringify(surveys));

  alert("Survey submitted successfully!");
  document.getElementById("surveyForm").reset();
});

function displayResults() {
  const surveys = JSON.parse(localStorage.getItem("surveys")) || [];
  const resultsDiv = document.getElementById("resultsDisplay");

  if (surveys.length === 0) {
    resultsDiv.innerHTML = "<p>No survey results available yet.</p>";
    return;
  }

  let table = "<table><thead><tr>" +
              "<th>Name</th><th>Surname</th><th>Contact</th><th>Email</th>" +
              "<th>DOB</th><th>Survey Date</th><th>Favourite Food</th><th>Eat Out Rating</th></tr></thead><tbody>";

  surveys.forEach(s => {
    table += `<tr>
                <td>${s.name}</td>
                <td>${s.surname}</td>
                <td>${s.contact}</td>
                <td>${s.email}</td>
                <td>${s.dob}</td>
                <td>${s.surveyDate}</td>
                <td>${s.favouriteFood}</td>
                <td>${s.eatOutRating}</td>
              </tr>`;
  });

  table += "</tbody></table>";

  const total = surveys.length;
  const avgAge = (
    surveys.reduce((sum, s) => sum + getAge(s.dob), 0) / total
  ).toFixed(1);

  const pizzaCount = surveys.filter(s => s.favouriteFood.includes("Pizza")).length;
  const pizzaPercentage = ((pizzaCount / total) * 100).toFixed(1);

  const avgQ1 = averageOf(surveys.map(s => parseInt(s.q1)));
  const avgQ2 = averageOf(surveys.map(s => parseInt(s.q2)));
  const avgQ3 = averageOf(surveys.map(s => parseInt(s.q3)));
  const avgQ4 = averageOf(surveys.map(s => parseInt(s.q4)));

  const stats = `
    <h3>Summary Statistics</h3>
    <p><strong>Total Responses:</strong> ${total}</p>
    <p><strong>Average Age:</strong> ${avgAge}</p>
    <p><strong>Pizza Lovers:</strong> ${pizzaPercentage}%</p>
    <p><strong>Average Agreement Scores:</strong></p>
    <ul>
      <li>I enjoy spending time outdoors: ${avgQ1}</li>
      <li>I prefer healthy food options: ${avgQ2}</li>
      <li>I exercise regularly: ${avgQ3}</li>
      <li>I enjoy cooking at home: ${avgQ4}</li>
    </ul>
  `;

  resultsDiv.innerHTML = table + stats;
}

function getAge(dob) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function averageOf(values) {
  const valid = values.filter(v => !isNaN(v));
  if (valid.length === 0) return "N/A";
  return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1);
}

function clearResults() {
  const confirmClear = confirm("Are you sure you want to delete all saved survey results?");
  if (confirmClear) {
    const current = localStorage.getItem("surveys");
    if (current) {
      lastClearedSurveys = JSON.parse(current);
      localStorage.removeItem("surveys");
      alert("All survey results have been cleared.");
      document.getElementById("undoMessage").style.display = "block";
      displayResults(); // Refresh
    }
  }
}

function undoClear() {
  if (lastClearedSurveys.length > 0) {
    localStorage.setItem("surveys", JSON.stringify(lastClearedSurveys));
    alert("Survey results restored.");
    lastClearedSurveys = [];
    document.getElementById("undoMessage").style.display = "none";
    displayResults();
  }
}
