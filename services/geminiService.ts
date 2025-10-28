import { GoogleGenAI, Type } from '@google/genai';
import { ScenarioTemplate, Question, AnalysisReport, Session, Task } from '../types';

// ====================================================================================
// !! CRITICAL SECURITY NOTE: API KEY MANAGEMENT !!
// ====================================================================================
// The line below contains a hardcoded API key for temporary development purposes.
// This is INSECURE and MUST BE REMOVED before deploying the application to any
// public or shared environment. Hardcoding keys exposes them to anyone who can
// view the source code, leading to potential misuse, unauthorized access, and
// unexpected charges on your account.
//
// --- MIGRATION TO A SECURE ENVIRONMENT VARIABLE ---
//
// To secure your application for a production-ready MVP, you must replace this
// hardcoded key with an environment variable.
//
// 1.  **Create a `.env.local` file:** In your project's root directory, create a
//     file named `.env.local`. This file should be listed in your `.gitignore` to
//     prevent it from being committed to version control.
//
// 2.  **Add the key to `.env.local`:**
//     REACT_APP_API_KEY=YOUR_REAL_GEMINI_API_KEY_HERE
//
// 3.  **Configure Deployment Environment:** In your hosting provider's settings
//     (e.g., Vercel, Netlify), add an environment variable with the same name
//     (`REACT_APP_API_KEY`) and your key as the value.
//
// 4.  **Update Code:**
//     a) DELETE the hardcoded `API_KEY` line below.
//     b) UNCOMMENT the line that reads from `process.env`.
//        (e.g., const API_KEY = process.env.REACT_APP_API_KEY;)
//
// This ensures your key is kept secret and managed securely.
// ====================================================================================

// --- [INSECURE] TEMPORARY DEVELOPMENT KEY ---
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("CRITICAL: API_KEY is not set. Gemini API calls will fail. Please ensure your environment variables are configured correctly.");
  // In a production app, you would want to throw an error or disable AI features.
  throw new Error("API_KEY is missing. Application cannot initialize AI services.");
}

// Initialize the GoogleGenAI client with the API key.
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Defines the JSON schema for generating scenario questions.
// This ensures the AI's response is in a predictable, parsable format.
const questionSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        type: { type: Type.STRING, enum: ['multiple-choice'] },
        text: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 3, maxItems: 3 }
      },
      required: ['id', 'type', 'text', 'options']
    }
};

// Defines the comprehensive JSON schema for the session analysis report.
// This structured format is crucial for the `SessionReport` component to render correctly.
const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.INTEGER, description: "A score from 0-100." },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        optimizations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable advice for improvement." },
        responseSpeedAnalysis: { type: Type.STRING, description: "Feedback on the user's response speed." },
        cognitiveBiases: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    bias: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                },
                required: ['bias', 'explanation']
            }
        },
        questionBreakdown: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    questionText: { type: Type.STRING },
                    userAnswer: { type: Type.STRING },
                    aiFeedback: { type: Type.STRING }
                },
                required: ['questionText', 'userAnswer', 'aiFeedback']
            }
        },
        performanceData: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.INTEGER } } } },
        decisionMakingData: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.INTEGER } } } },
        suggestedResources: {
            type: Type.OBJECT,
            properties: {
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                references: { 
                    type: Type.ARRAY, 
                    items: { 
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            url: { type: Type.STRING }
                        },
                        required: ['title', 'url']
                    } 
                }
            },
            required: ['keywords', 'references']
        }
    },
    required: ['overallScore', 'strengths', 'weaknesses', 'optimizations', 'responseSpeedAnalysis', 'cognitiveBiases', 'questionBreakdown', 'performanceData', 'decisionMakingData', 'suggestedResources']
};

/**
 * Generates a set of multiple-choice questions for a given scenario using the Gemini API.
 * @param scenario The template for the scenario.
 * @param language The desired language for the questions and options.
 * @returns A promise that resolves to an array of Question objects.
 */
