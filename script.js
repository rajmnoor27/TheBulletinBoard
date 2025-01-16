
//Enter your New York Times API Key here
const NYT_API_KEY = '';

//Enter your Bing Search API Key here
const BING_API_KEY = '';

//Enter your NewsAPI API Key here
const NEWS_API_KEY = '';


function searchArticles() {
  const keyword = document.getElementById("keyword").value.trim();
  if (keyword === "") {
      alert("Please enter a keyword");
      return;
  }
  // Clear previous results
  document.getElementById("printNYT").innerHTML = "";
  document.getElementById("printBing").innerHTML = "";
  document.getElementById("printNewsApi").innerHTML = "";

  executeBing(keyword);
  executeNYT(keyword);
  executeNewsAPI(keyword);
}

function displayArticles(articles, noResultsMessage, targetDivID, source) {
  let output = "";
  let count = 0;
  const validArticles = [];

  for(let article of articles){
    if(validArticles.length == 2){
      break;
    }  
    if(article.title === '[Removed]'){
      continue;
    }

    validArticles.push(article);
  }

  
  if (validArticles.length === 0) {
    output = `
    <div class="sticky-note">
        <p>${noResultsMessage}</p>
    </div>`;
  } else {
    validArticles.forEach(article => {
      output += `
        <div class="sticky-note">
          <img src="img/pin.png" class="pin" alt="Pin">
          <h2>${article.title}</h2>
          <p>${article.description}</p>
          <a href="${article.url}" target="_blank" class="smallbutton">Read more</a>
          <a href="mailto:someone@example.com?subject=Read This Article!&body=Article Title - ${encodeURIComponent(article.title)}%0A%0AArticle Description - ${encodeURIComponent(article.description)}%0A%0AArticle Link - ${encodeURIComponent(article.url)}%0A%0AThank you!" class="smallbutton">Share Article</a>
        </div>
      `;
    });
    document.getElementById(targetDivID).innerHTML += output; 
    const stickyNotes = document.querySelectorAll('.sticky-note');
        stickyNotes.forEach(note => {
            note.style.display = 'block';
    });
  }
}

function executeNYT(keyword) {
    if(NYT_API_KEY == ''){
      document.getElementById('printNYT').innerHTML = '<div class="sticky-note"><img src="img/pin.png" class="pin" alt="Pin"><h2>No API Key found. Unable to search for articles.</h2></div>';
      const stickyNotes = document.querySelectorAll('.sticky-note');
        stickyNotes.forEach(note => {
            note.style.display = 'block';
    });
    }else{
      const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(keyword)}&api-key=${NYT_API_KEY}`;
      const options = {
        method: "GET",
        headers: {
          "Accept": "application/json"
        },
      };
      fetch(url, options).then(
      response => response.ok ? response.json() : Promise.reject(response))
      .then(data => {
        const articles = data.response.docs.map(article => ({
          title: article.headline.main,
          description: article.snippet,
          url: article.web_url
        }));
        displayArticles(articles, "No NYT articles found for this keyword.", "printNYT", "The New York Times");
      })
      .catch(err => {
        console.error(err);
        document.getElementById(targetDivID).innerHTML = "Error fetching NYT data.";
      });
    }
  }

function executeBing(keyword) { 
      if(BING_API_KEY == ''){
        document.getElementById('printBing').innerHTML = '<div class="sticky-note"><img src="img/pin.png" class="pin" alt="Pin"><h2>No API Key found. Unable to search for articles.</h2></div>';
        const stickyNotes = document.querySelectorAll('.sticky-note');
        stickyNotes.forEach(note => {
            note.style.display = 'block';
      });
      }else{
        const url = `https://api.bing.microsoft.com/v7.0/news/search?q=${encodeURIComponent(keyword)}&mkt=en-US`;
        // Fetch request
        fetch(url, { headers: { "Ocp-Apim-Subscription-Key": BING_API_KEY } })
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => {
          const articles = data.value.map(article => ({
            title: article.name,
            description: article.description,
            url: article.url
          }));
          console.log(data);
          displayArticles(articles, "No Bing articles found for this keyword.","printBing");
        })
        .catch(err => {
          console.error(err);
          document.getElementById(targetDivID).innerHTML = "Error fetching Bing data.";
        });
      }
    }
  
  function executeNewsAPI(keyword) {
    if(NEWS_API_KEY == ''){
      document.getElementById('printNewsApi').innerHTML = '<div class="sticky-note"><img src="img/pin.png" class="pin" alt="Pin"><h2>No API Key found. Unable to search for articles.</h2></div>';
      const stickyNotes = document.querySelectorAll('.sticky-note');
      stickyNotes.forEach(note => {
          note.style.display = 'block';
      });
    }else{
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}`;
      fetch(url, { headers: { "X-Api-Key": NEWS_API_KEY } })
      .then(response => response.ok ? response.json() : Promise.reject(response))
      .then(data => {
        const articles = data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url
        }));
        displayArticles(articles, "No NewsAPI articles found for this keyword.","printNewsApi");
      })
      .catch(err => {
        console.error(err);
        document.getElementById(targetDivID).innerHTML = "Error fetching NewsAPI data.";
      });
    }
  }
