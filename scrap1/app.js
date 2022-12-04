import { chromium } from 'playwright'

//1. generar resultados de google chrome

async function obtenerDatosDeGoogle(query, browser) {

    const page = await browser.newPage(); // abrir una pestaña
    await page.goto('https://www.google.com/'); // en la pagina visitemos google

    await page.waitForSelector('input[name="q"]');

    await page.type('input[name="q"]', query); // tome este selector de google
    await page.keyboard.press('Enter'); //

    
    
    await page.waitForNavigation({ waitUntil: 'networkidle'}); // espere hasta que la red este tranquila, hasta que alla terminado todas las consultas

    const listadoResultados = await page.evaluate(()=>{// metodo de la pagina
         let resultado = [];
         document.querySelectorAll('div [data-header-feature] div a').forEach((anchor, index)=>{
            // recorrer cada elemento y en cada parada se ejecuta una funcion
            resultado.push({
                index: index,
                title: anchor.innerText,
                url: anchor.href,
            });

         });

        return resultado;
    });

    //console.log(listadoResultados);
    return listadoResultados;

}
 
//2. visitar resultados y extraer informacion

async function visitarResultadosObteniendoContenido(resultado, browser){

    const page = await browser.newPage();
    await page.goto(resultado.url);
    await page.waitForLoadState('domcontentloaded');// espera hasta que se ejecute todo el contenido del dom
    const contenido = await page.evaluate(() => {
        const rawText =
         document.querySelector('main')?.innerText || document.querySelector('body')?.innerText;

        return rawText;
    });

    //console.log(contenido);
    return contenido;
}

async function inicarScraping(query){

    const browser = await chromium.launch();
    const TodoTexto = [];

    const listadoResultados = await obtenerDatosDeGoogle(query, browser);
    // sincrono
    /*listadoResultados.forEach(resultado => {
        visitarResultadosObteniendoContenido(resultado, browser);
    });*/
    // asincrono
    for await(const url of listadoResultados){
        const contenido =  await visitarResultadosObteniendoContenido(url, browser);
        TodoTexto.push(contenido);
    }
    console.log(TodoTexto);
    await browser.close();
}

let queryTerminal = process.argv.slice(2)[0];
inicarScraping(queryTerminal);

 