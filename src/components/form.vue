<script>
  import {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QInput,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    Toast
  } from 'quasar'

  export default {
    components: {
      QLayout,
      QToolbar,
      QToolbarTitle,
      QBtn,
      QIcon,
      QList,
      QListHeader,
      QInput,
      QItem,
      QItemSide,
      QItemMain,
      QItemTile,
      Toast
    },
    data () {
      return {
        timer: '',
        batch: {
          id: '',
          warehouse: '',
          block: '',
          square: '',
          package: ''
        },
        packedItem: {
          lote: '',
          id_item_inventario: '',
          epc: '',
          gtin: '',
          descricao: '',
          sku: '',
          data_leitura: '',
          qtde_volume: '',
          data_alocacao: '',
          status: ''
        }
      }
    },
    created () {
      this.timer = setInterval(this.setSearchFocus, 1000)
    },
    computed: {
      itemList () {
        return this.$store.state.ItemsSummary.list
      }
    },
    methods: {
      setSearchFocus () {
        if (this.$store.state.shouldFocusOnBatchContainerSearch) {
          this.$refs.containerSearchTextField.focus()
          this.$store.commit('SET_FOCUS_ON_SEARCH', false)
        }
      },
      preventSubmit () {
        console.log('Prevent Submit.')
      },
      cleanUpData () {
        this.$store.commit('CLEAR_ITEMS')
        this.$store.commit('CLEAR_SUMMARY')
        this.$store.commit('CLEAR_BATCH_TO_ADDRESS')
        this.$store.commit('SET_FOCUS_ON_SEARCH', true)
      },
      loadWarehouseList () {
        var self = this
        self.$store.commit('CLEAR_WAREHOUSE_LIST')
        self.$http.get('http://' + self.$store.state.serverAddress + ':1880/connector/v1/warehouse/list/1')
          .then(function (response) {
            // console.log(response.data)
            if (response.data.length === 0) {
              Toast.create.warning({
                html: 'Erro ao buscar depósitos ativos.'
              })
            }
            else {
              for (var i = 0; i < response.data.length; i++) {
                var item = { }
                item.idDeposito = response.data[i].idDeposito
                item.descricao = response.data[i].descricao
                item.idApp = response.data[i].idApp
                item.ativo = response.data[i].ativo

                self.$store.commit('ADD_WAREHOUSE_TO_WHAREHOUSES', item)
              }
            }
            self.$forceUpdate()
          })
      },
      submit () {
        var self = this
        self.loadWarehouseList()
        self.$store.commit('CLEAR_ITEMS')
        self.$store.commit('CLEAR_SUMMARY')
        // var host = window.location.hostname
        self.$store.commit('SET_BATCH_CONTAINER', this.batch.id)
        self.$http.get('http://' + self.$store.state.serverAddress + ':1880/connector/v1/cyclecount/list/' + this.batch.id)
          .then(function (response) {
            // console.log(response.data)
            if (response.data.length === 0) {
              // self.$store.commit('CLEAR_ITEMS')
              // self.$store.commit('CLEAR_SUMMARY')
              Toast.create.warning({
                html: 'Nenhum unitizador encontrado.'
              })
            }
            else {
              for (var i = 0; i < response.data.length; i++) {
                var item = { }
                item.lote = response.data[i].lote
                item.id_item_inventario = response.data[i].id_item_inventario
                item.gtin = response.data[i].gtin
                item.descricao = response.data[i].descricao.trim()
                item.sku = response.data[i].sku
                item.data_leitura = response.data[i].data_leitura
                item.qtde_volume = response.data[i].qtde_volume
                item.data_alocacao = response.data[i].data_alocacao
                item.status = response.data[i].status
                item.epc = response.data[i].epc
                item.deposito = response.data[i].deposito
                item.bloco = response.data[i].bloco
                item.quadra = response.data[i].quadra
                item.alocacaoLote = response.data[i].alocacaoLote
                item.andar = response.data[i].andar
                // console.log(item)
                self.$store.commit('ADD_ITEM', item)
              }
              self.reset()
              self.$forceUpdate()
            }
          })
          .catch(function (error) {
            console.log(error)
            self.$store.commit('CLEAR_ITEMS')
            self.$store.commit('CLEAR_SUMMARY')
            Toast.create.negative({
              html: 'Erro ao buscar unitizador.'
            })
          })
      },
      reset () {
        this.batch.id = ''
      },
      cancelAutoUpdate () {
        clearInterval(this.timer)
      },
      beforeDestroy () {
        clearInterval(this.timer)
      }
    }
  }
</script>


<template>

  <form @submit.prevent="preventSubmit">
    <table class="q-table my-table">
      <tr class="my-table">
        <td class="my-table"><q-input ref="containerSearchTextField" v-model="batch.id"  type="number"  placeholder="999999" float-label="Unitizador"/> </td>

        <td class="my-table"><q-btn icon="clear" color="primary" @click="cleanUpData">Limpar</q-btn></td>
      </tr>
    </table>
    <q-btn icon="search" color="primary" class="my-button" @click="submit">[Buscar]</q-btn>

  </form>


</template>



<style scoped>
  .my-table {
    width: 100%;
    margin-bottom: 20px;
  }

  .my-input {
    width: 100%;
    margin-bottom: 20px;
  }

  .my-button{
    width: 100%;
  }
</style>
