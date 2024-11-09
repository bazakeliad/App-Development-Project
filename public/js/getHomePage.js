async function getNews() {
  const res = await fetch('http://localhost:80/apis/news');
  const jsonResponse = await res.json();
  console.log(jsonResponse);
  return jsonResponse;
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
    displayArticles(jsonResponse);
}

loadNews();