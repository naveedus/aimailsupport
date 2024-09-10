import { GenericProvider } from '../genericProvider'
import { ConfigType } from '../../helpers/configType'
import { getLanguageNameFromCode, logMessage } from '../../helpers/utils'

/**
 * Class with the implementation of methods useful for interfacing with the
 * OpenAI APIs.
 * Official documentation: https://platform.openai.com/docs/api-reference
 */
export class OpenAiGptProvider extends GenericProvider {
    private apiKey: string
    private organizationId: string
    private model: string
    private text2speechAudioQuality: string
    private text2speechVoice: string
    private text2speechSpeed: number

    public constructor(config: ConfigType) {
        super(config)

        this.apiKey = config.openai.apiKey
        this.organizationId = config.openai.organizationId
        this.model = config.openai.model
        this.text2speechAudioQuality = config.openai.text2speech.audioQuality
        this.text2speechVoice = config.openai.text2speech.voice
        this.text2speechSpeed = config.openai.text2speech.speed
    }

    public async getSpeechFromText(input: string): Promise<Blob> {
        logMessage(`Request for text2speech of the text: ${input}`, 'debug')

        // The maximum input length is 4096 characters, see official documentation:
        // https://platform.openai.com/docs/api-reference/audio/createSpeech
        if (input.length > 4096) {
            throw new Error('The text is too long, it exceeds the maximum of 4096 characters')
        }

        const { signal, clearAbortSignalWithTimeout } = this.createAbortSignalWithTimeout(this.servicesTimeout)

        const requestData: string = JSON.stringify({
            'model': this.text2speechAudioQuality,
            'input': input,
            'voice': this.text2speechVoice,
            'speed': this.text2speechSpeed
        })

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: this.getHeader(),
            body: requestData,
            redirect: 'follow',
            signal: signal
        }

        const response = await fetch('https://api.openai.com/v1/audio/speech', requestOptions)
        clearAbortSignalWithTimeout()

        if (!response.ok) {
            const errorResponse = await response.json()
            throw new Error(`OpenAI error: ${errorResponse.error.message}`)
        }

        return await response.blob()
    }

    public async moderateText(input: string): Promise<{ [key: string]: number }> {
        const { signal, clearAbortSignalWithTimeout } = this.createAbortSignalWithTimeout(this.servicesTimeout)

        const requestData = JSON.stringify({
            'model': 'text-moderation-stable',
            'input': input
        })

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: this.getHeader(),
            body: requestData,
            redirect: 'follow',
            signal: signal
        }

        const response = await fetch('https://api.openai.com/v1/moderations', requestOptions)
        clearAbortSignalWithTimeout()

        if (!response.ok) {
            const errorResponse = await response.json()
            throw new Error(`OpenAI error: ${errorResponse.error.message}`)
        }

        const jsonData = await response.json()
        return this.normalizeModerationResponse(jsonData)
    }

    public async softenText(input: string): Promise<string> {
        logMessage(`Request to softer the text: ${input}`, 'debug')

        return this.manageMessageContent(this.PROMPTS.SOFTER, input)
    }

    public async suggestReplyFromText(input: string): Promise<string> {
        logMessage(`Request suggestion reply from text: ${input}`, 'debug')

        return this.manageMessageContent(this.PROMPTS.SUGGEST_REPLY, input)
    }

    public async summarizeText(input: string): Promise<string> {
        logMessage(`Request to summarize the text: ${input}`, 'debug')

        return this.manageMessageContent(this.PROMPTS.SUMMARIZE, input)
    }

    public async testIntegration(): Promise<void> {
        await this.translateText('Hi!')
    }

    public async translateText(input: string): Promise<string> {
        logMessage(`Request to translate in ${getLanguageNameFromCode(this.mainUserLanguageCode)} the text: ${input}`, 'debug')

        return this.manageMessageContent(this.PROMPTS.TRANSLATE.replace('%s', getLanguageNameFromCode(this.mainUserLanguageCode)), input)
    }

    /**
     * Function to generate headers for API requests.
     *
     * @returns {Headers} The headers object with necessary headers appended.
     */
    private getHeader(): Headers {
        const headers: Headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Bearer ${this.apiKey}`)

        if(this.organizationId) {
            headers.append('OpenAI-Organization', this.organizationId)
        }

        return headers
    }

    /**
     * This asynchronous method manages message content by sending a request
     * to the OpenAI API using the provided system and user input.
     * It constructs a POST request with the relevant model and message data,
     * manages the request with a timeout signal, and processes the response.
     *
     * If the request is successful, it returns the content of the response
     * message.
     * In case of failure, it throws an error with the specific message from
     * the OpenAI API.
     *
     * @param systemInput - The input for the 'system' role in the conversation.
     * @param userInput - The input for the 'user' role in the conversation.
     *
     * @returns A promise that resolves to the content of the response message
     *          from the API.
     *
     * @throws An error if the API response is not successful.
     */
    private async manageMessageContent(systemInput: string, userInput: string): Promise<string> {
        const { signal, clearAbortSignalWithTimeout } = this.createAbortSignalWithTimeout(this.servicesTimeout)

        const requestData = JSON.stringify({
            'model': this.model,
            'messages': [
                { 'role': 'system', 'content': systemInput },
                { 'role': 'user', 'content': userInput }
            ]
        })

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: this.getHeader(),
            body: requestData,
            redirect: 'follow',
            signal: signal
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions)
        clearAbortSignalWithTimeout()

        if (!response.ok) {
            const errorResponse = await response.json()
            throw new Error(`OpenAI error: ${errorResponse.error.message}`)
        }

        const responseData = await response.json()
        return responseData.choices[0].message.content
    }

    /**
     * This method normalizes the moderation response by rounding the category
     * scores to the nearest integer.
     *
     * It takes the first result from the provided JSON data and processes its
     * category scores, the result is an object where the keys are the category
     * names and the values are the rounded scores.
     */
    private normalizeModerationResponse(data: any): { [key: string]: number } {
        const categoryScores = data.results[0].category_scores
        const normalizedScores: { [key: string]: number } = {}

        // Iterate over the category scores and round the values
        for (const category in categoryScores) {
            if (categoryScores.hasOwnProperty(category)) {
                // Capitalize the first letter of the category key
                const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1)

                // Round the value and store it in the normalizedScores object
                normalizedScores[capitalizedCategory] = Math.round(categoryScores[category] * 100)
            }
        }

        return normalizedScores
    }
}