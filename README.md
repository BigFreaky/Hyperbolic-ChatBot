# Hyperbolic-ChatBot

An automated Node.js chatbot designed to interact with the Hyperbolic API. This script automatically sends a list of predefined questions to the API and logs the responses, making it easy to test endpoints or generate content.

**Author:** Makera1n
**GitHub:** <https://github.com/BigFreaky/Hyperbolic-ChatBot>

## ✨ Features

* **🤖 Automated Q&A:** Automatically sends questions from a text file to the Hyperbolic chat API.

* **🔑 Smart API Key Handling:** Prompts for the API key on the first run and securely saves it for future sessions.

* **📝 External Question File:** Easily manage your list of questions in a separate `questions.txt` file.

* **💅 Beautiful Logging:** Color-coded and emoji-marked console logs for clear and easy-to-read status updates.

* **⚙️ Simple Setup:** Just clone the repository and run `npm install`.

* **🚀 Easy to Run:** Start the entire process with a simple `npm start` command.

## 🛠️ Installation & Setup

Follow these steps to get the chatbot up and running on your local machine.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (which includes npm) installed on your system.

* A valid API Key from [Hyperbolic.xyz](https://hyperbolic.xyz/).

### Step 1: Clone the Repository

Clone this repository to your local machine using your preferred method (HTTPS or SSH).

```bash
git clone [https://github.com/BigFreaky/Hyperbolic-ChatBot.git](https://github.com/BigFreaky/Hyperbolic-ChatBot.git)
```

### Step 2: Navigate to the Project Directory

```bash
cd Hyperbolic-ChatBot
```

### Step 3: Install Dependencies

Install the necessary `npm` packages (currently `axios`) by running:

```bash
npm install
```

### Step 4: Add Your Questions

Create a file named `questions.txt` in the root of the project directory. Add all the questions you want the bot to ask, with **one question per line**.

**Example `questions.txt`:**
```
What's the best way to learn programming?
How does quantum computing work?
Can you explain blockchain technology?
```

## ▶️ How to Run

Once the setup is complete, you can start the chatbot with a single command.

```bash
npm start
```

### First Time Running

The very first time you run the script, it will not find a saved API key. It will prompt you to enter your key in the console:

```
🔑 API Key not found.
Please enter your Hyperbolic API Key and press Enter: YOUR_API_KEY_HERE
```

Paste your key and press **Enter**. The key will be saved locally in a `config.json` file, and the bot will begin.

### Subsequent Runs

On all future runs, the bot will automatically load the key from `config.json` and start immediately without asking again.

## ⚙️ Configuration

The chatbot's behavior is controlled by two main files that you can modify:

* **`questions.txt`**: This is where you store the list of questions for the bot to ask. You can add, remove, or edit questions in this file at any time. The bot will load them when it starts.

* **`config.json`** (auto-generated): This file is created automatically after the first run to store your API key. If you need to change or reset your API key, you can simply **delete this file**, and the bot will prompt you for a new key on its next run.

## 📜 License

This project is licensed under the ISC License. See the `LICENSE` file for more details.
