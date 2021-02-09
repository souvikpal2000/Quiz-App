const select = document.querySelectorAll('select');
const container = document.querySelector('.question-container');
const score = document.querySelector(".score");
var count=0;

/*-------------------------------------------------------------------------------------*/

let html = '';
async function category()
{
	category_url = "https://opentdb.com/api_category.php";
	const res = await fetch(category_url);
    const data = await res.json();
    //console.log(data.trivia_categories);
    //console.log(data.trivia_categories[0].id);
    //console.log(data.trivia_categories[0].name);
    const arrKeys = Object.keys(data.trivia_categories);
    //console.log(arrKeys[1]);
    temp = 'Any Category';
    html = `<option>${temp}</option>`;
    arrKeys.map(key => {
    	html = html + `<option value=${data.trivia_categories[key].id}>${data.trivia_categories[key].name}</option>`
    });
    //console.log(html);
    select[0].innerHTML = html;
}
category();

/*-------------------------------------------------------------------------------------*/

let get_token;
async function token() 
{
    token_url = "https://opentdb.com/api_token.php?command=request";
    const res = await fetch(token_url);
    const data = await res.json();
    get_token = data.token;
    getCategory(get_token);
};
token();

var categoryValue = "";
function getCategory(token) 
{
    categoryValue = select[0].value;
    console.log(categoryValue);
    console.log(token);
};

/*-------------------------------------------------------------------------------------*/

const question = document.querySelectorAll('.question');
$(".submit").click((e) => {
    e.preventDefault(); //Prevent page from reloading
    $(".question").remove();
    produceQuestion(categoryValue, get_token);
});

var noOfQues;
async function produceQuestion(cat,tok)
{
	count = 0;
	score.innerHTML = count;
	noOfQues = noOfQuestions();
    question_url = "https://opentdb.com/api.php?amount=" + noOfQues + "&category=" + categoryValue + "&token=" + get_token;
    if(cat==="Any Category")
    {
        question_url = "https://opentdb.com/api.php?amount=" + noOfQues + "&token=" + get_token;
    }
    //console.log(question_url);
	const res = await fetch(question_url);
    const data = await res.json();
    console.log(data);
    //console.log(data.results[0]);
    //console.log(data.results[0].incorrect_answers);
    //console.log(data.results[0].incorrect_answers.length);
    //console.log(data.results[0].correct_answer);
    //console.log(data.results.length);
    for(let i=0; i<data.results.length; i++)
    {
    	//console.log(data.results[i].question);
    	var div = document.createElement('div');
    	var bold = document.createElement('b');
    	var p = document.createElement('p');
    	p.innerHTML = data.results[i].question;
    	div.setAttribute('id', i);
    	div.setAttribute('class', "question");
    	bold.appendChild(p)
    	div.appendChild(bold);
    	container.appendChild(div);
    }

    if(document.querySelector(".submitButton").children.length == 0)
    {
    	const submitButtonDiv = document.querySelector(".submitButton");
		const submitButton = document.createElement("button");
		submitButton.setAttribute("class", "submitQuiz btn btn-success");
		submitButton.setAttribute("type", "submit");
		submitButton.setAttribute("onclick", "submitFinal()");
		submitButton.innerHTML = "SUBMIT QUIZ";
		submitButtonDiv.appendChild(submitButton);
    }

    options(data);
}

/*-------------------------------------------------------------------------------------*/

function noOfQuestions()
{
	console.log(select[1].value);
	return select[1].value;
}

/*-------------------------------------------------------------------------------------*/

var onlyCorrAns = []; //Array of Only Correct Answers
function options(data)
{
	//console.log("Inside Option Function");
	//console.log(data);
	var arr = [];
	onlyCorrAns = [];
    data.results.forEach((dta) => {
        dta.incorrect_answers.forEach((ans) => {
            arr.push(ans);
        });
        arr.push(dta.correct_answer);
        onlyCorrAns.push(dta.correct_answer);
        //console.log(arr);
        var shuffledArray = shuffleOptions(arr);
        //console.log(shuffledArray);
        printOptions(shuffledArray, data.results.indexOf(dta));
        arr = [];
    });
    console.log(onlyCorrAns);
}

/*-------------------------------------------------------------------------------------*/

function shuffleOptions(array)
{
    for (var i = array.length - 1; i > 0; i--) 
    {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
   	return array;
}

/*-------------------------------------------------------------------------------------*/

function printOptions(allOptions, index)
{
	//console.log(data.results.length);
	//console.log(index);
	const div = document.getElementById(index);
	const form = document.createElement("form");
	const button = document.createElement("button");
	button.setAttribute("id", "btn"+index);
	button.setAttribute("class","lock btn btn-secondary");
	button.setAttribute("type", "button");
	button.setAttribute("onclick", "lockAnswer(this.id)");
	button.innerHTML = "LOCK";
	form.setAttribute('class', 'options');
	div.appendChild(form);
	allOptions.forEach((option) => {
		const innerDiv = document.createElement("div");
		const input = document.createElement("input");
		const label = document.createElement("label");
		innerDiv.setAttribute("class", "opt"+index);
		input.setAttribute("type", "radio");
		input.setAttribute("name", index);
		input.setAttribute("value", option);
		input.setAttribute("onchange", "getValue(this)");
		innerDiv.appendChild(input);
		label.textContent = option;
		innerDiv.appendChild(label);
		form.appendChild(innerDiv);
	});
	form.appendChild(button);
}

/*-------------------------------------------------------------------------------------*/

let selectedValue="";
function getValue(radio)
{
   //console.log(radio.value);
   selectedValue = radio.value;
   //console.log(selectedValue);
}

/*-------------------------------------------------------------------------------------*/

function lockAnswer(index)
{
	//console.log(selectedValue);
	//console.log(selectedValue.length);
	//console.log(index);
	//console.log(index.substr(3));
	if(selectedValue.length == 0)
	{
		alert("Choose Any Option");
	}
	else
	{
		const options = document.getElementsByName(index.substr(3));
		//console.log(options);
		options.forEach((option) => {
			option.disabled = true;
		})
		var className = "opt"+index.substr(3);
		//allDiv = document.getElementsByClassName(className);
		allDiv = document.querySelectorAll("." + className);
		//console.log(allDiv);
		allDiv.forEach((Div) => {
			//console.log(Div);
			Div.classList.add("offhover");
		});
		document.querySelector(`button[id=${index}]`).disabled = true;
		if(selectedValue == onlyCorrAns[index.substr(3)])
		{
			count = count + 2;
			score.innerHTML = count;
			allDiv.forEach((Div) => {
				//console.log(Div.textContent);
				opt = Div.textContent;
				if(opt == onlyCorrAns[index.substr(3)])
				{
					Div.classList.remove("offhover");
					Div.classList.add("correctAnswer");
				}
			})
		}
		else
		{
			allDiv.forEach((Div) => {
				//console.log(Div.textContent);
				opt = Div.textContent;
				if(opt == onlyCorrAns[index.substr(3)])
				{
					Div.classList.remove("offhover");
					Div.classList.add("correctAnswer");
				}
				else if(opt == selectedValue)
				{
					Div.classList.remove("offhover");
					Div.classList.add("wrongAnswer");
				}
			})
		}	
		selectedValue = "";
	}
}