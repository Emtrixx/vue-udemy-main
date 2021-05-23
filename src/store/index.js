import { createStore } from 'vuex'

import coachesModule from './coaches/index.js'
import requestsModule from './requests/index.js'
import authModule from './auth/index.js'

const store = createStore({
    modules: {
        coaches: coachesModule,
        requests: requestsModule,
        auth: authModule
    }
})

export default store;