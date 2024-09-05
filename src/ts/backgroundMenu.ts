import { ProviderFactory } from './llmProviders/providerFactory'
import { getConfigs, getCurrentMessageContent, logMessage, sendMessageToActiveTab } from './helpers/utils'


// Create the menu entries -->
const menuIdSummarize = messenger.menus.create({
    id: 'aiSummarize',
    title: browser.i18n.getMessage('mailSummarize'),
    contexts: [
        'compose_action_menu',
        'message_display_action_menu',
        'selection'
    ]
})

const menuIdSoftenText = messenger.menus.create({
    id: 'aiSoftenText',
    title: browser.i18n.getMessage('mailSoftenText'),
    contexts: [
        'selection'
    ]
})

const menuIdSuggestReply = messenger.menus.create({
    id: 'aiSuggestReply',
    title: browser.i18n.getMessage('mailSuggestReply'),
    contexts: [
        'compose_action_menu'
    ]
})

const subMenuIdSummarize = messenger.menus.create({
    id: 'aiSubMenuSummarize',
    title: browser.i18n.getMessage('mailSummarizeAnd'),
    contexts: [
        'message_display_action_menu',
        'selection'
    ]
})

const menuIdSummarizeAndText2Speech = messenger.menus.create({
    id: 'aiSummarizeAndText2Speech',
    title: browser.i18n.getMessage('mailListen'),
    parentId: subMenuIdSummarize,
    contexts: [
        'message_display_action_menu',
        'selection'
    ]
})

const menuIdText2Speech = messenger.menus.create({
    id: 'aiText2Speech',
    title: browser.i18n.getMessage('mailListen'),
    contexts: [
        'selection'
    ]
})

const menuIdTranslate = messenger.menus.create({
    id: 'aiTranslate',
    title: browser.i18n.getMessage('mailTranslate'),
    contexts: [
        'message_display_action_menu',
        'selection'
    ]
})

const subMenuIdTranslateAnd = messenger.menus.create({
    id: 'aiSubMenuTranslateSummarize',
    title: browser.i18n.getMessage('mailTranslateAnd'),
    contexts: [
        'message_display_action_menu',
        'selection'
    ]
})

const menuIdTranslateAndSummarize = messenger.menus.create({
    id: 'aiTranslateAndSummarize',
    title: browser.i18n.getMessage('mailSummarize'),
    parentId: subMenuIdTranslateAnd,
    contexts: [
        'message_display_action_menu',
        'selection'
    ]
})

const menuIdTranslateAndText2Speech = messenger.menus.create({
    id: 'aiTranslateAndText2Speech',
    title: browser.i18n.getMessage('mailListen'),
    parentId: subMenuIdTranslateAnd,
    contexts: [
        'message_display_action_menu',
        'selection'
    ]
})

const menuIdModerate = messenger.menus.create({
    id: 'aiModerate',
    title: browser.i18n.getMessage('mailModerate'),
    contexts: [
        'message_display_action_menu'
    ]
})

// Separator for the message display action menu
browser.menus.create({
    id: 'aiMessageDisplayActionMenuSeparator1',
    type: 'separator',
    contexts: [
        'message_display_action_menu'
    ]
})

messenger.menus.create({
    id: 'aiOptions',
    title: browser.i18n.getMessage('options'),
    contexts: [
        'message_display_action_menu'
    ],
    onclick: () => {
        browser.runtime.openOptionsPage()
    }
})

// Invocation of the method to handle the visibility of menu options based on the user-selected LLM.
// This ensures that all menu items are properly handled at add-on startup.
updateMenuVisibility()
// <-- create the menu entries

