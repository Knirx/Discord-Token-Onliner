const fs = require("fs")
const readline = require("readline")
const { Client } = require("discord.js-selfbot-v13")

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function read_txt_file(filePath) {
    const lines_array = []
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    for await (const line of rl) {
        lines_array.push(line)
    }
    return lines_array
}

function get_random_item_array(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

async function changeStatus(status_text, status, headers) {
    try {
        await axios.patch(
            "https://discord.com/api/v8/users/@me/settings", { status: status, custom_status: { text: status_text } }, { headers: headers }
          );
          
        await sleep(1000);
    } catch (error) {
        console.log(error)
        }
}


async function start_the_tokens() {
    const bot_tokens_array = await read_txt_file("tokens.txt"); // tokens filepath

    for (const token of bot_tokens_array) {
        const bot_status = ["idle", "online", "dnd", "invisible"];
        const bot = new Client();
        bot.login(token);
        bot.on('ready', async () => {
            console.log(`Bot is online as ${bot.user.tag}`)
            const headers = {headers: {'Content-Type': 'application/json', Authorization: token}}
            await changeStatus(get_random_item_array(await read_txt_file("statuses.txt")), get_random_item_array(bot_status), headers.headers) // statuses file path
        })
    }

}
while (true) {
    start_the_tokens()
    sleep(86390000)
}

