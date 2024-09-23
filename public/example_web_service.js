//  web service, using AJAX



async function getARandomDog() {
    const breed = document.getElementById('selectBreeds').value
    const res = await fetch('https://dog.ceo/api/breeds/image/random')
    const dog = await res.json()
    document.getElementById('imgDog').src = dog.message
}

document.getElementById("btnGetADog").onclick = getARandomDog;




async function getADog() {
    const breed = document.getElementById('selectBreeds').value
    const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
    const dog = await res.json()
    document.getElementById('imgDog').src = dog.message
}

async function GetAllBreeds(){
    const res = await fetch('https://dog.ceo/api/breeds/list/all')
    // save the responso of all the breeds as a json. json method it is on fetch output object.
    const breeds = await res.json()

    for(breed in breeds.message){    
        // create an each option element inside the select
        const option = document.createElement('option')
        option.value = breed
        option.innerText = breed
        document.getElementById('selectBreeds').appendChild(option)
    }
      
}

document.getElementById("selectBreeds").onchange = getADog

GetAllBreeds()


// auto fill
async function search(){
    const search = document.getElementById('inpSearch').value

        // If the search input is empty, don't fetch or display anything
        if (search.trim() === '') {
            document.getElementById('autocomplete_list').innerHTML = ''; // Clear previous suggestions
            return; // Exit the function
        }
    

    const res = await fetch(`http://localhost:80/apis/jerseys/team/${search}`)
    const results = await res.json()
    console.log(results.team)
    const autocomplete_list = document.getElementById('autocomplete_list')
    autocomplete_list.innerHTML = ''; // Clear previous suggestions


    if (results.length > 0) {
        results.forEach(result => {
            const item = document.createElement('div');
            item.classList.add('autocomplete-item');
            item.innerText = result.team; // Assuming result has a 'team' field

            // When clicked, insert value into the input field
            item.addEventListener('click', function() {
                document.getElementById('inpSearch').value = result.team;
                autocomplete_list.innerHTML = ''; // Clear the list after selection
            });

            autocomplete_list.appendChild(item);
        });
    }
}

document.getElementById('inpSearch').onkeyup = search


// ---------------------------------------------------------------
// web service, use the json as a template. like every on click on get random news we can get a random football news
async function getAll() {
    const res = await fetch('http://localhost:80/apis/jerseys');
    console.log(res);

    const returnedJson = await res.json();
    console.log(returnedJson);

    for (let i = 0; i < returnedJson.length; i++) {
        const jsonElement = returnedJson[i];

        // jersey equal "<li>{team} <b>{kitType}</b>  <b>{price}</b> </li>"
        let jersey = document.getElementById('jerseyTemplate').innerHTML;

        for (const key in jsonElement) {
            // replace all accurances of this "{key}" in the template
            jersey = jersey.replace(new RegExp('{' + key + '}', 'g'), jsonElement[key]);
        }

        document.getElementById('ulListUsingTemplate').innerHTML += jersey;
    }
}

getAll()

















// ---------------------------------------------------------------
// now the original service:   after we adding the key just do fetch and res.json like upper
const jsonResponse = {
    "status": "ok",
    "totalResults": 4823,
    "articles": [
        {
            "source": { "id": "the-verge", "name": "The Verge" },
            "author": "Kylie Robison",
            "title": "Alexis Ohanian is premiering his women’s soccer show on X",
            "description": "X CEO Linda Yaccarino emails staff about a TikTok-like video tab and X TV App...",
            "url": "https://www.theverge.com/2024/9/20/24250374/alexis-ohanian-twitter-x-the-offseason-midge-purce-linda-yaccarino",
            "urlToImage": "https://cdn.vox-cdn.com/thumbor/7B8eJZYbXg4F_HkICJxQN9IS1JY=/0x0:2040x1360/1200x628/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/25535555/STK160_X_TWITTER__B.jpg",
            "publishedAt": "2024-09-21T00:59:22Z",
            "content": "Alexis Ohanian is premiering his women's soccer show on X..."
        },
        {
            "source": { "id": null, "name": "Yahoo Entertainment" },
            "author": "Jeremy Gan",
            "title": "The MLS Season Pass on Apple TV is now $10 for the rest of the season",
            "description": "Soccer fans who want to catch up on the latest MLS matches for the rest of the 2024 season...",
            "url": "https://consent.yahoo.com/v2/collectConsent?sessionId=1_cc-session_6f4103e7-8dc0-494e-9621-324b85c36454",
            "urlToImage": null,
            "publishedAt": "2024-09-03T14:51:01Z",
            "content": "If you click 'Accept all', we and our partners..."
        },
        {
            "source": { "id": null, "name": "CNET" },
            "author": "Kevin Lynch",
            "title": "Premier League Soccer: Livestream Man City vs. Ipswich From Anywhere",
            "description": "Pep Guardiola's side host the newly promoted Tractor Boys...",
            "url": "https://www.cnet.com/tech/services-and-software/premier-league-soccer-livestream-man-city-vs-ipswich-from-anywhere/",
            "urlToImage": "https://www.cnet.com/a/img/resize/3ad40d9807319afd093f8d74826ecff73604bda3/hub/2024/08/23/8a6764fd-2c62-4785-8e9f-1dda5d39e6ac/gettyimages-2167146822.jpg",
            "publishedAt": "2024-08-23T13:48:25Z",
            "content": "Premier League newcomers Ipswich face a daunting task..."
        }
    ]
};

// Function to get 3 random articles
function getRandomArticles(jsonData, count) {
    const articles = jsonData.articles;
    const randomArticles = [];
    
    // Ensure we don't select more articles than available
    const maxArticles = Math.min(count, articles.length);
    
    // Get random articles
    while (randomArticles.length < maxArticles) {
        const randomIndex = Math.floor(Math.random() * articles.length);
        const randomArticle = articles[randomIndex];
        if (!randomArticles.includes(randomArticle)) {
            randomArticles.push(randomArticle);
        }
    }
    return randomArticles;
}

// Function to display articles using template
function displayArticles(articles) {
    const newsList = document.getElementById("newsList");
    const newsTemplate = document.getElementById("newsTemplate").innerHTML;

    articles.forEach(article => {
        let newsItem = newsTemplate;

        // Replace template placeholders with actual values
        newsItem = newsItem.replace(/{title}/g, article.title || "No Title");
        newsItem = newsItem.replace(/{author}/g, article.author || "Unknown Author");
        newsItem = newsItem.replace(/{source}/g, article.source.name || "Unknown Source");
        newsItem = newsItem.replace(/{description}/g, article.description || "No Description");
        newsItem = newsItem.replace(/{url}/g, article.url || "#");
        newsItem = newsItem.replace(/{urlToImage}/g, article.urlToImage || 'https://via.placeholder.com/150');

        // Append the news item to the list
        newsList.innerHTML += newsItem;
    });
}

// Get and display 3 random articles
const randomArticles = getRandomArticles(jsonResponse, 2);
displayArticles(randomArticles);