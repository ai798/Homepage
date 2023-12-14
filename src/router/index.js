import {
    createWebHashHistory,
    createRouter
} from "vue-router";
import chatBase from '@/components/chat.vue'
import homePage from '@/components/homePage.vue'
import homePageLogin from '@/components/homePageLogin.vue'

const history = createWebHashHistory();
const router = createRouter({
    history,
    routes: [{
            path: '/',
            redirect: '/home'
        }, {
            path: '/home',
            component: homePageLogin
        },
        {
            path: '/chat',
            component: chatBase
        }
    ]
})
export default router;