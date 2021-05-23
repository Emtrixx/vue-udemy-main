export default {
    async contactCoach(context,payload) {
        const newRequest = {
            userEmail: payload.email,
            message: payload.message,
        }

        const response = await fetch(`https://vue-main-prj-7ff71-default-rtdb.europe-west1.firebasedatabase.app/requests/${payload.coachId}.json`, {
            method: 'POST',
            body: JSON.stringify(newRequest)
        })

        const responseData = await response.json();

        if(!response.ok) {
            const error = new Error(responseData.message || 'Failed to send request!')
            throw error
        }

        newRequest.id = responseData.name;
        newRequest.coachId = payload.coachId;

        context.commit('addContact', newRequest)
    },
    async fetchRequests(context) {
        const coachId =  context.rootGetters.userId;
        const token = context.rootGetters.token;
        const res = await fetch(`https://vue-main-prj-7ff71-default-rtdb.europe-west1.firebasedatabase.app/requests/${coachId}.json?auth=`+token)
        const resData = await res.json();

        if (!res.ok) {
            const error = new Error(resData.message || 'Failed to fetch data');
            throw error;
        }

        
        const requests = [];
        for (const key in resData) {
            const request = {
                id: key,
                coachId: coachId,
                userEmail: resData[key].userEmail,
                message: resData[key].message
            }
            requests.push(request);
        }
        context.commit('fetchRequests', requests)
    }
}