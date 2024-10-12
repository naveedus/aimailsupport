import { GenericProvider } from '../genericProvider'
import { ConfigType } from '../../helpers/configType'
import { getLanguageNameFromCode, logMessage } from '../../helpers/utils'

/**
 * Class with the implementation of methods useful for interfacing with the
 * Google AI Gemini APIs.
 * Official documentation: https://ai.google.dev/gemini-api/docs
 */
export class GoogleGeminiProvider extends GenericProvider {
    private readonly apiKey: string
    private readonly model: string

    public constructor(config: ConfigType) {
        super(config)

        this.apiKey = config.google.apiKey
        this.model = config.google.model
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

        return headers
    }

    /**
     * This asynchronous method manages message content by sending a request
     * to the Gogole AI API using the provided system and user input.
     * It constructs a POST request with the relevant model and message data,
     * manages the request with a timeout signal, and processes the response.
     *
     * If the request is successful, it returns the content of the response
     * message.
     * In case of failure, it throws an error with the specific message from
     * the Gogole AI API.
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
            'contents': [
                { 'parts': [ { 'text': `${systemInput} ${userInput}` } ] }
            ]
        })

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: this.getHeader(),
            body: requestData,
            redirect: 'follow',
            signal: signal
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, requestOptions)
        clearAbortSignalWithTimeout()

        if (!response.ok) {
            const errorResponse = await response.json()
            throw new Error(`Google AI error: ${errorResponse.error.message}`)
        }

        const responseData = await response.json()
        return responseData.candidates[0].content.parts[0].text
    }
}