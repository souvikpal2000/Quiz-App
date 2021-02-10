const container = document.querySelector(".container");

async function categoryHeader()
{
	category_url = "https://opentdb.com/api_category.php";
	const res = await fetch(category_url);
    const data = await res.json();
    //console.log(data.trivia_categories);
    var arr = data.trivia_categories;
    arr.unshift({id: 0, name: "Any Category"});

    const loadingDiv = document.querySelector(".loading");
    loadingDiv.removeChild(loadingDiv.childNodes[1]);

    arr.forEach(category => {
    	//console.log(category.name);
    	const accordionitem = document.createElement("div");
    	accordionitem.setAttribute("class", "accordion-item cat"+category.id);
    	container.appendChild(accordionitem);

    	const h2 = document.createElement("h2");
    	h2.setAttribute("class", "accordion-header");
    	h2.setAttribute("id", "heading"+category.id);
    	accordionitem.appendChild(h2);

    	const button = document.createElement("button");
    	button.setAttribute("type", "button");
    	button.setAttribute("data-bs-toggle", "collapse");
    	target = "#cat" + category.id;
    	button.setAttribute("data-bs-target", target);
    	if(category.id == 0)
    	{
    		button.setAttribute("class", "accordion-button");
    		button.setAttribute("aria-expanded", "true");
    	}
    	else
    	{
    		button.setAttribute("class", "accordion-button collapsed");
    		button.setAttribute("aria-expanded", "false");
    	}
    	controls = "cat" + category.id;
    	button.setAttribute("aria-controls", controls);
    	button.innerHTML = `<b class="text-secondary">${category.name}</b>`;
    	h2.appendChild(button);

    	participantsFunction(category.id);
    });
}

categoryHeader();

/*-------------------------------------------------------------------------------------*/

function participantsFunction(id)
{
	//console.log(id);
	const div = document.createElement("div");
	div.setAttribute("id", "cat"+id);
	if(id === 0)
	{
		div.setAttribute("class", "accordion-collapse collapse show");
	}
	else
	{
		div.setAttribute("class", "accordion-collapse collapse");
	}
	div.setAttribute("aria-labelledby", "heading"+id)
	div.setAttribute("data-bs-parent", "#accordionExample");

	const innerDiv = document.createElement("div");
	innerDiv.setAttribute("class", "accordion-body");
	innerDiv.innerHTML = "Participants Name";
	div.appendChild(innerDiv);

	document.querySelector(".cat"+id).appendChild(div);
}