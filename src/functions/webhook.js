require('dotenv').config()

/* Creamos el formato del webhook */
const various = require('./various')
const { Webhook, MessageBuilder } = require('discord-webhook-node');

const PRIVATE_DEPLOY = process.env.PRIVATE_DEPLOY;
const DISCORD_WEBHOOK_URL_PRIVATE_FILTERED = process.env.DISCORD_WEBHOOK_URL_PRIVATE_FILTERED;
const DISCORD_WEBHOOK_URL_PRIVATE_UNFILTERED = process.env.DISCORD_WEBHOOK_URL_PRIVATE_UNFILTERED;
const DISCORD_WEBHOOK_URL_PUBLIC_UNFILTERED = process.env.DISCORD_WEBHOOK_URL_PUBLIC_UNFILTERED;
const DISCORD_WEBHOOK_URL_PUBLIC_FILTERED = process.env.DISCORD_WEBHOOK_URL_PUBLIC_FILTERED;


//Privado = true manda los webhooks al canal privado
const linkWebhook_Filtered = (() => {
    if (PRIVATE_DEPLOY === 'true')
        //Privado filtered
        return DISCORD_WEBHOOK_URL_PRIVATE_FILTERED
    else
        //Publico filtered
        return DISCORD_WEBHOOK_URL_PUBLIC_FILTERED
})();

const linkWebhook_Unfiltered = (() => {
    if (PRIVATE_DEPLOY === 'true')
        //Privado unfiltered
        return DISCORD_WEBHOOK_URL_PRIVATE_UNFILTERED
    else
        //Publico unfiltered
        return DISCORD_WEBHOOK_URL_PUBLIC_UNFILTERED
})();


const Webhook_Item = (webhook_Url, title, link, price, priceStrikethrough, store, category, linkImg) => {

    const hook = new Webhook(webhook_Url);


    const embed = new MessageBuilder()
        .setTitle(title)
        // .setAuthor('BrocolAIO', 'link', 'https://www.google.com')
        .setDescription(price + '  ' + priceStrikethrough)
        .addField(category, store, true)
        // .addField("Categoría", category, true)
        // .addField("Tienda", store, true)

        // .addField('Enlace ', link)



        .setURL(link)
        .setColor('#01a707')
        // .setImage(linkImg)
        .setThumbnail(linkImg)
        .setFooter('Mepicaelchollo monitor, by Fentos', 'https://i.ibb.co/zxtL34D/pngwing-com.png')
        .setTimestamp();

    hook.setUsername('Mepicaelchollo');
    hook.setAvatar('https://pbs.twimg.com/profile_images/893104510066753536/zycN_eme_400x400.jpg')
    hook.send(embed);

}



//Función que envía la información al discord
const toDiscord = async (filtradoWhiteList, filtradoRepetidos) => {
    console.log(`Enviando ${filtradoRepetidos.length} items al webhook Unfiltered.`)
    console.log(`Enviando ${filtradoWhiteList.length} items al webhook Filtered.`)

    for (const i in filtradoWhiteList) {
        // Webhook_Item(webhook_url, title, link, price, priceStrikethrough, store, category, linkImg)
        Webhook_Item(
            linkWebhook_Filtered,
            filtradoWhiteList[i].title, filtradoWhiteList[i].url, filtradoWhiteList[i].currentPrices, filtradoWhiteList[i].previousPrices, filtradoWhiteList[i].category, filtradoWhiteList[i].store, filtradoWhiteList[i].imgLink)
        // console.log("print - filtered")
        if ((i - 4) % 5 === 0) {
            // console.log("Dormimos 2 segundos - Filtered")
            await various.sleep(3000)
        }
    }

    for (const i in filtradoRepetidos) {
        Webhook_Item(
            linkWebhook_Unfiltered,
            filtradoRepetidos[i].title, filtradoRepetidos[i].url, filtradoRepetidos[i].currentPrices, filtradoRepetidos[i].previousPrices, filtradoRepetidos[i].category, filtradoRepetidos[i].store, filtradoRepetidos[i].imgLink)
        // console.log("print - unfiltered")

        if ((i - 4) % 5 === 0) {
            // console.log("Dormimos 2 segundos - Unfiltered")
            await various.sleep(3000)
        }
    }

}

// module.exports = Webhook_Item
module.exports = toDiscord

