import { ConfigType } from './helpers/configType'
import { getConfigs, localizeNodes } from './helpers/utils'
import { ProviderFactory } from './llmProviders/providerFactory'

// Internationalization message management
localizeNodes()

// Handle AI LLM provider selection event, properly managing what to display
// in the DOM.
document.querySelector('#llmProvider').addEventListener('change', (event) => {
    const selectedLlmProvider = (event.target as HTMLInputElement).value

    updateDOMBasedOnSelectLlmProvider(selectedLlmProvider)
})

// Capture all changes in the form fields, disabling the test button.
// This ensures consistency between the edited inputs and the test that
// can be performed by the user, which will always require a prior save.
document.querySelectorAll('#optionsForm input').forEach((node) => {
    node.addEventListener('input', () => {
        (document.querySelector('#optionsForm button.test') as HTMLButtonElement).disabled = true
    })
})

document.querySelectorAll('#optionsForm select').forEach((node) => {
    node.addEventListener('change', () => {
        (document.querySelector('#optionsForm button.test') as HTMLButtonElement).disabled = true
    })
})
// <-- capture all changes in the form fields, disabling the test button

// Test management
document.querySelector('#optionsForm button.test').addEventListener('click', async (event) => {
    event.preventDefault()

    const configs = await getConfigs()
    const llmProvider = ProviderFactory.getInstance(configs)

    llmProvider.testIntegration().then(() => {
        document.querySelector('#optionsForm #testResult').classList.add('ok')
        document.querySelector('#optionsForm #testResult').innerHTML = messenger.i18n.getMessage('options.testSuccessful')
    }).catch(error => {
        document.querySelector('#optionsForm #testResult').classList.add('ko')
        document.querySelector('#optionsForm #testResult').innerHTML = error.message
    })

    // Turning off the test result message -->
    setTimeout(() => {
        document.querySelector('#optionsForm #testResult').classList.remove('ok', 'ko')
    }, 3000)
    // <-- turning off the test result message
})

// Save management
document.querySelector('#optionsForm').addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!(event.currentTarget as HTMLFormElement).checkValidity()) {
        (event.currentTarget as HTMLFormElement).classList.add('submit-attempt')

        return
    }

    // Store options -->
    const configs: ConfigType = {
        mainUserLanguageCode: (document.querySelector('#mainUserLanguageCode') as HTMLInputElement).value,
        llmProvider: (document.querySelector('#llmProvider') as HTMLInputElement).value,
        servicesTimeout: parseInt((document.querySelector('#servicesTimeout') as HTMLInputElement).value),
        debugMode: (document.querySelector('#debugMode') as HTMLInputElement).checked,
        anthropic: {
            apiKey: (document.querySelector('#anthropicApiKey') as HTMLInputElement).value,
            model: (document.querySelector('#anthropicModel') as HTMLInputElement).value
        },
        google: {
            apiKey: (document.querySelector('#googleApiKey') as HTMLInputElement).value,
            model: (document.querySelector('#googleModel') as HTMLInputElement).value
        },
        openai: {
            apiKey: (document.querySelector('#openaiApiKey') as HTMLInputElement).value,
            organizationId: (document.querySelector('#openaiOrganizationId') as HTMLInputElement).value,
            model: (document.querySelector('#openaiModel') as HTMLInputElement).value,
            text2speech: {
                audioQuality: (document.querySelector('#openaiText2SpeechAudioQuality') as HTMLInputElement).value,
                voice: (document.querySelector('#openaiText2SpeechVoice') as HTMLInputElement).value,
                speed: parseFloat((document.querySelector('#openaiText2SpeechSpeed') as HTMLInputElement).value)
            }
        }
    }
    // <-- store options

    // Persists the configurations
    browser.storage.sync.set(configs)
    //logMessage('Storing configurations:\n' + JSON.stringify(await getConfigs(), null, 4))

    // Displaying and turning off the save OK message -->
    document.querySelector('#saveOK').classList.add('show')

    setTimeout(() => {
        document.querySelector('#saveOK').classList.remove('show')
    }, 3000)
    // <-- displaying and turning off the save OK message

    // The test button becomes available only after a correct configuration has
    // been saved.
    document.querySelector('#optionsForm button.test').removeAttribute('disabled')

    // Sends a message named 'optionsChanged' to signal that configurations
    // have been changed, allowing various parts of the application to listen
    // for this message and handle any necessary adjustments.
    browser.runtime.sendMessage({ type: 'optionsChanged' })
})

