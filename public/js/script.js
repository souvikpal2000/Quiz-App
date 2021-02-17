const container = document.querySelector(".container");

(async function categoryHeader() {
  category_url = "https://opentdb.com/api_category.php";
  const res = await fetch(category_url);
  const data = await res.json();
  //console.log(data.trivia_categories);
  var arr = data.trivia_categories;
  arr.unshift({ id: 0, name: "Any Category" });

  const loadingDiv = document.querySelector(".loading");
  loadingDiv.removeChild(loadingDiv.childNodes[1]);

  arr.forEach((category) => {
    //console.log(category.name);
    const accordionitem = document.createElement("div");
    accordionitem.setAttribute("class", "accordion-item cat" + category.id);
    container.appendChild(accordionitem);

    const h2 = document.createElement("h2");
    h2.setAttribute("class", "accordion-header");
    h2.setAttribute("id", "heading" + category.id);
    accordionitem.appendChild(h2);

    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "collapse");
    target = "#cat" + category.id;
    button.setAttribute("data-bs-target", target);
    if (category.id == 0) {
      button.setAttribute("class", "accordion-button");
      button.setAttribute("aria-expanded", "true");
    } else {
      button.setAttribute("class", "accordion-button collapsed");
      button.setAttribute("aria-expanded", "false");
    }
    controls = "cat" + category.id;
    button.setAttribute("aria-controls", controls);
    button.innerHTML = `<b class="text-secondary">${category.name}</b>`;
    h2.appendChild(button);

    participantsFunction(category.id);
  });
})();

//categoryHeader();

/*-------------------------------------------------------------------------------------*/

function participantsFunction(id) {
  //console.log(id);
  const div = document.createElement("div");
  div.setAttribute("id", "cat" + id);
  if (id === 0) {
    div.setAttribute("class", "accordion-collapse collapse show");
  } else {
    div.setAttribute("class", "accordion-collapse collapse");
  }
  div.setAttribute("aria-labelledby", "heading" + id);
  div.setAttribute("data-bs-parent", "#accordionExample");

  const innerDiv = document.createElement("div");
  innerDiv.setAttribute("class", "accordion-body participants" + id);
  //innerDiv.innerHTML = "Participants Name";
  div.appendChild(innerDiv);
  document.querySelector(".cat" + id).appendChild(div);
  var table = document.createElement("table");
  var tbody = document.createElement("tbody");
  tbody.setAttribute("class", "tableBody");
  table.setAttribute("class", "table");
  table.innerHTML =
    "<thead><tr><th scope=userName>Name</th><th scope=UserMail>Email</th><th scope=userScore>Score</th><th scope=userTime>Time</th><th scope=userPast>Past Score</th></tr></thead>";
  table.appendChild(tbody);
  innerDiv.appendChild(table);
  loadScores(id);
}

/*-------------------------------------------------------------------------------------*/

async function loadScores(id) {
  score_url = "http://localhost:3000/scores/" + id;
  //alert(score_url);
  const res = await fetch(score_url);
  const data = await res.json();
  //console.log(data.scoreboard);
  //console.log(data.scoreboard.length);
  data.scoreboard.forEach((participants) => {
    if (typeof participants.score === "undefined") {
      return;
    }
    var name = participants.name;
    var email = participants.email;
    //console.log(name + " " + email);
    //console.log(participants.pastGame);
    //console.log(participants.pastGame.length);
    var score = participants.score;
    var time = new Date(participants.updatedAt);

    //console.log(score);
    // console.log(time);
    //console.log(time.toUTCString());
    printPresentScore(id, name, email, score, time.toUTCString());

    var pastScores = [];
    var pastScoreTime = [];
    participants.pastGame.forEach((data) => {
      var score = data.score;
      var time = new Date(data.updatedAt);
      //console.log(score);
      //console.log(time.toUTCString());
      pastScores.push(score);
      pastScoreTime.push(time.toUTCString());
    });
    //console.log(pastScores);
    //console.log(pastScoreTime);
  });
}

function printPresentScore(id, name, email, score, time) {
  const participants = document.querySelector(".participants" + id);
  const tableBody = participants.querySelector(".tableBody");
  const tr = document.createElement("tr");
  const userQuery = { email: email, id: id };
  tr.innerHTML = `<td>${name}</td><td>${email}</td><td>${score}</td><td>${time}</td><td><button class="btn btn-dark" onclick="getPastScore('${email}',${id})">View Past Score</button></td>`;
  tableBody.appendChild(tr);
}

async function getPastScore(...userQuery) {
  if (userQuery.length != 2) {
    return;
  }
  //console.log(userQuery);
  const url = `http://localhost:3000/user/score/?email=${userQuery[0]}&category=${userQuery[1]}&pastScore=true`;

  const res = await fetch(url);
  const data = await res.json();
  //console.log(data.pastScores);
  let alertString = "";
  if (data.pastScores.length === 0) {
    return alert("No Record");
  }
  const scoreBody = document.createElement('div');
  scoreBody.setAttribute("class","scoreBody");
  document.querySelector(".modal-body").appendChild(scoreBody);
  data.pastScores.forEach((pastData, index) => {
    const date = new Date(pastData.updatedAt);
    // date.setTime(date.getTime() + 5.3);
    //alert(date.toLocaleString());
    date.setTime(date.getTime() + 5.3);
    // alert(date.toString());
    alertString +=
      index +
      1 +
      ". " +
      "Score: " +
      pastData.score +
      " Date: " +
      date.toUTCString() +
      "\n";
    const div = document.createElement("div");
    div.innerHTML = `<b>${index+1}.</b>`+" "+`Score : ${pastData.score}<br>`+" "+`<small><i>Date: ${date.toUTCString()}<i><small>`;
    document.querySelector(".scoreBody").appendChild(div);
  });
  //alert(alertString); 
  $('#staticBackdrop').modal('show');

  // http://localhost:3000/user/score?email=test@mail.com&category=0&pastScore=true
}

function removeChildDid()
{
  const scoreBody = document.querySelector(".scoreBody");
  scoreBody.remove();
}