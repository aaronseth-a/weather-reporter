const API_KEY = '86220d499e0b202925c9d46140b3fcaa';
const currentSection = document.getElementById('currentSection');
const forecastSection = document.getElementById('forecastSection');
const citySearchForm = document.getElementById('citySearchForm');
const archiveList = document.getElementById('archiveList');


async function getAllWeather (event){
    event.preventDefault();
    currentSection.innerHTML="";
    forecastSection.innerHTML="";
    let cityReq;
    let input = document.getElementById('selectedCity');
    if(input.value.length > 0 ){
        cityReq =  input.value;
    }else if(event.currentTarget.textContent.trim() != 'Search'){
        cityReq  = event.currentTarget.textContent.trim();
    }else{
        alert('Entry invalid!');
        return;
    }
    // console.log(event.currentTarget.textContent);

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

    // console.log(forecastData);
    addToArchive(cityReq);
    displayOutput(cityReq, forecastData);
    displayArchive();
    forecastData.length=0;
    input.value ="";
}


function displayOutput(city, data){
    const testCase = `<h1>${city}</h2>
    <ul>
            <li>${data[0].date}</li>
            <li>${data[0].temp}</li>
            <li>${data[0].wind}</li>
            <li>${data[0].weather}</li>
            <li>${data[0].humidity}</li>
            </ul>`;
    
    for(i = 1; i< data.length; i++){
        const card =`<section class="card align-left mx-0">
        <div class="card-body">
            <ul>
            <li>${data[i].date}</li>
            <li>${data[i].temp}</li>
            <li>${data[i].wind}</li>
            <li>${data[i].weather}</li>
            <li>${data[i].humidity}</li>
            </ul>
            </div>
        </section>`;
        forecastSection.innerHTML += card;
    }
    
    currentSection.innerHTML = testCase;
    forecastSection.classList.remove('hidden');



}

function addToArchive(cityNew){
    let cityList = JSON.parse(localStorage.getItem('cityList'));
    if(!cityList){
        cityList= new Array();
    }
    for(let city of cityList){
        if(city===cityNew){
            return;
        }
    }
    cityList.push(cityNew);
    localStorage.setItem('cityList', JSON.stringify(cityList));
}

function displayArchive(){
    archiveList.innerHTML="";
    const archive = JSON.parse(localStorage.getItem('cityList'));
    let list= []
    for(i=0; i<archive.length; i++){
       list[i] = document.createElement('li');    
       list[i].innerHTML=`<button class="btn btn-primary btn-lg oldSearch" type="submit">${archive[i]}</button>`;
       list[i].querySelector('button').addEventListener('click',getAllWeather);
       archiveList.append(list[i]);
    }
    list.length =0;
}


document.addEventListener('DOMContentLoaded',()=>{
    if(localStorage.getItem('cityList')!=null){
        displayArchive();
    }
    citySearchForm.addEventListener('submit', getAllWeather);

});