// Register a listener for the menus.onClicked events
messenger.menus.onClicked.addListener(async (info: browser.menus.OnClickData) => {
    const configs = await getConfigs()
    const llmProvider = ProviderFactory.getInstance(configs)

    if(info.menuItemId == menuIdSummarize) {
        sendMessageToActiveTab({type: 'thinking', content: messenger.i18n.getMessage('thinking')})

        const textToSummarize = (info.selectionText) ? info.selectionText : await getCurrentMessageContent()

        if(textToSummarize == null) {
            sendMessageToActiveTab({type: 'showError', content: messenger.i18n.getMessage('errorTextNotFound')})
        }
        else {
            llmProvider.summarizeText(textToSummarize).then(textSummarized => {
                sendMessageToActiveTab({type: 'addText', content: textSummarized})
            }).catch(error => {
                sendMessageToActiveTab({type: 'showError', content: error.message})
                logMessage(`Error during summarization: ${error.message}`, 'error')
            })
        }
    }
    if(info.menuItemId == menuIdSoftenText) {
        sendMessageToActiveTab({type: 'thinking', content: messenger.i18n.getMessage('thinking')})

        const textToSoften = (info.selectionText) ? info.selectionText : await getCurrentMessageContent()

        if(textToSoften == null) {
            sendMessageToActiveTab({type: 'showError', content: messenger.i18n.getMessage('errorTextNotFound')})
        }
        else {
            llmProvider.softenText(textToSoften).then(textSoftened => {
                sendMessageToActiveTab({type: 'addText', content: textSoftened})
            }).catch(error => {
                sendMessageToActiveTab({type: 'showError', content: error.message})
                logMessage(`Error during softening: ${error.message}`, 'error')
            })
        }
    }
    else if(info.menuItemId == menuIdSuggestReply) {
        sendMessageToActiveTab({type: 'thinking', content: messenger.i18n.getMessage('thinking')})

        const textForSuggestion = (info.selectionText) ? info.selectionText : await getCurrentMessageContent()

        if(textForSuggestion == null) {
            sendMessageToActiveTab({type: 'showError', content: messenger.i18n.getMessage('errorTextNotFound')})
        }
        else {
            llmProvider.suggestReplyFromText(textForSuggestion).then(textSuggested => {
                sendMessageToActiveTab({type: 'addText', content: textSuggested})
            }).catch(error => {
                sendMessageToActiveTab({type: 'showError', content: error.message})
                logMessage(`Error during reply generation: ${error.message}`, 'error')
            })
        }
    }
    else if(info.menuItemId == menuIdSummarizeAndText2Speech) {
        sendMessageToActiveTab({type: 'thinking', content: messenger.i18n.getMessage('thinking')})

        const textToTranslateAndText2Speech = (info.selectionText) ? info.selectionText : await getCurrentMessageContent()

        if(textToTranslateAndText2Speech == null) {
            sendMessageToActiveTab({type: 'showError', content: messenger.i18n.getMessage('errorTextNotFound')})
        }
        else {
            try {
                const textSummarized = await llmProvider.summarizeText(textToTranslateAndText2Speech)
                const blob = await llmProvider.getSpeechFromText(textSummarized)

                sendMessageToActiveTab({type: 'addAudio', content: blob})
            } catch (error) {
                sendMessageToActiveTab({type: 'showError', content: error.message})
                logMessage(`Error during summarization and text2Speech: ${error.message}`, 'error')
            }
        }
    }
    else if(info.menuItemId == menuIdText2Speech) {
        sendMessageToActiveTab({type: 'thinking', content: messenger.i18n.getMessage('thinking')})

        const textToPlay = (info.selectionText) ? info.selectionText : await getCurrentMessageContent()

        if(textToPlay == null) {
            sendMessageToActiveTab({type: 'showError', content: messenger.i18n.getMessage('errorTextNotFound')})
        }
        else {
            llmProvider.getSpeechFromText(textToPlay).then(blob => {
                sendMessageToActiveTab({type: 'addAudio', content: blob})
            }).catch(error => {
                sendMessageToActiveTab({type: 'showError', content: error.message})
                logMessage(`Error during text2Speech conversion: ${error.message}`, 'error')
            })
        }
    }
    else if(info.menuItemId == menuIdTranslate) {
        sendMessageToActiveTab({type: 'thinking', content: messenger.i18n.getMessage('thinking')})

        const textToTranslate = (info.selectionText) ? info.selectionText : await getCurrentMessageContent()

        if(textToTranslate == null) {
            sendMessageToActiveTab({type: 'showError', content: messenger.i18n.getMessage('errorTextNotFound')})
        }
        else {
            llmProvider.translateText(textToTranslate).then(textTranslated => {
                sendMessageToActiveTab({type: 'addText', content: textTranslated})
            }).catch(error => {
                sendMessageToActiveTab({type: 'showError', content: error.message})
                logMessage(`Error during translation: ${error.message}`, 'error')
            })
        }
    }
    else if(info.menuItemId == menuIdTranslateAndSummarize) {
        sendMessageToActiveTab({type: 'thinking', content: messenger.i18n.getMessage('thinking')})

        const textToTranslateAndSummarize = (info.selectionText) ? info.selectionText : await getCurrentMessageContent()

        if(textToTranslateAndSummarize == null) {
            sendMessageToActiveTab({type: 'showError', content: messenger.i18n.getMessage('errorTextNotFound')})
        }
        else {
            try {
                const textTranslated = await llmProvider.translateText(textToTranslateAndSummarize)
                const textTranslateAndSummarized = await llmProvider.summarizeText(textTranslated)

                sendMessageToActiveTab({type: 'addText', content: textTranslateAndSummarized})
            } catch (error) {
                sendMessageToActiveTab({type: 'showError', content: error.message})
                logMessage(`Error during translation and summarize: ${error.message}`, 'error')
            }
        }
    }
    else if(info.menuItemId == menuIdTranslateAndText2Speech) {
        sendMessageToActiveTab({type: 'thinking', content: messenger.i18n.getMessage('thinking')})

        const textToTranslateAndText2Speech = (info.selectionText) ? info.selectionText : await getCurrentMessageContent()

        if(textToTranslateAndText2Speech == null) {
            sendMessageToActiveTab({type: 'showError', content: messenger.i18n.getMessage('errorTextNotFound')})
        }
        else {
            try {
                const textTranslated = await llmProvider.translateText(textToTranslateAndText2Speech)
                const blob = await llmProvider.getSpeechFromText(textTranslated)

                sendMessageToActiveTab({type: 'addAudio', content: blob})
            } catch (error) {
                sendMessageToActiveTab({type: 'showError', content: error.message})
                logMessage(`Error during translation and text2Speech: ${error.message}`, 'error')
            }
        }
    }
    else if(info.menuItemId == menuIdModerate) {
        sendMessageToActiveTab({type: 'thinking', content: messenger.i18n.getMessage('thinking')})

        const textToModerate = await getCurrentMessageContent()

        if(textToModerate == null) {
            sendMessageToActiveTab({type: 'showError', content: messenger.i18n.getMessage('errorTextNotFound')})
        }
        else {
            llmProvider.moderateText(textToModerate).then(moderatedResponse => {
                sendMessageToActiveTab({type: 'addChart', content: moderatedResponse})
            }).catch(error => {
                sendMessageToActiveTab({type: 'showError', content: error.message})
                logMessage(`Error during moderation: ${error.message}`, 'error')
            })
        }
    }
})

