// Specific code to manage options for Ollama

import { getConfig } from '../helpers/utils'
import { OllamaProvider } from '../llmProviders/impl/ollamaProvider'

// Adds an event listener to display all available Ollama local models for
// user selection.
document.querySelector('#ollamaListModel').addEventListener('click', async _ => {

    const selectOllamaModel = document.querySelector<HTMLSelectElement>('#ollamaModel')

    // The last selected model or the one previously saved in the options is
    // retrieved, and then all models are removed from the list to ensure
    // that the newly read models completely replace the old list.
    const selectedValue = selectOllamaModel.value || (await getConfig('ollama')).model
    selectOllamaModel.innerHTML = ''

    try {
        const ollamaLocalModels = await OllamaProvider.getLocalModels()

        // Sort the array by the 'name' field
        ollamaLocalModels.sort((a, b) => a.name.localeCompare(b.name))

        // Add the newly retrieved models
        ollamaLocalModels.forEach(model => {
            const option = document.createElement('option')
            option.textContent = model.name
            option.value = model.model

            // Restore the previously selected model (if any)
            if (selectedValue && model.name == selectedValue) {
                option.selected = true
            }

            selectOllamaModel.appendChild(option)
        })
    } catch (error) {
        // TODO: manage network unavailable or CORS “Access-Control-Allow-Origin”
        // https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-allow-additional-web-origins-to-access-ollama
        // e.g. launchctl setenv OLLAMA_ORIGINS "moz-extension://*"
        // https://github.com/ollama/ollama/blob/main/docs/faq.md#how-do-i-configure-ollama-server
    }
})
