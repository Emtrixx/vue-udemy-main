import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import CoachesList from './pages/coaches/CoachesList.vue'
import RequestsReceived from './pages/requests/RequestsReceived.vue'
import UserAuth from './pages/auth/UserAuth.vue'
import store from './store/index'

//Better to import route component async (e.g CoachRegistration)
const CoachDetail = defineAsyncComponent(() => import('./pages/coaches/CoachDetail.vue'))
const ContactCoach = defineAsyncComponent(() => import('./pages/requests/ContactCoach.vue'))
const NotFound = defineAsyncComponent(() => import('./pages/NotFound.vue'))

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: 'coaches' },
        { path: '/coaches', component: CoachesList },
        {
            path: '/coaches/:id', component: CoachDetail, props: true, children: [
                { path: 'contact', component: ContactCoach }
            ]
        },
        { path: '/register', component: () => import('./pages/coaches/CoachRegistration.vue'), meta: { requiresAuth: true } },
        { path: '/requests', component: RequestsReceived, meta: { requiresAuth: true } },
        { path: '/auth', component: UserAuth, meta: { requiresUnauth: true } },
        { path: '/:notFound(.*)', component: NotFound }

    ]
})

router.beforeEach((to, _, next) => {
    if(to.meta.requiresAuth && !store.getters.isAuthenticated) {
        return next('/auth')
    } else if(to.meta.requiresUnauth && store.getters.isAuthenticated) {
        return next('/coaches')
    }
    next()
})

export default router;