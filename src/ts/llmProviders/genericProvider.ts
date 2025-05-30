/**
 * Definition of a generic class for the implementation of an LLM service provider,
 * which all actual implementations must extend.
 */
import { ConfigType } from '../helpers/configType'

export class GenericProvider {
    protected mainUserLanguageCode: string
    protected servicesTimeout: number


    protected readonly PROMPTS = {
    	EXPLAIN: `You are an assistant that explains the content of emails in %language% clearly and simply, while preserving the original meaning. Avoid adding unnecessary complexity and ignore formatting, special characters, or unusual symbols. Focus on making the explanation easy to understand for a non-technical audience, where applicable.`,

    	REPHRASE: `You are an assistant that rephrases the content of emails in %language%, using a %toneOfVoice% tone of voice. Preserve the original meaning, while adjusting phrasing to improve clarity or style. Ignore formatting, headers, signatures, and unusual characters. Ensure the rephrasing maintains a natural flow and is easy to read.`,

    	SUGGEST_IMPROVEMENTS: `You are an assistant that suggests improvements to the content of emails in %language%, focusing on clarity, tone, conciseness, and overall effectiveness. Provide actionable feedback that enhances the email's impact. Ignore formatting, headers, signatures, and unusual characters. Focus on improving communication without altering the original intent.`,

    	SUGGEST_REPLY: `You are an assistant that suggests a reply to the email in %language%, using a %toneOfVoice% tone of voice. Your reply should be clear, relevant, and address the sender's message thoughtfully. Avoid excessive detail but ensure the response is respectful and concise. Ignore formatting, headers, signatures, and unusual characters.`,

    	REVIEW_CODE_DETAILED: `Perform a detailed code review of the provided code. Provide inline suggestions and comments about the logic, structure, edge cases, and any potential improvements or bugs. Ensure your review helps the author understand areas for optimisation and areas that need attention. Be specific about any issues that might affect performance, readability, or maintainability.`,

    	REVIEW_CODE_HIGH_LEVEL: `Provide a high-level code review focusing on the architecture, readability, maintainability, and overall design. Avoid providing inline comments; instead, focus on the general structure of the code and its overall approach. Point out any architectural flaws, improvements in code organisation, or suggestions to make the codebase easier to maintain in the long run.`,

    	REVIEW_CODE_CONCISE: `Give a concise, high-level code review in bullet points. Mention major issues that could affect performance, readability, or maintainability. Highlight any important suggestions for improvements, such as design or structure changes. Keep the feedback short and to the point, covering only critical aspects.`,

    	SUMMARIZE: `You are an assistant that summarizes emails in %language%, providing a short, clear summary that captures the sender's core message or request. Focus only on the most important points and ignore irrelevant details, such as formatting, headers, footers, signatures, quoted replies, or unusual characters. Aim to make the summary as concise as possible without omitting critical context.`,

    	TRANSLATE: `You are an assistant that translates emails into %language%, ensuring the translation is as natural, accurate, and contextually appropriate as possible. Preserve the original meaning, tone, and style of the email while ensuring the translated message sounds fluent and coherent in the target language. Ignore formatting or unusual characters. Provide an accurate translation that retains the essence of the original communication.`
}


    public constructor(config: ConfigType) {
        this.mainUserLanguageCode = config.mainUserLanguageCode
        this.servicesTimeout = config.servicesTimeout
    }

    /**
     * Explains the input string.
     * 
     * @param input - The string to be explained.
     *
     * @returns A promise that resolves to the explained version of the input text.
     */
    public async explainText(input: string): Promise<any> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }

    /**
     * Converts text to speech.
     *
     * @param input - The input text to be converted.
     *
     * @returns A Promise resolving to the converted text as a Blob.
     */
    public async getSpeechFromText(input: string): Promise<Blob> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }

    /**
     * Moderates the input string.
     * 
     * @param input - The string to be moderated.
     *
     * @returns A promise that resolves to the moderated JSON object.
     */
    public async moderateText(input: string): Promise<any> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }

    /**
     * Rephrase the input text according to the specified tone of voice
     * and provide a modified version.
     *
     * @param input - The input text to be rephrased.
     * @param toneOfVoice - The town on voice to be applied for rewriting
     *        (e.g., "formal", "creative", "polite", ...).
     *
     * @returns A Promise resolving to the rephrased version of the input
     *          text based on the specified style.
     */
    public async rephraseText(input: string, toneOfVoice: string): Promise<string> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }

    /**
     * Suggests improvements to the provided text input to enhance its clarity,
     * tone, or overall quality.
     *
     * @param input - The input text to be analyzed and improved.
     *
     * @returns A Promise resolving to the improved version of the input text.
     */
    public async suggestImprovementsForText(input: string): Promise<string> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }

    /**
     * Provides a suggested reply based on the input text according to the
     * specified tone of voice.
     *
     * @param input - The input text for which a reply is suggested.
     * @param toneOfVoice - The town on voice to be applied for rewriting
     *        (e.g., "formal", "creative", "polite", ...).
     *
     * @returns A Promise resolving to the suggested reply.
     */
    public async suggestReplyFromText(input: string, toneOfVoice: string): Promise<string> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }
    /**
    * Review the provided source code and return a generated evaluation.
    *
    * @param input - The code to be reviewed.
    * @returns A Promise resolving to the review output.
    */
    public async reviewCodeDetailed(input: string): Promise<string> { 
	throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }
    public async reviewCodeHighLevel(input: string): Promise<string> { 
	throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }
    public async reviewCodeConcise(input: string): Promise<string> { 
	throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }


    /**
     * Summarizes the input text.
     *
     * @param input - The input text to be summarized.
     *
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
     * @param input - The input text to be translated.
     * @param languageCode - The target language code for the translation.
     *        Can be omitted or null, in such cases, the user's main language
     *        preference will be used as the default.
     *
     * @returns A Promise resolving to the translated text.
     */
    public async translateText(input: string, languageCode: string | null = null): Promise<string> {
        throw new Error(browser.i18n.getMessage('errorInvalidAddonOptions'))
    }

    // Methods to verify if the object implementing a particular LLM service has
    // specific capabilities.
    // This is done by checking that the current class actually has a specific
    // implementation for the reference method. -->
    public getCanExplainText(): boolean {
        return this.explainText !== GenericProvider.prototype.explainText
    }

    public getCanModerateText(): boolean {
        return this.moderateText !== GenericProvider.prototype.moderateText
    }

    public getCanRephraseText(): boolean {
        return this.rephraseText !== GenericProvider.prototype.rephraseText
    }

    public getCanSpeechFromText(): boolean {
        return this.getSpeechFromText !== GenericProvider.prototype.getSpeechFromText
    }

    public getCanSuggestImprovementsForText(): boolean {
        return this.suggestImprovementsForText !== GenericProvider.prototype.suggestImprovementsForText
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
     *        aborted.
     *
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