export const generateScenarioQuestions = async (scenario: ScenarioTemplate, language: string): Promise<Question[]> => {
    const prompt = `
        Based on the following scenario, generate 5 distinct and challenging questions to test a user's intuition and decision-making skills. The user's role is a ${scenario.jobType} at the ${scenario.level} level.

        Scenario: "${scenario.name}"
        Description: "${scenario.description}"

        IMPORTANT RULES:
        1. Every question MUST be 'multiple-choice'.
        2. Every question MUST have exactly 3 distinct, plausible options.
        3. Generate all text for the questions and options in ${language}.
        
        Return the result as a JSON array that matches the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: questionSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Question[];

    } catch (error) {
        console.error("Error generating scenario questions:", error);
        throw new Error("Failed to generate questions from Gemini API.");
    }
};

/**
 * Analyzes a user's session performance and generates a detailed report using the Gemini API.
 * @param scenario The scenario the user completed.
 * @param questions The questions that were asked in the session.
 * @param answers The user's answers to the questions.
 * @param language The language for the analysis report.
 * @param totalDurationInSeconds The total time taken to complete the session.
 * @returns A promise that resolves to an AnalysisReport object.
 */
export const analyzeSessionPerformance = async (
    scenario: ScenarioTemplate,
    questions: Question[],
    answers: { questionId: number, answer: string }[],
    language: string,
    totalDurationInSeconds: number
): Promise<AnalysisReport> => {
    
    const formattedAnswersAndQuestions = answers.map((ans, index) => {
        const questionText = questions.find(q => q.id === ans.questionId)?.text || `Question ID ${ans.questionId}`;
        return `Question ${index + 1}: "${questionText}"\nUser Answer: "${ans.answer}"`;
    }).join('\n\n');

    const prompt = `
        You are an expert professional development coach. Analyze the user's performance in a training scenario.

        Scenario: "${scenario.name}" for a ${scenario.jobType}.
        Description: "${scenario.description}"
        
        The user was presented with the following questions and gave these answers (which include their selected option and their own justification):
        ${formattedAnswersAndQuestions}

        Total Time Taken: ${totalDurationInSeconds.toFixed(0)} seconds.

        Provide a comprehensive performance analysis.
        1.  **Overall Score**: Calculate a score from 0-100 based on the quality of their choices and reasoning.
        2.  **Strengths**: Identify 2-3 key strengths demonstrated.
        3.  **Weaknesses**: Identify 1-2 key weaknesses or areas for improvement.
        4.  **Optimizations**: Provide 2-3 actionable optimization tips.
        5.  **Response Speed Analysis**: Evaluate their pace (${totalDurationInSeconds.toFixed(0)} seconds for ${questions.length} questions). Was it too fast (reckless), too slow (hesitant), or appropriately deliberate for this scenario's complexity? Provide concise feedback.
        6.  **Cognitive Biases**: Analyze the user's reasoning for potential cognitive biases (e.g., Anchoring, Confirmation Bias, Groupthink). If any are detected, name the bias and explain why it might apply. If none, return an empty array.
        7.  **Question Breakdown**: For each of the user's answers, provide the original question text (from the provided list), the user's full answer, and a concise AI feedback on their choice and reasoning.
        8.  **Performance Data**: Generate data for a performance bar chart (e.g., Speed, Accuracy, Communication).
        9.  **Decision-Making Data**: Generate data for a decision-making pie chart (e.g., Intuitive vs Data-Driven).
        10. **Suggested Resources**: Based on the user's weaknesses, provide helpful resources. This should include:
            - A 'keywords' array of 3-4 strings for further research.
            - A 'references' array of 1-2 objects, each with a 'title' and a real, valid 'url' to a relevant article or YouTube video. If you cannot find a real URL, it is acceptable to return an empty array for references.

        IMPORTANT: Provide the entire analysis report in ${language}.
        
        Return the result as a single JSON object that matches the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AnalysisReport;

    } catch (error) {
        console.error("Error analyzing session performance:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
};

/**
 * Generates a custom scenario template based on user-provided parameters.
 * @param jobType The user's job or field.
 * @param level The user's experience level.
 * @param topic The specific topic or challenge for the scenario.
 * @returns A promise that resolves to a new ScenarioTemplate object.
 */
export const generateCustomScenario = async (
    jobType: string,
    level: string,
    topic: string
): Promise<ScenarioTemplate> => {
    const customScenarioSchema = {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            jobType: { type: Type.STRING },
            level: { type: Type.STRING, enum: ['Newbie', 'Expert', 'Specialist'] },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['id', 'name', 'jobType', 'level', 'description', 'tags'],
    };

    const prompt = `
        Generate a single, compelling training scenario based on the user's request.
        
        User Request:
        - Job/Field: ${jobType}
        - Experience Level: ${level}
        - Specific Topic/Challenge: ${topic}
        
        Instructions:
        1. Create a concise, engaging 'name' for the scenario.
        2. Write a 'description' that sets up a challenging situation for the user.
        3. Generate an array of 3 relevant 'tags'.
        4. Set the 'jobType' and 'level' to match the user's request.
        5. Generate a unique 'id' string, like 'custom-1678886400000'.
        
        Return the result as a single JSON object that matches the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: customScenarioSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ScenarioTemplate;
    } catch (error) {
        console.error("Error generating custom scenario:", error);
        throw new Error("Failed to generate a custom scenario from the Gemini API.");
    }
};

/**
 * Provides an actionable suggestion based on the content of a user's note.
 * @param noteContent The text of the user's note.
 * @param language The desired language for the suggestion.
 * @returns A promise that resolves to a string containing the AI's suggestion.
 */
export const getNoteSuggestion = async (noteContent: string, language: string): Promise<string> => {
    const prompt = `
        You are an intelligent assistant for a professional user taking notes.
        Based on the user's note below, provide one concise, helpful, and actionable suggestion. This could be a related idea, a question to provoke deeper thought, a potential next step, or a resource to look into.

        User's Note:
        "${noteContent}"

        Your suggestion should be direct and to the point. Do not add any conversational fluff like "Here's a suggestion:".
        
        IMPORTANT: Generate the suggestion in ${language}.

        Return only the suggestion as a plain string.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error generating note suggestion:", error);
        throw new Error("Failed to get suggestion from Gemini API.");
    }
};

