
import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    Batches: {
      list: []
    },
    Items: {
      list: []
    },
    ItemsSummary: {
      list: []
    },
    Warehouses: {
      list: []
    },
    batchContainer: '',
    shouldFocusOnBatchContainerSearch: true,
    batchToAddress: {
      id: '',
      allocationStatus: '',
      warehouse: '',
      block: '',
      square: '',
      package: '',
      floor: '',
      list: []
    },
    serverAddress: '127.0.0.1'
  },

  mutations: {

    ADD_BATCH (state, obj) {
      state.Batches.list = []
      state.Batches.list.unshift(obj)
    },
    ADD_ITEMSUMMARY_TO_BATCH (state, obj) {
      state.batchToAddress.list.push(obj)
    },
    ADD_ITEM (state, obj) {
      var existingSummary = state.ItemsSummary.list.find(element => element.gtin === obj.gtin)
      if (!existingSummary) {
        var itemAlocado = 0
        if (obj.deposito && obj.deposito.length > 0) {
          itemAlocado = 1
        }
        state.ItemsSummary.list.push({
          descricao: obj.descricao,
          sku: obj.sku,
          gtin: obj.gtin,
          status: obj.status,
          pendente: 1,
          alocado: itemAlocado,
          quantidade: 1})
      }
      else {
        if (obj.deposito && obj.deposito.length > 0) {
          existingSummary.alocado++
        }
        existingSummary.quantidade++
        // existingSummary.pendente = existingSummary.quantidade - existingSummary.alocado
        // existingSummary.pendente = 0
        existingSummary.pendente = existingSummary.quantidade
      }
      state.batchToAddress.id = obj.lote
      state.Items.list.push(obj)
    },
    ADD_WAREHOUSE_TO_WHAREHOUSES (state, obj) {
      state.Warehouses.list.push(obj)
    },
    SET_PENDING_FIELD_TO_SUMMARY_LIST (state, { gtin, qtyToAddress }) {
      var i = 0
      for (i = 0; i < state.ItemsSummary.list.length; i++) {
        if (state.ItemsSummary.list[i].gtin === gtin) {
          state.ItemsSummary.list[i].pendente = qtyToAddress
          state.ItemsSummary.list[i].alocado = state.ItemsSummary.list[i].alocado + state.ItemsSummary.list[i].pendente
        }
      }
    },
    UPDATE_ALLOCATED_FIELD_IN_SUMMARY_LIST (state) {
      var i = 0
      for (i = 0; i < state.ItemsSummary.list.length; i++) {
        state.ItemsSummary.list[i].alocado = state.ItemsSummary.list[i].alocado + state.ItemsSummary.list[i].pendente
      }
    },
    RESET_PENDING_FIELD_IN_SUMMARY_LIST (state) {
      var i = 0
      for (i = 0; i < state.ItemsSummary.list.length; i++) {
        // state.ItemsSummary.list[i].pendente = state.ItemsSummary.list[i].quantidade - state.ItemsSummary.list[i].alocado
        state.ItemsSummary.list[i].pendente = 0
      }
    },
    UPDATE_STATUS_BATCH_TO_ADDRESS (state) {
      var isAllocationComplete = true
      var i = 0
      for (i = 0; i < state.ItemsSummary.list.length; i++) {
        if (state.ItemsSummary.list[i].quantidade - (state.ItemsSummary.list[i].alocado + state.ItemsSummary.list[i].pendente) > 0) {
          isAllocationComplete = false
        }
      }
      if (isAllocationComplete) {
        state.batchToAddress.allocationStatus = 'ALOCADO'
      }
      else {
        state.batchToAddress.allocationStatus = 'PARCIAL'
      }
      for (i = 0; i < state.ItemsSummary.list.length; i++) {
        state.ItemsSummary.list[i].status = state.batchToAddress.allocationStatus
      }
    },
    SET_BATCH_TO_ADDRESS (state, obj) {
      state.batchToAddress.id = obj.id
      state.batchToAddress.warehouse = obj.warehouse
      state.batchToAddress.block = obj.block
      state.batchToAddress.square = obj.square
      state.batchToAddress.package = obj.package
      state.batchToAddress.floor = obj.floor
    },
    SET_BATCH_TO_ADDRESS_ID (state, obj) {
      state.batchToAddress.id = obj
    },
    SET_BATCH_TO_ADDRESS_WAREHOUSE (state, obj) {
      state.batchToAddress.warehouse = obj
    },
    SET_BATCH_TO_ADDRESS_BLOCK (state, obj) {
      state.batchToAddress.block = obj
    },
    SET_BATCH_TO_ADDRESS_SQUARE (state, obj) {
      state.batchToAddress.square = obj
    },
    SET_BATCH_TO_ADDRESS_PACKAGE (state, obj) {
      state.batchToAddress.package = obj
    },
    SET_BATCH_TO_ADDRESS_FLOOR (state, obj) {
      state.batchToAddress.floor = obj
    },
    SET_SERVER_ADDRESS (state, obj) {
      state.serverAddress = obj
    },
    SET_BATCH_CONTAINER (state, obj) {
      state.batchContainer = obj
    },
    SET_FOCUS_ON_SEARCH (state, obj) {
      state.shouldFocusOnBatchContainerSearch = obj
    },
    CLEAR_BATCH_CONTAINER (state) {
      state.batchContainer = ''
    },
    CLEAR_ITEMS (state) {
      state.Items.list = []
    },
    CLEAR_SUMMARY   (state) {
      state.ItemsSummary.list = []
    },
    CLEAR_WAREHOUSE_LIST   (state) {
      state.Warehouses.list = []
    },
    CLEAR_BATCH_TO_ADDRESS_ALLOCATION (state) {
      state.batchToAddress.warehouse = ''
      state.batchToAddress.block = ''
      state.batchToAddress.square = ''
      state.batchToAddress.package = ''
      state.batchToAddress.floor = ''
    },
    CLEAR_BATCH_TO_ADDRESS_DETAILS (state) {
      state.batchToAddress.allocationStatus = ''
      state.batchToAddress.warehouse = ''
      state.batchToAddress.block = ''
      state.batchToAddress.square = ''
      state.batchToAddress.package = ''
      state.batchToAddress.floor = ''
      state.batchToAddress.list = []
    },
    CLEAR_BATCH_TO_ADDRESS (state) {
      state.batchToAddress.id = ''
      state.batchToAddress.allocationStatus = ''
      state.batchToAddress.warehouse = ''
      state.batchToAddress.block = ''
      state.batchToAddress.square = ''
      state.batchToAddress.package = ''
      state.batchToAddress.floor = ''
      state.batchToAddress.list = []
    }

  }
})
