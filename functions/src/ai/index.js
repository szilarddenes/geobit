const processContent = require('./process-content');
const searchNews = require('./search-news');

// Export the functions
module.exports = {
    processArticleContent: processContent.processArticleContent,
    searchGeoscienceNews: searchNews.searchGeoscienceNews
}; 