export default {
    registerCoach(state, data) {
        state.coaches.push(data)
    },
    setCoaches(state, payload) {
        state.coaches = payload
    },
    setFetchTimestamp(state) {
        state.lastFetch = Date.now()
    }
}