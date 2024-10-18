// shabo ajax web service
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


// ----------------------------------------------------------------------------------------------------------------
// shabo added auto fill
async function search(){
    const search = document.getElementById('inpSearch').value

        // If the search input is empty, don't fetch or display anything
        if (search.trim() === '') {
            document.getElementById('autocomplete_list').innerHTML = ''; // Clear previous suggestions
            return; // Exit the function
        }


    const res = await fetch(`http://localhost:80/apis/jerseys/team/${search}`)
    const results = await res.json()
    const autocomplete_list = document.getElementById('autocomplete_list')
    autocomplete_list.innerHTML = ''; // Clear previous suggestions


    if (results.length > 0) {
        results.forEach(result => {
            const item = document.createElement('div');
            item.classList.add('autocomplete-item');
            item.innerText = result.team + " " + result.kitType; // Assuming result has a 'team' field
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




// ----------------------------------------------------------------------------------------------------------------
// shabo added web service
async function getNews() {
  const res = await fetch('http://localhost:80/apis/news'); // Calls your backend API
  const jsonResponse = await res.json();
  console.log(jsonResponse);
  return jsonResponse;
}

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
async function loadNews() {
    const jsonResponse = await getNews()
    const randomArticles = getRandomArticles(jsonResponse, 2);
    displayArticles(randomArticles);
}

loadNews();