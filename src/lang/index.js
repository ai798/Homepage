import {
    createI18n
} from 'vue-i18n';
import EN from './en-EN.json'
import TW from './zh-HK.json'
import JP from './ja-JA.json'
import CN from './zh-CN.json'
const messages = {
    cn: {
        ...CN
    },
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
        case 'cn':
            windowLang = 'cn'
            break;
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