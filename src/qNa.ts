import * as tf from '@tensorflow/tfjs';
import * as qna from '@tensorflow-models/qna';
// import '@tensorflow/tfjs-node';
import  fs from 'fs';
import  pdfParse from 'pdf-parse';
import path from "path"

async function loadModel() {
  try {
    await tf.ready();  
    const model = await qna.load();
    console.log(model);  // Check if the model is loaded
    console.log('BERT model loaded!');
    return model;
  } catch (error) {
    console.error('Error loading BERT model:', error);
    throw error;
  }
}

// Detect questions using regex
function detectQuestions(text: string): string[] {
  const questionPattern = /([A-Z][^\.!?]*\?)/g; // Detects sentences ending with a question mark
  const questions = text.match(questionPattern) || [];
  console.log(`Detected ${questions.length} questions.`);
  return questions;
}

// Function to find answers for all detected questions
function findAnswers(context: string, questions: string[]) {
  loadModel().then(model => {
    questions.forEach(question => {
      model.findAnswers(question, context).then(answers => {
        console.log(`\nQuestion: ${question}`);

        if (answers.length > 0) {
          answers.forEach((answer, idx) => {
            console.log(`${idx + 1}. ${answer.text} (Score: ${answer.score.toFixed(2)})`);
          });
        } else {
          console.log('No answer found.');
        }
      }).catch(error => {
        console.error('Error finding answers:', error);
      });
    });
  }).catch(error => {
    console.error('Error loading model for finding answers:', error);
  });
}

// Process PDF and extract text
function processPDF(filePath: string) {
  const dataBuffer = fs.readFileSync(filePath);
  pdfParse(dataBuffer).then(pdfData => {
    const context = pdfData.text;
    const questions = detectQuestions(context);
    findAnswers(context, questions);
  }).catch(error => {
    console.error('Error processing PDF:', error);
  });
}

// Example usage with raw text input
function processText(context: string) {
  const questions = detectQuestions(context);
  findAnswers(context, questions);
}

const sampleText = `
What is the Naira MasterCard?
The Naira MasterCard is a multi-purpose debit card that allows you to spend directly from your Naira account, anywhere in the world. With the IDJBank Naira MasterCard, you can withdraw cash from ATMs, pay for goods and services using POS terminals at merchant locations and make payments/purchases on merchant websites, 24 hours a day, 7 days a week.

How do I apply for an IDJBank Naira MasterCard?
For new customers, the card is automatically issued when you open a current or savings account. You can visit any IDJBank branch to fill out an account opening form, download the form at www.IDJBank.com or open an account via our social banking platform on facebook.com. Submit the form at any IDJBank branch along with a form of identification such as International passport, Driver’s license, Voters card, and a utility bill issued within the past 3 months. For current accounts, two references (from existing current account holders) will be required in addition to the requirements above. Also, the customer’s account must be funded with a minimum of N1,050 to cover the cost of the Naira MasterCard. Please note that a Temporary card is issued instantly on demand (for new customers) while the actual Naira MasterCard takes 4-6 working days to be produced and delivered to the pick-up branch.
`;

// processText(sampleText);

// Uncomment below line to process a PDF file instead of raw text
// const pdfFilePath = './sample.pdf'; // Replace with your PDF file path
// processPDF(pdfFilePath);


// Uncomment below line to process a PDF file instead of raw text
const pdfFilePath = path.join(__dirname, 'IDJBank.pdf'); 
processPDF(pdfFilePath)
