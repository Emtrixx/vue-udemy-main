export default {
    addContact(state, payload) {
        state.requests.push(payload)
    },
    fetchRequests(state, payload) {
        state.requests = payload
    }
}