/**
 * Using the messageDisplayScripts API for customizing the content displayed when
 * viewing a message.
 *
 * For more information check the docs at:
 * https://webextension-api.thunderbird.net/en/stable/messageDisplayScripts.html
 */
messenger.messageDisplayScripts.register({
    js: [{ file: '/messageDisplay/messageDisplayScripts.js' }],
    css: [{ file: '/messageDisplay/messageDisplayScripts.css' }]
})

/**
 * Using the composeScripts API for customizing the content displayed when create
 * or edit a message.
 *
 * For more information check the docs at:
 * https://webextension-api.thunderbird.net/en/stable/composeScripts.html
 */
messenger.composeScripts.register({
    js: [{ file: '/messageDisplay/messageDisplayScripts.js' }],
    css: [{ file: '/messageDisplay/messageDisplayScripts.css' }]
})

// Listens for the message signaling the change in configurations to update the
// interface.
browser.runtime.onMessage.addListener(async (message) => {
    if (message.type === 'optionsChanged') {
        updateMenuVisibility()
    }
})

// The function manages the visibility of menu options based on the user-selected
// LLM.
async function updateMenuVisibility(): Promise<void> {
    const configs = await getConfigs()
    const llmProvider = ProviderFactory.getInstance(configs)

    // canModerateText -->
    messenger.menus.update(menuIdModerate, {
        enabled: llmProvider.getCanModerateText()
    })
    // <-- canModerateText

    // canSpeechFromText -->
    messenger.menus.update(menuIdText2Speech, {
        enabled: llmProvider.getCanSpeechFromText()
    })

    messenger.menus.update(menuIdSummarizeAndText2Speech, {
        enabled: llmProvider.getCanSpeechFromText()
    })

    messenger.menus.update(menuIdTranslateAndText2Speech, {
        enabled: llmProvider.getCanSpeechFromText()
    })
    // <-- canSpeechFromText

    // canSoftenText -->
    messenger.menus.update(menuIdSoftenText, {
        enabled: llmProvider.getCanSoftenText()
    })
    // <-- canSoftenText

    // canSuggestReply -->
    messenger.menus.update(menuIdSuggestReply, {
        enabled: llmProvider.getCanSuggestReply()
    })
    // <-- canSuggestReply

    // canSummarizeText -->
    messenger.menus.update(menuIdSummarize, {
        enabled: llmProvider.getCanSummarizeText()
    })

    messenger.menus.update(subMenuIdSummarize, {
        enabled: llmProvider.getCanSummarizeText()
    })
    // <-- canSummarizeText

    // canTranslateText -->
    messenger.menus.update(menuIdTranslate, {
        enabled: llmProvider.getCanTranslateText()
    })

    messenger.menus.update(subMenuIdTranslateAnd, {
        enabled: llmProvider.getCanTranslateText()
    })
    // <-- canTranslateText
}