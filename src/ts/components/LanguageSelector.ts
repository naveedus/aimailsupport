class LanguageSelector extends HTMLSelectElement {
    constructor() {
        super()

        const languages: { code: string; name: string }[] = [
            { code: 'af', name: 'Afrikaans - Afrikaans' },
            { code: 'sq', name: 'Albanian - Shqip' },
            { code: 'am', name: 'Amharic - አማርኛ' },
            { code: 'ar', name: 'Arabic - العربية' },
            { code: 'hy', name: 'Armenian - Հայերեն' },
            { code: 'az', name: 'Azerbaijani - Azərbaycan dili' },
            { code: 'eu', name: 'Basque - Euskara' },
            { code: 'be', name: 'Belarusian - Беларуская' },
            { code: 'bn', name: 'Bengali - বাংলা' },
            { code: 'bs', name: 'Bosnian - Bosanski' },
            { code: 'bg', name: 'Bulgarian - Български' },
            { code: 'ca', name: 'Catalan - Català' },
            { code: 'zh', name: 'Chinese - 中文' },
            { code: 'hr', name: 'Croatian - Hrvatski' },
            { code: 'cs', name: 'Czech - Čeština' },
            { code: 'da', name: 'Danish - Dansk' },
            { code: 'nl', name: 'Dutch - Nederlands' },
            { code: 'en', name: 'English' },
            { code: 'eo', name: 'Esperanto - Esperanto' },
            { code: 'et', name: 'Estonian - Eesti' },
            { code: 'fi', name: 'Finnish - Suomi' },
            { code: 'fr', name: 'French - Français' },
            { code: 'ka', name: 'Georgian - ქართული' },
            { code: 'de', name: 'German - Deutsch' },
            { code: 'el', name: 'Greek - Ελληνικά' },
            { code: 'he', name: 'Hebrew - עברית' },
            { code: 'hi', name: 'Hindi - हिन्दी' },
            { code: 'hu', name: 'Hungarian - Magyar' },
            { code: 'is', name: 'Icelandic - Íslenska' },
            { code: 'id', name: 'Indonesian - Bahasa Indonesia' },
            { code: 'ga', name: 'Irish - Gaeilge' },
            { code: 'it', name: 'Italian - Italiano' },
            { code: 'ja', name: 'Japanese - 日本語' },
            { code: 'kn', name: 'Kannada - ಕನ್ನಡ' },
            { code: 'kk', name: 'Kazakh - Қазақша' },
            { code: 'ko', name: 'Korean - 한국어' },
            { code: 'ku', name: 'Kurdish - Kurdî' },
            { code: 'lv', name: 'Latvian - Latviešu' },
            { code: 'lt', name: 'Lithuanian - Lietuvių' },
            { code: 'mk', name: 'Macedonian - Македонски' },
            { code: 'ms', name: 'Malay - Bahasa Melayu' },
            { code: 'ml', name: 'Malayalam - മലയാളം' },
            { code: 'mt', name: 'Maltese - Malti' },
            { code: 'mr', name: 'Marathi - मराठी' },
            { code: 'mn', name: 'Mongolian - Монгол' },
            { code: 'ne', name: 'Nepali - नेपाली' },
            { code: 'no', name: 'Norwegian - Norsk' },
            { code: 'pl', name: 'Polish - Polski' },
            { code: 'pt', name: 'Portuguese - Português' },
            { code: 'pa', name: 'Punjabi - ਪੰਜਾਬੀ' },
            { code: 'ro', name: 'Romanian - Română' },
            { code: 'ru', name: 'Russian - Русский' },
            { code: 'sr', name: 'Serbian - Српски' },
            { code: 'sk', name: 'Slovak - Slovenčina' },
            { code: 'sl', name: 'Slovenian - Slovenščina' },
            { code: 'es', name: 'Spanish - Español' },
            { code: 'sw', name: 'Swahili - Kiswahili' },
            { code: 'sv', name: 'Swedish - Svenska' },
            { code: 'ta', name: 'Tamil - தமிழ்' },
            { code: 'te', name: 'Telugu - తెలుగు' },
            { code: 'th', name: 'Thai - ไทย' },
            { code: 'tr', name: 'Turkish - Türkçe' },
            { code: 'uk', name: 'Ukrainian - Українська' },
            { code: 'ur', name: 'Urdu - اردو' },
            { code: 'vi', name: 'Vietnamese - Tiếng Việt' },
            { code: 'cy', name: 'Welsh - Cymraeg' },
            { code: 'yo', name: 'Yoruba - Yorùbá' },
            { code: 'zu', name: 'Zulu - isiZulu' }
        ]

        languages.forEach((lang) => {
            const optionElement: HTMLOptionElement = document.createElement('option')
            optionElement.value = lang.code
            optionElement.textContent = lang.name

            this.appendChild(optionElement)
        })
    }
}

customElements.define('language-selector', LanguageSelector, { extends: 'select' })