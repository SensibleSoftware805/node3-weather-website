const input = document.querySelector('input');
const weatherForm = document.querySelector('form');
const paraForecast = document.querySelector('p#forecast');
const paraError = document.querySelector('p#error');
const paraLocation = document.querySelector('p#location');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const location = input.value;

    paraError.textContent = '';
    paraForecast.textContent = 'Loading forecast...';
    paraLocation.textContent = '';

    fetch('http://localhost:3000/weather?address=' + encodeURIComponent(location)).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                paraError.textContent = data.error;
                paraForecast.textContent = '';
                return;
            }

            paraLocation.textContent = data.location;
            paraForecast.textContent = data.summary + ' The temperature is currently ' + data.temperature + ' degress outside. There is a ' + data.chanceRain + '% chance of rain.';
        });
    });
});