App = React.createClass({

  getInitialState() {
    return {
        loading: false,
        searchingText: '',
        gif: {}
    };
},

handleSearch: function(searchingText) {  // 1.Pobierz na wejsciu wpisywany tekst
  this.setState({
    loading: true  // 2.Zasygnalizuj ze zaczal sie proces ladowania
  });
  this.getGif(searchingText, function(gif) {  // 3.Rozpocznij pobieranie gifa
    this.setState({  // 4. Na zakonczenie pobierania
      loading: false,  // a.Przestan sygnalizowac ladowanie
      gif: gif,  // b.Ustaw nowego gifa z wyniku pobierania
      searchingText: searchingText  // c.Ustaw nowy stan dla wyszukiwanego tekstu
    });
  }.bind(this)); //aby zachowac kontekst
},

getGif: function(searchingText, callback) {  // 1.Na wejście metody getGif przyjmujemy dwa parametry: wpisywany tekst (searchingText) i funkcję, 
  //która ma się wykonać po pobraniu gifa (callback).
  var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;  
  // 2. Konstruujemy adres URL dla API Giphy
  var xhr = new XMLHttpRequest();  
  // 3.Wywołujemy całą sekwencję tworzenia zapytania XHR do serwera i wysyłamy je.
  xhr.open('GET', url);
  xhr.onload = function() {
      if (xhr.status === 200) {
         var data = JSON.parse(xhr.responseText).data; 
         // 4.W obiekcie odpowiedzi mamy obiekt z danymi. W tym miejscu rozpakowujemy je sobie 
         // do zmiennej data, aby nie pisać za każdym razem response.data.
          var gif = {  // 5.Układamy obiekt gif na podstawie tego, co otrzymaliśmy z serwera
              url: data.fixed_width_downsampled_url,
              sourceUrl: data.url
          };
          callback(gif);  // 6.Przekazujemy obiekt do funkcji callback, 
          //którą przekazaliśmy jako drugi parametr metody getGif.
      }
  };
  xhr.send();
},
  render: function() {

      var styles = {
          margin: '0 auto',
          textAlign: 'center',
          width: '90%'
      };

      return (
        <div style={styles}>
              <h1>Wyszukiwarka GIFow!</h1>
              <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
              
              <Search onSearch={this.handleSearch} />
          
          <Gif 
            loading={this.state.loading}
            url={this.state.gif.url}
            sourceUrl={this.state.gif.sourceUrl}
          />
        </div>
      );
  }
});