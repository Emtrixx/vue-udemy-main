let timer;

export default {
    async signup(context, payload) {
        return context.dispatch('auth', { ...payload, mode: 'signup' })
    },
    async login(context, payload) {
        return context.dispatch('auth', payload)
    },
    async auth(context, payload) {
        let fetchUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAh6PITKYNrPX8G9J6Kr7Qcr8jm7vg5eNU';
        if (payload.mode === 'signup') {
            fetchUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAh6PITKYNrPX8G9J6Kr7Qcr8jm7vg5eNU';
        }
        const res = await fetch(fetchUrl, {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true
            })
        })
        const resData = await res.json();
        if (!res.ok) {
            console.log(resData);
            const error = new Error(resData.message || 'Failed to authenticate!')
            throw error
        }

        // const expiresIn = +resData.expiresIn * 1000
        const expiresIn = 5000
        const expirationDate = Date.now() + expiresIn
        localStorage.setItem('token', resData.idToken)
        localStorage.setItem('userId', resData.localId)
        localStorage.setItem('tokenExpiration', expirationDate)

        timer = setTimeout(() => {
            context.dispatch('autoLogout')
        }, expiresIn)

        context.commit('setUser', {
            token: resData.idToken,
            userId: resData.localId,
        })
    },
    tryLogin(context) {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        const tokenExpiration = localStorage.getItem('tokenExpiration')

        const expiresIn = +tokenExpiration - Date.now()

        if (expiresIn < 1000) {
            return
        }

        timer = setTimeout(() => {
            context.dispatch('autoLogout')
        }, expiresIn)

        if (token && userId) {
            context.commit('setUser', {
                token,
                userId,
            })
        }
    },
    logout(context) {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('tokenExpiration')

        clearTimeout(timer)

        context.commit('setUser', {
            token: null,
            userId: null,
        })
    },
    autoLogout(context) {
       context.dispatch('logout')
       context.commit('setAutoLogout')
    }
}