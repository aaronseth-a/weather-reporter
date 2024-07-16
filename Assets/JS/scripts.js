const API_KEY = '86220d499e0b202925c9d46140b3fcaa';
const currentSection = document.getElementById('currentSection');
const forecastSection = document.getElementById('forecastSection');
const citySearchForm = document.getElementById('citySearchForm');
const archiveList = document.getElementById('archiveList');


async function getAllWeather (event){
    event.preventDefault();
    let cityReq;
    if(document.getElementById('selectedCity').value.length > 0 ){
        cityReq =  document.getElementById('selectedCity').value;
    }else if(event.currentTarget.textContent.trim() != 'Search'){
        cityReq  = event.currentTarget.textContent.trim();
    }else{
        alert('Entry invalid!');
        return;
    }

    const currentUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityReq}&appid=${API_KEY}`;
    const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${cityReq}&appid=${API_KEY}`;



    const forecastData =[{
        date: "mm/dd/yyyy",
        temp: "deg",
        wind: 0,
        weather: 'clear',
        humidity: 0,
    }];



    let response = await fetch(currentUrl).then((response)=>response.json());
    forecastData[0]={
        date: new Date(response.dt * 1000).toLocaleDateString(),
        temp: ((response.main.temp - 273.15) * (9/5) + 32).toFixed(2)+' \u00B0F',
        wind: response.wind.speed,
        weather: response.weather[0].main,
        humidity: response.main.humidity
    }

    response = await fetch(forecastUrl).then((response)=>response.json());
    //console.log(response);
    let n = 1;
    for(i=4; i<response.list.length ; i+=8){
        forecastData[n]={
            date: new Date(response.list[i].dt * 1000).toLocaleDateString(),
            temp: ((response.list[i].main.temp - 273.15) * (9/5) + 32).toFixed(2)+' \u00B0F',
            wind: response.list[i].wind.speed,
            weather: response.list[i].weather[0].main,
            humidity: response.list[i].main.humidity
        }
        n+=1;
    }

    console.log(forecastData);

    displayOutput(cityReq, forecastData);
    addToArchive(cityReq);

}


function displayOutput(city, data){
    const testCase = `<h1>${city}</h2>`;
    
    currentSection.innerHTML = testCase;
    



}

window.addEventListener('load',()=>{
    citySearchForm.addEventListener('submit', getAllWeather);
});
