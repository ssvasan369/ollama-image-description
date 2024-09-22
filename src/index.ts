import { Ollama } from 'ollama';
import fs from 'fs';
import path from 'path';  // Import path module for handling file paths

// Define constants for reusable values
const OLLAMA_HOST = 'http://127.0.0.1:11434';
const MODEL_NAME = 'llava:latest';
const PROMPT_TEXT = `
Describe the contents of the image in detail. Then, analyze the image and determine if it contains any illegal activities such as violence, theft, bribe, vandalism, illegal substances, or other unlawful behavior. 
If any illegal activity is present, respond with 'Yes' and specify the activity. If not, respond with 'No'. 
Format your response as:
1. Image Description: [your description]
2. Illegal Activity: [Yes/No] - [If yes, specify the activity].
`;

const IMAGE_PATH = path.resolve(__dirname, './mh.jpg');

// Function to check if the file exists
function fileExists(filePath: string): boolean {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        console.error("File existence check failed:", error);
        return false;
    }
}

// Main function to describe the image and detect illegal activities
async function detectIllegalActivityInImage() {
    const ollama = new Ollama({ host: OLLAMA_HOST });

    if (!fileExists(IMAGE_PATH)) {
        console.error(`File not found at path: ${IMAGE_PATH}`);
        return;
    }

    try {
        console.log("Reading image data...");
        const imageData = fs.readFileSync(IMAGE_PATH).toString("base64");

        console.log("Sending request to Ollama API...");
        const output = await ollama.generate({
            model: MODEL_NAME,
            prompt: PROMPT_TEXT,
            images: [imageData]
        });

        console.log("Response from API:", output.response);

    } catch (error) {
        console.error("An error occurred while processing the image:", error);
    }
}

// Execute the main function
detectIllegalActivityInImage().catch((error) => {
    console.error("An unexpected error occurred:", error);
});
