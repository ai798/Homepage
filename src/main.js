import {
    createApp
} from 'vue'
import App from './App.vue'
import './index.css'
import 'element-plus/dist/index.css'
import i18n from './lang'
import router from '@/router'
import {
    v4 as uuidv4
} from 'uuid'
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// VuePress主题以及样式（这里也可以选择github主题）
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
// 代码高亮
import 'prismjs/components/prism-json';
// 选择使用主题
VMdPreview.use(vuepressTheme, {
    Prism,
});

let onlyUuid = uuidv4();

if (!window.localStorage.getItem('script_uuid')) {
    window.localStorage.setItem('script_uuid', onlyUuid);
}
const app = createApp(App).use(i18n).use(router).use(VMdPreview).mount('#app')