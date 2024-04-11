import {createStore} from "vuex";
import createPersistedState from "vuex-persistedstate"

const store = createStore({
    state: {
        isAuth: false,
        isLogin: false,
    },
    mutations: {
        setIsAuth(state, payload) {
            state.isAuth = payload;
        },
        setLogin(state, payload) {
            state.isLogin = payload;
        }
    },
    plugins: [createPersistedState({
        storage: window.localStorage
    })]
})

export default store;