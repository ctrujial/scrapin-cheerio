const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs-extra');
const writeStream = fs.createWriteStream('quotes.csv');

async function init(){
   const $ = await request({
      url: 'http://quotes.toscrape.com/',
      transform: body => cheerio.load(body)
   }); 

   /*const extrayendoTitle = $('title');
   const anchor = $('h1');
   console.log(extrayendoTitle.html());
   console.log(anchor.text().trim());

   const a = $('a');
   console.log(a.text().trim());*/

   //const quote = $('div.quote').find('a');
   //console.log(quote.html());

   //const tercer_quote = $('div.quote').next().next();
   //console.log(tercer_quote.html());

   //const container = $('div.row div.col-md-8').parent().next();
   //console.log("aqui! "+container.html());


   // seleccionando las citas
   /*const citas = $('.quote span.text').each((i, el) => {
      //console.log(i, $(el).text()); //funcion de cheerio que recorre un indece y un elemento / aca lo muestra todo

      const mostrar = $(el).text();
      const exprecionRegular = mostrar.replace(/(^\“|\”$)/g,"");

      console.log(i,exprecionRegular);
   });*/


   // seleccionando las citas y el autor

   writeStream.write('quote|author|tags\n')

   $('.quote').each((i, el) => {
      //console.log(i, $(el).html());
      //extraer la frase
      const texto = $(el).find('span.text').text().replace(/(^\“|\”$)/g,"");

      const author = $(el).find('span small.author').text();

      //const tags = $(el).find('div.tags a.tag').text();

      const tags = [];
      $(el).find('div.tags a.tag').each((i, el) => tags.push($(el).text()));
      //console.log("Citas: ",texto, "\n", "Autor: ",author,"\n","tags: ",tags.join(', '));
      writeStream.write(`${texto}|${author}|${tags}\n`);

   })
}

// para extraer en un excel utilizamos e instalamos npm i fs-extra 

init();
