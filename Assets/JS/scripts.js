const API_KEY = '86220d499e0b202925c9d46140b3fcaa';


const citySearchForm = document.getElementById('citySearchForm');

//`https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=${API_KEY}`


http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
function getLatLong(event){
    event.preventDefault();

    const cityQuery = document.getElementById('selectedCity').value;
    const requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityQuery}&limit=3&appid=${API_KEY}`;


    fetch(requestUrl)
        .then((response)=>{
            console.log(response);
            return response.json();
        })
        .then((data)=>{
            console.log(data);
            getWeather(data[0].lat, data[0].lon);
        });
}

function getWeather(lat, long){
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_KEY}`;

    fetch(apiUrl)
        .then((response)=>{
            console.log(response);
            return response.json();
        })
        .then((data)=>{
            console.log(data);
        });
}



citySearchForm.addEventListener('submit', getLatLong);
