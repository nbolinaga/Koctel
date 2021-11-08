export const state = () => ({
  user: null
})

export const mutations = {
  add (state, payload) {
    state.user = payload
  },
  remove () {
    state.user = null
  },
}

export const getters = {
  getUser: state => {
    return state.user
  }
}