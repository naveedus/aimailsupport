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

    public async moderateText(input: string): Promise<any> {
        /*const { signal, clearAbortSignalWithTimeout } = this.createAbortSignalWithTimeout(this.servicesTimeout)

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
        */

        const jsonData = JSON.parse('{"id":"modr-A3qX1v5Zf1lYenAaKzpzdtcfW0Zrn","model":"text-moderation-007","results":[{"flagged":false,"categories":{"sexual":false,"hate":false,"harassment":false,"self-harm":false,"sexual/minors":false,"hate/threatening":false,"violence/graphic":false,"self-harm/intent":false,"self-harm/instructions":false,"harassment/threatening":false,"violence":false},"category_scores":{"sexual":0.00490998849272728,"hate":0.04140038788318634,"harassment":0.002445516875013709,"self-harm":0.002073025330901146,"sexual/minors":0.0017407482955604792,"hate/threatening":0.0006821546703577042,"violence/graphic":0.007680510636419058,"self-harm/intent":0.000034031178074656054,"self-harm/instructions":0.000019110957509838045,"harassment/threatening":0.0001075867039617151,"violence":0.045738596469163895}}]}')
        return jsonData.results
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
}