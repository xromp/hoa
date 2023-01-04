/*=========================================================================================
  File Name: moduleCalendarMutations.js
  Description: Calendar Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  SET_USERS (state, users) {
    state.users = users
  },
  REMOVE_RECORD (state, itemId) {
    const userIndex = state.users.findIndex((u) => u.id === itemId)
    state.users.splice(userIndex, 1)
  },

  SET_PROPERTIES (state, properties) {
    state.properties = properties
  },
  REMOVE_RECORD (state, itemId) {
    const userIndex = state.properties.findIndex((u) => u.id === itemId)
    state.properties.splice(userIndex, 1)
  },

  SET_PORTFOLIOS (state, portfolios) {
    state.portfolios = portfolios
  },
  REMOVE_RECORD (state, itemId) {
    const userIndex = state.portfolios.findIndex((u) => u.id === itemId)
    state.portfolios.splice(userIndex, 1)
  }
}
