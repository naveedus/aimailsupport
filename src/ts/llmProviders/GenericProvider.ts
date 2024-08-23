/**
 * Definition of a generic class for the implementation of an LLM service provider,
 * which all actual implementations must extend.
 */
import { ConfigType } from '../ConfigType';

export class GenericProvider {
    protected mainUserLanguageCode: string
    protected servicesTimeout: number

    protected readonly PROMPTS = {
        SOFTER: 'Make the following text softer, use the same language as the text',
        SUGGEST_REPLY: 'Suggest a response to the text as if written by me, use the same language as the text',
        SUMMARIZE: 'Summarize the text, use the same language as the text',
        TRANSLATE: 'Translate the text in %s'
    }

    public constructor(config: ConfigType) {
        this.mainUserLanguageCode = config.mainUserLanguageCode
        this.servicesTimeout = config.servicesTimeout
    }

    /**
     * Converts text to speech.
     *
     * @param input The input text to be converted.
     * @returns A Promise resolving to the converted text as a Blob.
     */
    public async getSpeechFromText(input: string): Promise<Blob> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }

    /**
     * Softens the tone of the input text and provides a modified version.
     *
     * @param input The input text to be softened.
     * @returns A Promise resolving to the softened version of the input text.
     */
    public async softenText(input: string): Promise<string> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }

    /**
     * Provides a suggested reply based on the input text.
     *
     * @param input The input text for which a reply is suggested.
     * @returns A Promise resolving to the suggested reply.
     */
    public async suggestReplyFromText(input: string): Promise<string> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }

    /**
     * Summarizes the input text.
     *
     * @param input The input text to be summarized.
     * @returns A Promise resolving to the summarized text.
     */
    public async summarizeText(input: string): Promise<string> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }

    /**
     * Tests the integration of the provider.
     *
     * @returns A Promise resolving to void.
     */
    public async testIntegration(): Promise<void> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }

    /**
     * Translates the input text.
     *
     * @param input The input text to be translated.
     * @returns A Promise resolving to the translated text.
     */
    public async translateText(input: string): Promise<string> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }

    // Methods to verify if the object implementing a particular LLM service has
    // specific capabilities.
    // This is done by checking that the current class actually has a specific
    // implementation for the reference method. -->
    public getCanSpeechFromText(): boolean {
        return this.getSpeechFromText !== GenericProvider.prototype.getSpeechFromText
    }

    public getCanSoftenText(): boolean {
        return this.softenText !== GenericProvider.prototype.softenText
    }

    public getCanSuggestReply(): boolean {
        return this.suggestReplyFromText !== GenericProvider.prototype.suggestReplyFromText
    }

    public getCanSummarizeText(): boolean {
        return this.summarizeText !== GenericProvider.prototype.summarizeText
    }

    public getCanTranslateText(): boolean {
        return this.translateText !== GenericProvider.prototype.translateText
    }
    // <-- check capabilities

    /**
     * This function initializes an AbortController and sets a timeout to automatically
     * abort the signal after the given duration.
     * It also provides a clear function to cancel the timeout if the request completes
     * successfully before the timeout.
     *
     * The AbortSignal can be used to interrupt remote calls, ensuring that long-running
     * requests do not hang indefinitely. By passing this signal to a fetch request,
     * the request will be aborted if it takes longer than the specified timeout.
     *
     * @param timeout - The duration in seconds after which the request should be
     *                  aborted.
     * @returns An object containing the AbortSignal and a clear function.
     */
    protected createAbortSignalWithTimeout(timeout: number): { signal: AbortSignal,
            clearAbortSignalWithTimeout: () => void } {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout * 1000)

        // Function to clear the timeout if the request completes successfully
        function clearAbortSignalWithTimeout() {
            clearTimeout(timeoutId)
        }

        return { signal: controller.signal, clearAbortSignalWithTimeout }
    }
}