/**
 * Suggests a new training scenario based on a user's historical weaknesses.
 * @param history An array of the user's past sessions.
 * @returns A promise that resolves to a partial ScenarioTemplate for the suggested challenge.
 */
export const getAIChallengeSuggestion = async (history: Session[]): Promise<Omit<ScenarioTemplate, 'id'>> => {
    const weaknesses = history.flatMap(s => s.analysis.weaknesses).join(', ');
    const jobType = history.length > 0 ? history[0].job_type : 'general professional';

    const suggestionSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            jobType: { type: Type.STRING },
            level: { type: Type.STRING, enum: ['Newbie', 'Expert', 'Specialist'] },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['name', 'description', 'jobType', 'level', 'tags']
    };
    
    const prompt = `
        A user has demonstrated the following weaknesses in past training scenarios: "${weaknesses || 'None specified, assume they need a general challenge.'}".
        Their general field is "${jobType}".
        
        Generate a new, single, compelling training scenario suggestion tailored to address these weaknesses.
        
        Instructions:
        1. Create a concise, engaging 'name' for the scenario.
        2. Write a brief 'description' of the challenge.
        3. Generate an array of 3 relevant 'tags'.
        4. Determine an appropriate 'level' (Newbie, Expert, Specialist) based on the weaknesses.
        5. Set 'jobType' to the user's general field.

        Return the result as a single JSON object that matches the provided schema.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating AI challenge suggestion:", error);
        throw new Error("Failed to get suggestion from Gemini API.");
    }
};

/**
 * Breaks down a high-level task into smaller, actionable sub-tasks.
 * @param taskTitle The title of the high-level task.
 * @returns A promise that resolves to an array of partial Task objects (title and xp).
 */
export const breakdownTask = async (taskTitle: string): Promise<Pick<Task, 'title' | 'xp'>[]> => {
    const subtaskSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "A concise, actionable title for the sub-task." },
                xp: { type: Type.INTEGER, description: "Estimated XP value between 5 and 50 based on complexity." }
            },
            required: ['title', 'xp']
        },
        minItems: 3,
        maxItems: 7,
    };

    const prompt = `
        You are a project management assistant. Break down the following high-level task into a list of smaller, actionable sub-tasks for a software development project. 
        
        High-Level Task: "${taskTitle}"

        For each sub-task, provide a clear 'title' and estimate the 'xp' (experience points) it should be worth, from 5 (very simple) to 50 (complex).
        
        Generate between 3 and 7 sub-tasks. Return a JSON array of objects that matches the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: subtaskSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error breaking down task:", error);
        throw new Error("Failed to break down task with Gemini API.");
    }
};