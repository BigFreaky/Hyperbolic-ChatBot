const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline'); // Import readline for user input

// --- Log Styling (Colors and Emojis) ---
const style = {
    red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", blue: "\x1b[34m",
    magenta: "\x1b[35m", cyan: "\x1b[36m", white: "\x1b[37m", dim: "\x1b[2m", reset: "\x1b[0m",
    info: "🔹", question: "❓", answer: "🤖", wait: "⏳", error: "❌", success: "✅", key: "🔑",
};

// --- Configuration ---
const URL = "https://api.hyperbolic.xyz/v1/chat/completions";
const CONFIG_PATH = path.join(__dirname, 'config.json');

// --- Banner Function ---
function printBanner() {
    const bannerText = "HYPERBOLIC CHATBOT - EARN WITH SINBAND";
    const terminalWidth = 80;
    const paddingSize = Math.floor((terminalWidth - bannerText.length - 2) / 2);
    const padding = ' '.repeat(paddingSize);
    const topBottomBorder = `+${'-'.repeat(terminalWidth - 2)}+`;
    const emptyLine = `|${' '.repeat(terminalWidth - 2)}|`;
    const textLine = `|${padding}${bannerText}${padding}${' '.repeat(terminalWidth - 2 - (padding.length * 2) - bannerText.length)}|`;
    console.log(style.magenta + topBottomBorder + style.reset);
    console.log(style.magenta + emptyLine + style.reset);
    console.log(style.magenta + textLine + style.reset);
    console.log(style.magenta + emptyLine + style.reset);
    console.log(style.magenta + topBottomBorder + style.reset);
    console.log();
}

// --- API Key Management ---
async function getApiKey() {
    // 1. Try to load key from config file
    if (fs.existsSync(CONFIG_PATH)) {
        const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
        const config = JSON.parse(configData);
        if (config.apiKey) {
            console.log(`${style.cyan}${style.key} API Key loaded from config.json.${style.reset}`);
            return config.apiKey;
        }
    }

    // 2. If not found, prompt the user
    console.log(`${style.yellow}${style.key} API Key not found.${style.reset}`);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    
    const promise = new Promise((resolve) => {
        rl.question(`${style.yellow}Please enter your Hyperbolic API Key and press Enter: ${style.reset}`, (key) => {
            resolve(key);
            rl.close();
        });
    });

    const apiKey = await promise;

    if (!apiKey || apiKey.trim() === "") {
        console.error(`${style.red}${style.error} No API Key provided. Exiting.${style.reset}`);
        return null;
    }

    // 3. Save the new key for future use
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ apiKey: apiKey.trim() }, null, 2));
    console.log(`${style.green}${style.success} API Key saved to config.json for future use.${style.reset}`);
    return apiKey.trim();
}


// --- Function to Load Questions from File ---
function loadQuestionsFromFile() {
    try {
        const filePath = path.join(__dirname, 'questions.txt');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const questions = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');

        if (questions.length === 0) {
            console.error(`${style.red}${style.error} Error: 'questions.txt' is empty.${style.reset}`);
            return null;
        }
        console.log(`${style.cyan}${style.info} Successfully loaded ${questions.length} questions.${style.reset}`);
        return questions;
    } catch (error) {
        console.error(`${style.red}${style.error} Error reading 'questions.txt'. Make sure the file exists.${style.reset}`);
        return null;
    }
}

// --- Function to Send API Request ---
async function sendChatRequest(question, headers) {
    const data = {
        "messages": [{ "role": "user", "content": question }],
        "model": "meta-llama/Meta-Llama-3.1-8B-Instruct", "max_tokens": 2048, "temperature": 0.7, "top_p": 0.9
    };
    try {
        const response = await axios.post(URL, data, { headers });
        return { success: true, content: response.data.choices[0].message.content };
    } catch (error) {
        const errorMessage = error.response ? `${error.response.status} ${error.response.statusText}` : error.message;
        return { success: false, content: errorMessage };
    }
}

// --- Helper function for delays ---
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Main Bot Loop ---
async function runChatBot() {
    printBanner();

    const apiKey = await getApiKey();
    if (!apiKey) {
        return; // Exit if no API key
    }

    // Define headers now that we have the key
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };

    const questions = loadQuestionsFromFile();
    if (!questions) {
        console.log(`${style.yellow}Bot cannot start without questions. Exiting.${style.reset}`);
        return;
    }

    console.log(`${style.cyan}${style.info} Starting automated chat bot...${style.reset}`);
    const availableQuestions = [...questions];
    const totalQuestions = questions.length;

    for (let i = 0; i < totalQuestions; i++) {
        const questionIndex = Math.floor(Math.random() * availableQuestions.length);
        const question = availableQuestions.splice(questionIndex, 1)[0];
        const questionLog = `${style.yellow}${style.question} [${i + 1}/${totalQuestions}] Asking: ${question}${style.reset}`;
        
        console.log(`\n${"-".repeat(80)}`);
        console.log(questionLog);

        const result = await sendChatRequest(question, headers);

        if (result.success) {
            console.log(`${style.green}${style.answer} Answer: ${style.reset}${result.content}`);
        } else {
            console.error(`${style.red}${style.error} API Error: ${result.content}${style.reset}`);
        }

        if (i < totalQuestions - 1) {
            const delay = Math.random() * (120000 - 60000) + 60000;
            console.log(`${style.dim}${style.wait} Waiting ${(delay / 1000).toFixed(1)} seconds...${style.reset}`);
            await sleep(delay);
        }
    }

    console.log(`\n${style.green}---------------------------------${style.reset}`);
    console.log(`${style.green}${style.success} Completed all ${totalQuestions} questions!${style.reset}`);
    console.log(`${style.green}---------------------------------${style.reset}`);
}

// --- Run the Bot ---
runChatBot();
