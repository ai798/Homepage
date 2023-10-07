import {
    createI18n
} from 'vue-i18n';
import EN from './en-EN.json'
import TW from './tw-TW.json'
import JP from './jp-JP.json'
const messages = {
    en: {
        ...EN
    },
    tw: {
        ...TW
    },
    jp: {
        ...JP
    }
}
let currentLang = window.localStorage.getItem('lang');
let windowLang = ''
if (!currentLang) {
    let langString = navigator.language;
    if (['TW', 'HK'].includes(langString)) {
        windowLang = 'tw'
    }
    let lang = langString.slice(0, 2)
    switch (lang) {
        case 'ja':
            windowLang = 'jp'
            break;
        default:
            windowLang = 'en';
    }
    window.localStorage.setItem('lang', windowLang)
} else {
    windowLang = currentLang
}
console.log(windowLang)
const i18n = createI18n({
    locale: windowLang,
    fallbackLocale: 'tw',
    messages,
    legacy: false
})
export default i18n