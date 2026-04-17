async function buscarClima() {
    const API_KEY = '9a27a69b326d3fb269d7ab4a8b692f89';

    const lat = -19.8856254;
    const lon = -43.9148669;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`;

    try {
        const resposta = await fetch(url);

        if (resposta.status === 401) {
            console.warn("OpenWeather: A chave da API ainda está sendo ativada. Aguarde alguns minutos.");
            return;
        }

        const dados = await resposta.json();

        if (dados.cod === 200) {
            const tempElement = document.getElementById('temp');
            const iconImg = document.getElementById('clima-icon');

            if (tempElement) {
                tempElement.innerText = `${Math.round(dados.main.temp)}°C`;
            }

            if (iconImg) {
                const iconCode = dados.weather[0].icon;
                iconImg.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
                iconImg.style.display = 'inline-block';
            }
        }
    } catch (erro) {
        console.error("Erro ao buscar clima da escola:", erro);
    }
}

buscarClima();