const fs = require('fs')
const chalk = require('chalk')
const various = require('./various')
const settings = require("../../settings.json");
// const settings = require("../../../settings.json"); //En raspberry

const cheerio = require("cheerio");
const axios = require('axios-https-proxy-fix')

const axiosCookieJarSupport = require('axios-cookiejar-support').default;
axiosCookieJarSupport(axios);
const tough = require('tough-cookie');


const num = 0




const arrayPrevio = []
const arrayActual = []


const Scrapy = async (proxy) => {
    if (proxy) {
        console.log(`\nProxy usado: ${proxy.host}`)
    }
    const instance = axios.create({
        timeout: 15000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
            'Referer': 'https://www.mepicaelchollo.com/',
            'Upgrade-Insecure-Requests': '1',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'TE': 'Trailers'
        },
        jar: new tough.CookieJar(),
        proxy: proxy && proxy,
    });


    //!==============================================================================



    const arrayResultado = instance.get("https://mepicaelchollo.com/")

        .then((res) => {

            const $ = cheerio.load(res.data)
            // console.log(res.data);

            const items = $('article[class="col_item offer_grid offer_grid_com mobile_compact_grid offer_act_enabled"]')
                .toArray()
                .map((element) => {
                    const title = $(element)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(2)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(1)
                        .children().eq(0) //Es igual que Children[0]
                        .text()
                    // .html()
                    // console.log("\ntitle")
                    // console.log(title)

                    const url = $(element)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(2)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(1)
                        .children().eq(0) //Es igual que Children[0]
                        .attr('href')
                    // console.log("\nurl")
                    // console.log(url)

                    const currentPrices = $(element)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(2)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        // .attr('title')
                        .html() ?? ''
                    // console.log("\ncurrentPrices")
                    // console.log(currentPrices)

                    const previousPrices = $(element)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(2)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(1) //Es igual que Children[0]
                        // .attr('title')
                        .html() ?? ''
                    // console.log("\npreviousPrices")
                    // console.log(previousPrices)

                    //Opcion1
                    // document.getElementsByClassName("col_item offer_grid offer_grid_com mobile_compact_grid offer_act_enabled")[1].children[0].children[1].children[0].children[0].getAttribute("data-src")

                    //Opcion2
                    //document.getElementsByClassName("col_item offer_grid offer_grid_com mobile_compact_grid offer_act_enabled")[0].children[0].children[1].children[1].children[0].getAttribute("data-src")

                    const imgLink0 = $(element)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(1)
                        .children().eq(0) //Este cambia entre 0 y 1
                        .children().eq(0) //Es igual que Children[0]
                        .attr('data-src')

                    const imgLink1 = $(element)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(1)
                        .children().eq(1) //Este cambia entre 0 y 1
                        .children().eq(0) //Es igual que Children[0]
                        .attr('data-src')

                    //A veces se almacena en una posición, otras veces en la otra, por lo tanto, constante condicional
                    const imgLink = (() => {
                        if (imgLink0)
                            return imgLink0
                        else
                            return imgLink1
                    })();
                    // console.log("\nimgLink")
                    // console.log(imgLink)

                    const category = $(element)
                        .children().eq(2)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        // .html()
                        .text()
                    // console.log("\ncategory")
                    // console.log(category)

                    const store = $(element)
                        .children().eq(2)
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(1) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        .children().eq(0) //Es igual que Children[0]
                        // .html()
                        .text()
                    // console.log("\nstore")
                    // console.log(store)

                    const storeFix = (() => {
                        if (store.trim())
                            return store
                        else
                            return "Tienda no especificada"
                    })();


                    // Fixeamos los precios (actual y previo), para que si salen vacíos no aparezcan los caracteres de formato(~~ y ``)

                    const currentPricesFix = (() => {
                        if (currentPrices)
                            return '`` ' + currentPrices + ' ``'
                        else
                            return currentPrices
                    })();

                    const previousPricesFix = (() => {
                        if (previousPrices)
                            return '~~' + previousPrices + '~~'
                        else
                            return previousPrices
                    })();


                    // title, url, currentPricesFix, previousPricesFix, imgLink, description
                    //Devolvemos objeto "items"
                    return {
                        title: title,
                        url: url,
                        currentPrices: currentPricesFix,
                        previousPrices: previousPricesFix,
                        imgLink: imgLink,
                        category: category,
                        store: storeFix

                    };
                })
            // console.log(items)

            //! FIN DEL SCRAPER, INICIO PROCESAMIENTO DE INFO

            //Ya tenemos los resultados del scraper almacenados en "items"
            //Los procesamos
            arrayActual.push(items)

            console.log(`Testeando la posición [${num}] de los items...`)
            console.log(`${chalk.hex('#9f33ff').bold('TITLE:')} ${items[num].title}`);

            console.log(`${chalk.hex('#9f33ff').bold('PRODUCT URL:')} ${items[num].url}`);

            console.log(`${chalk.hex('#9f33ff').bold('CURRENT PRICE:')} ${items[num].currentPrices}`);

            console.log(`${chalk.hex('#9f33ff').bold('PREVIOUS PRICE:')} ${items[num].previousPrices}`);

            console.log(`${chalk.hex('#9f33ff').bold('IMG LINK:')} ${items[num].imgLink}`);

            console.log(`${chalk.hex('#9f33ff').bold('CATEGORY:')} ${items[num].category}`);

            console.log(`${chalk.hex('#9f33ff').bold('STORE:')} ${items[num].store} \n`);



            //Total de items que obtenemos del scraping
            // console.log(arrayActual[0].length)

            //!------------------


            //FILTROS NEGATIVOS
            //Pasamos el filtro blackList
            const filtradoBlackList = various.filtroBlackList(settings.blackList, arrayActual[0])
            console.log(`${chalk.hex('#e87373')('Elementos eliminados por blackList: ')}${arrayActual[0].length - filtradoBlackList.length}`);


            //Limpiamos el array para que la siguiente lectura lo coja bien, ya que va a la posición [0]
            arrayActual.shift()


            //Filtramos repetidos (con respecto a los items del loop anterior)
            const filtradoRepetidos = various.filtroRepetidos(arrayPrevio, filtradoBlackList)


            console.log(`${chalk.hex('#e87373')('Elementos eliminados por repetición: ')}${filtradoBlackList.length - filtradoRepetidos.length}\n`);

            //Log del número de elementos que pasan los filtros
            console.log(`${chalk.hex('#80cb84')('Elementos finales: ')}${filtradoRepetidos.length}`);

            //Limpiamos arrayPrevio, ya comparado
            //Añadimos los nuevos elementos a arrayPrevio
            if (arrayPrevio.length > 50) {
                console.log(`${chalk.hex('#b80a0a')('Array limpiado.')}`);
                various.cleanArray(arrayPrevio)
            }
            various.transferArray(filtradoRepetidos, arrayPrevio)

            //Metemos en arrayPrevio los nuevos elementos que no estaban
            various.transferArray(various.filtroRepetidos(arrayPrevio, filtradoRepetidos), arrayPrevio)
            // console.log(arrayPrevio)

            //FILTRO POSITIVO
            // Pasamos el filtro whiteList
            const filtradoWhiteList = various.filtroWhiteList(settings.whiteList, filtradoRepetidos)

            console.log(`${chalk.hex('#e99e4e')('Elementos en whiteList: ')}${filtradoWhiteList.length}\n`);


            //!------------------

            // console.log(filtradoRepetidos[0].title)

            // console.log(filtradoRepetidos)
            // console.log(filtradoWhiteList)
            //filtradoRepetidos, filtradoWhiteList
            return [filtradoRepetidos, filtradoWhiteList];




        })
        .catch(error => {
            // console.log(`\nProxy usado: ${proxy.host}`)
            console.log(`${chalk.hex('#c20000')('SCRAPY ERROR:')} ${error.message}`);

        })


    return arrayResultado


} //Fin función Scrapy




// const Scrapy_test = async (proxy) => {

//     // const [filtradoRepetidos, filtradoWhiteList] = await Scrapy(proxy);
//     const filtradoRepetidos = await Scrapy(proxy);

//     // console.log(`Enviando: ${filtradoRepetidos.length}\n`)
//     console.log(`Enviando: ${filtradoRepetidos.length}\n`)
//     // console.log(`Externa a.then(res): ${filtradoWhiteList.length}\n`)

//     // toDiscord(filtradoWhiteList, filtradoRepetidos)
// };

// Scrapy_test()



module.exports = Scrapy
// module.exports = Scrapy_Discord
// module.exports = toDiscord