// Restore options
document.addEventListener('DOMContentLoaded', async () => {
    const configs = await getConfigs()

    const selectedLlmProvider = configs.llmProvider

    // The language code is retrieved without the regional details (e.g.,
    // 'en-US' becomes just 'en').
    const languageWithRegion = browser.i18n.getUILanguage()
    const languageCode = languageWithRegion.split('-')[0];

    (document.querySelector('#mainUserLanguageCode') as HTMLInputElement).value = configs.mainUserLanguageCode || languageCode;
    (document.querySelector('#llmProvider') as HTMLInputElement).value = selectedLlmProvider;
    (document.querySelector('#servicesTimeout') as HTMLInputElement).value = (configs.servicesTimeout || 12).toString();
    (document.querySelector('#debugMode') as HTMLInputElement).checked = configs.debugMode;

    // Anthropic Claude section -->
    (document.querySelector('#anthropicApiKey') as HTMLInputElement).value = configs.anthropic?.apiKey || '';
    (document.querySelector('#anthropicModel') as HTMLInputElement).value = configs.anthropic?.model || 'claude-3-haiku-20240307';
    // <-- Anthropic Claude section

    // Google Gemini section -->
    (document.querySelector('#googleApiKey') as HTMLInputElement).value = configs.google?.apiKey || '';
    (document.querySelector('#googleModel') as HTMLInputElement).value = configs.google?.model || 'gemini-1.5-flash';
    // <-- Google Gemini section

    // OpenAI GPT section -->
    (document.querySelector('#openaiApiKey') as HTMLInputElement).value = configs.openai?.apiKey || '';
    (document.querySelector('#openaiOrganizationId') as HTMLInputElement).value = configs.openai?.organizationId || '';
    (document.querySelector('#openaiModel') as HTMLInputElement).value = configs.openai?.model || 'gpt-4o-mini';
    (document.querySelector('#openaiText2SpeechAudioQuality') as HTMLInputElement).value = configs.openai?.text2speech?.audioQuality || 'tts-1';
    (document.querySelector('#openaiText2SpeechVoice') as HTMLInputElement).value = configs.openai?.text2speech?.voice || 'onyx';
    (document.querySelector('#openaiText2SpeechVoicePreview audio') as HTMLAudioElement).setAttribute('src', `https://cdn.openai.com/API/docs/audio/${(document.querySelector('#openaiText2SpeechVoice') as HTMLInputElement).value}.wav`);
    (document.querySelector('#openaiText2SpeechSpeed') as HTMLInputElement).value = (configs.openai?.text2speech?.speed || 1).toString();
    (document.querySelector('label[for=openaiText2SpeechSpeed] span') as HTMLInputElement).innerText = parseFloat((document.querySelector('#openaiText2SpeechSpeed') as HTMLInputElement).value).toFixed(2)
    // <-- OpenAI GPT section

    updateDOMBasedOnSelectLlmProvider(selectedLlmProvider)

    // Check whether at least one of the email accounts in use is based on the "Owl
    // for Exchange" add-on, which has a bug with the messageDisplayScripts API
    // (https://webextension-api.thunderbird.net/en/115/messageDisplayScripts.html)
    // that affects the functionality of this add-on.
    const accountList = await messenger.accounts.list(false)
    if(accountList.some(account => account.type === 'owl')) {
        document.querySelector('#owlForExchangeBug').classList.add('show')
    }

    // If an LLM provider has been previously saved, the configuration is valid and
    // can potentially be tested, which is why its corresponding button becomes
    // selectable.
    if (selectedLlmProvider) {
        document.querySelector('#optionsForm button.test').removeAttribute('disabled')
    }
})

/**
 * Update the DOM based on the selected LLM provider.
 *
 * @param {string} selectedValue - The selected value
 *
 * @returns {void}
 */
function updateDOMBasedOnSelectLlmProvider(selectedValue: string): void {
    if (!selectedValue) {
        return
    }

    // The possible required attribute of the fields visible to the user is
    // removed.
    document.querySelectorAll('fieldset [required]').forEach((node) => {
        node.removeAttribute('required')
    })

    // Add the required attribute to the fields marked with data-required,
    // ensuring that the user appropriately fills out everything, in
    // accordance with the selected AI LLM service provider.
    document.querySelectorAll(`fieldset#${selectedValue} [data-required]`).forEach((node) => {
        node.setAttribute('required', 'required')
    })

    // The addition of the technical class "data-provider" enhanced by the
    // select, ensures the visibility of the correct section (from CSS rules)
    // for configuring the specific AI LLM service provider.
    document.querySelector('body').setAttribute('data-provider', selectedValue)
}