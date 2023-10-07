import {
    createWebHashHistory,
    createRouter
} from "vue-router";
import chatBase from '@/components/chat.vue'
import homePage from '@/components/homePage.vue'

const history = createWebHashHistory();
const router = createRouter({
    history,
    routes: [{
            path: '/',
            component: homePage
        },
        {
            path: '/liaotian',
            component: chatBase
        }
    ]
})
export default router;