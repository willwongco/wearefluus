
function debounce(func, wait, immediate) {
    var timeout;
    return function executedFunction() {
      var context = this;
      var args = arguments;
          
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callNow = immediate && !timeout;
      
      clearTimeout(timeout);

      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(context, args);
    };
  };
  class PredictiveSearchArticles extends HTMLElement {
    constructor() {
      super();

      this.input = this.querySelector('input[type="search"]');
      this.predictiveSearchContainer = document.querySelector(".article_predictive_search");
      this.predictiveSearchResults = this.querySelector('#predictive-search-articles');

      this.input.addEventListener('input', debounce((event) => {
        this.onChange(event);
      }, 300).bind(this));
      if(this.predictiveSearchContainer != undefined && this.predictiveSearchContainer != null){

        this.input.addEventListener("blur", () => {
          if(this.predictiveSearchResults.style.display == "none"){
            this.predictiveSearchContainer.classList.remove("active");
          }
        });

        this.input.addEventListener('focus', () => {
          this.predictiveSearchContainer.classList.add("active");
         });
      }
    }

    onChange() {
      const searchTerm = this.input.value.trim();
      if (!searchTerm.length) {
        this.close();
        return;
      }

      this.getSearchResults(searchTerm);
    }

    getSearchResults(searchTerm) {
      fetch(`/search/suggest?q=${searchTerm}&resources[type]=article&resources[limit]=4&section_id=predictive-search-articles`)
        .then((response) => {
          if (!response.ok) {
            var error = new Error(response.status);
            this.close();
            throw error;
          }

          return response.text();
        })
        .then((text) => {
          const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search-articles').innerHTML;
          this.predictiveSearchResults.innerHTML = resultsMarkup;
          this.open();
        })
        .catch((error) => {
          this.close();
          throw error;
        });
    }

    open() {
      this.predictiveSearchResults.style.display = 'block';
    }
    close() {
      this.predictiveSearchResults.style.display = 'none';
    }
  }
  customElements.define('predictive-search-articles', PredictiveSearchArticles);
