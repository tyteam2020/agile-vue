import { deepSearch, formatUrl } from '@core/utils/util'

const clientIdKey = 'ag:admin-client-id'
const accessTokenKey = 'ag:admin-access-token'

const auth = {
  namespaced: true,
  state: {
    loginAction: 'none', // none, modal, direct
    currentUser: null,
    groupMenus: [],
    groupMenusUrl: [],
    groupPermissions: []
  },
  getters: {
    getAccessToken: state => {
      return {
        clientId: window.localStorage.getItem(clientIdKey) || '',
        accessToken: window.localStorage.getItem(accessTokenKey) || ''
      }
    },
    getLoginAction: state => {
      return state.loginAction
    },
    getCurrentUser: state => {
      return state.currentUser
    },
    getGroupMenus: state => {
      return state.groupMenus
    },
    isRouteInAcl: state => (route) => {
      return state.groupPermissions.includes(route)
    },
    isRouteInMenus: state => (route) => {
      const path = route.startsWith('/') ? route.substr(1) : route

      return state.groupMenusUrl.map(menu => formatUrl(menu)).includes(path)
    }
  },
  mutations: {
    TOGGLE_CLIENT_ID: (state, clientId) => {
      state.clientId = clientId
      window.localStorage.setItem(clientIdKey, clientId)
    },
    TOGGLE_LOGIN_ACTION: (state, action) => {
      state.loginAction = action
    },
    UPDATE_CURRENT_USER: (state, user) => {
      state.currentUser = user
    },
    UPDATE_GROUP_MENUS: (state, menus) => {
      state.groupMenus = menus
      state.groupMenusUrl = deepSearch('url', menus)
    },
    UPDATE_GROUP_PERMISSIONS: (state, permissions) => {
      state.groupPermissions = permissions
    }
  },
  actions: {
    initClientId ({ commit }) {
      if (window.localStorage.getItem(clientIdKey) == null) {
        window.localStorage.setItem(clientIdKey, Math.random().toString(36).substr(2))
      }
    },
    setLoginAction ({ commit }, action) {
      commit('TOGGLE_LOGIN_ACTION', action)
    },
    login ({ commit }, data) {
      commit('TOGGLE_LOGIN_ACTION', 'none')
      commit('UPDATE_CURRENT_USER', data.currentUser)
      commit('UPDATE_GROUP_MENUS', data.groupMenus)
      commit('UPDATE_GROUP_PERMISSIONS', data.groupPermissions)

      window.localStorage.setItem(accessTokenKey, data.accessToken)
    },
    logout ({ commit }) {
      commit('UPDATE_ACCESS_TOKEN', null)
      commit('UPDATE_CURRENT_USER', null)
      commit('UPDATE_GROUP_MENUS', [])
      commit('UPDATE_GROUP_PERMISSIONS', [])

      window.localStorage.removeItem(accessTokenKey)
    },
    account ({ commit }, data) {
      commit('UPDATE_CURRENT_USER', data.currentUser)
      commit('UPDATE_GROUP_MENUS', data.groupMenus)
      commit('UPDATE_GROUP_PERMISSIONS', data.groupPermissions)
    }
  }
}

export default auth
