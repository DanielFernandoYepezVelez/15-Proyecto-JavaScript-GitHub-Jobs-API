const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

document.addEventListener('DOMContentLoaded', () => {
    formulario.addEventListener('submit', validarBusqueda);
})

function validarBusqueda(e) {
    e.preventDefault();

    const busqueda = document.querySelector('#busqueda').value;

    if (busqueda.length < 3) {
        mostrarMensaje('Busqueda Muy Corta... Añade Más Información');
        return;
    }

    consultarAPI(busqueda);
}

function mostrarMensaje(mensaje) {
    const alerta = document.createElement('p');
    const alertaPrevia = document.querySelector('.alerta');

    if (!alertaPrevia) {
        alerta.classList.add('bg-gray-100', 'p-3', 'text-center', 'mt-3', 'alerta');
        alerta.textContent = mensaje;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function consultarAPI(busqueda) {
    const GitHubUrl = `https://jobs.github.com/positions.json?search=${busqueda}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(GitHubUrl)}`;

    axios.get(proxyUrl)
        .then(resp => mostrarVacantes(JSON.parse(resp.data.contents)));
}

function mostrarVacantes(vacantes) {
    limpiarHTML();

    if (vacantes.length > 0) {
        resultado.classList.add('grid');

        vacantes.forEach(vacante => {
            const { company, title, type, url } = vacante;

            resultado.innerHTML += `
              <div class="shadow bg-white p-6 rounded">
                <h2 class="text-2xl font-light mb-4">${title}</h2>
                <p class="font-bold uppercase">Compañia:  <span class="font-light normal-case">${company} </span></p>
                <p class="font-bold uppercase">Tipo de Contrato:   <span class="font-light normal-case">${type} </span></p>
                <a class="bg-teal-500 max-w-lg mx-auto mt-3 rounded p-2 block uppercase font-xl font-bold text-white text-center" href="${url}">Ver Vacante</a>
              </div>
            `;
        });
    } else {
        const noResultado = document.createElement('p');

        resultado.classList.remove('grid');
        noResultado.classList.add('text-center', 'mt-10', 'text-gray-600', 'w-full');

        noResultado.textContent = 'No Hay Vacante, Intenta Con Otro Término De Busqueda';
        resultado.appendChild(noResultado);
    }
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}