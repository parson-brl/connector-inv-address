<script>
  import {
    format,
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QCheckbox,
    QIcon,
    QList,
    QListHeader,
    QInput,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QItemSeparator,
    Toast
  } from 'quasar'

  const {pad} = format

  export default {
    components: {
      QLayout,
      QToolbar,
      QToolbarTitle,
      QBtn,
      QCheckbox,
      QIcon,
      QInput,
      QList,
      QListHeader,
      QItem,
      QItemSide,
      QItemMain,
      QItemTile,
      QItemSeparator,
      Toast
    },
    data () {
      return {
        allocateAll: false,
        barcodePositionField: ''
      }
    },
    methods: {
      fieldLenValidatorWarehouseField (evt) {
        var self = this
        self.warehouseField = pad(self.warehouseField.toString(), 2)
        if (evt.keyCode === 13) {
          self.$refs.blockField.focus()
        }
        if (parseInt(self.warehouseField) > 99) {
          self.warehouseField = pad(self.warehouseField.toString().substring(0, 1), 2)
          evt.preventDefault()
        }
      },
      fieldLenValidatorBlockField (evt) {
        var self = this
        self.blockField = pad(self.blockField.toString(), 2)
        if (evt.keyCode === 13) {
          self.$refs.squareField.focus()
        }
        if (parseInt(self.blockField) > 99) {
          self.blockField = pad(self.blockField.toString().substring(0, 1), 2)
          evt.preventDefault()
        }
      },
      fieldLenValidatorSquareField (evt) {
        var self = this
        if (evt.keyCode === 13) {
          self.$refs.packageField.focus()
        }
        if (parseInt(self.squareField) > 8) {
          self.squareField = self.squareField.toString().substring(0, 0)
          evt.preventDefault()
        }
      },
      fieldLenValidatorPackageField (evt) {
        var self = this
        self.packageField = pad(self.packageField.toString(), 2)
        if (evt.keyCode === 13) {
          self.$refs.floorField.focus()
        }
        if (parseInt(self.packageField) > 98) {
          self.packageField = pad(self.packageField.toString().substring(0, 1), 2)
          evt.preventDefault()
        }
      },
      fieldLenValidatorFloorField (evt) {
        var self = this
        if (parseInt(self.floorField) > 8) {
          self.floorField = self.floorField.toString().substring(0, 0)
          evt.preventDefault()
        }
      },
      itemsPendingFound: function (item) {
        if (item.quantidade - item.alocado !== 0) {
          return true
        }
        else {
          return false
        }
      },
      fieldLenValidatorBarcodePositionField: function (evt) {
        // var self = this
        // var currentData = this.barcodePositionField
        this.$nextTick(() => {
          let containsLineBreak = false
          let keyCode = 0
          console.log('barcodePositionField length:' + this.barcodePositionField.toString().length)
          // console.log('currentData length:' + currentData.toString().length)
          console.log('barcodePositionField:' + this.barcodePositionField)
          if (evt.key !== undefined) {
            keyCode = evt.key
          }
          else if (evt.keyIdentifier !== undefined) {
            keyCode = evt.keyIdentifier
          }
          else if (evt.keyCode !== undefined) {
            keyCode = evt.keyCode
          }
          if (this.barcodePositionField.toString().indexOf('\n') > -1) {
            containsLineBreak = true
          }
          console.log('fieldLenValidatorBarcodePositionField:' + keyCode)
          // this.barcodePositionField.length > 6 ||
          if (containsLineBreak || this.barcodePositionField.toString().length > 7 || keyCode === 13 || keyCode === 9 || keyCode === 'Tab' || keyCode === 'Enter') {
            this.warehouseField = this.barcodePositionField.toString().substring(0, 2)
            this.blockField = this.barcodePositionField.toString().substring(2, 4)
            this.squareField = this.barcodePositionField.toString().substring(4, 5)
            this.packageField = this.barcodePositionField.toString().substring(5, 7)
            if (this.warehouseField.toString().length === 1) {
              this.warehouseField = '0' + this.warehouseField
            }
            if (this.blockField.toString().length === 1) {
              this.blockField = '0' + this.blockField
            }
            if (this.packageField.toString().length === 1) {
              this.packageField = '0' + this.packageField
            }
            if (this.barcodePositionField.toString().length >= 8) {
              this.floorField = this.barcodePositionField.toString().substring(7, 8)
            }
            this.$refs.floorField.focus()
          }
        })
      },
      focusOnSearchForm () {
        var self = this
        self.$store.commit('CLEAR_ITEMS')
        self.$store.commit('CLEAR_SUMMARY')
        self.$store.commit('CLEAR_BATCH_TO_ADDRESS')
        self.$store.commit('CLEAR_BATCH_CONTAINER')
        self.$store.commit('SET_FOCUS_ON_SEARCH', true)
        // self.reset()
        self.$forceUpdate()
      },
      allocate () {
        var self = this
        // var host = window.location.hostname
        // var postData = JSON.stringify(self.$store.state.batchToAddress)
        var i = 0
        var shouldPost = true
        var isWarehouseInDatabase = false
        for (i = 0; i < self.$store.state.Warehouses.list.length; i++) {
          if (self.$store.state.Warehouses.list[i].idApp === self.$store.state.batchToAddress.warehouse) {
            isWarehouseInDatabase = true
            if (self.$store.state.Warehouses.list[i].ativo !== 1) {
              shouldPost = false
              Toast.create.negative({
                html: 'O depósito informado não está ativo.'
              })
            }
          }
        }
        if (shouldPost && isWarehouseInDatabase) {
          if (!self.$store.state.batchToAddress.block ||
            !self.$store.state.batchToAddress.floor ||
            !self.$store.state.batchToAddress.package ||
            !self.$store.state.batchToAddress.square ||
            !self.$store.state.batchToAddress.warehouse ||
            isNaN(parseInt(self.$store.state.batchToAddress.block)) ||
            isNaN(parseInt(self.$store.state.batchToAddress.package)) ||
            isNaN(parseInt(self.$store.state.batchToAddress.warehouse)) ||
            isNaN(parseInt(self.$store.state.batchToAddress.square)) ||
            isNaN(parseInt(self.$store.state.batchToAddress.floor)) ||
            parseInt(self.$store.state.batchToAddress.block) > 99 ||
            parseInt(self.$store.state.batchToAddress.package) > 99 ||
            parseInt(self.$store.state.batchToAddress.warehouse) > 99 ||
            parseInt(self.$store.state.batchToAddress.square) > 9 ||
            parseInt(self.$store.state.batchToAddress.floor) > 9) {
            self.$store.commit('CLEAR_BATCH_TO_ADDRESS_ALLOCATION')
            self.$store.commit('RESET_PENDING_FIELD_IN_SUMMARY_LIST')
            shouldPost = false
            Toast.create.negative({
              html: 'Por favor informe os dados de alocação corretamente.'
            })
            return
          }
        }
        if (shouldPost && isWarehouseInDatabase) {
          for (i = 0; i < self.$store.state.ItemsSummary.list.length; i++) {
            if ((self.$store.state.ItemsSummary.list[i].pendente + self.$store.state.ItemsSummary.list[i].alocado) > self.$store.state.ItemsSummary.list[i].quantidade) {
              shouldPost = false
              self.$store.commit('RESET_PENDING_FIELD_IN_SUMMARY_LIST')
              self.$store.commit('CLEAR_BATCH_TO_ADDRESS_DETAILS')
              Toast.create.negative({
                html: 'Quantidade de itens a serem alocados somada a quantidade já alocada deve ser menor ou igual a quantidade total.'
              })
              return
            }
            if (self.allocateAll) {
              var qtyToAddressToAll = self.$store.state.ItemsSummary.list[i].quantidade - self.$store.state.ItemsSummary.list[i].alocado
              var gtinToAddressAll = self.$store.state.ItemsSummary.list[i].gtin
              self.$store.commit('SET_PENDING_FIELD_TO_SUMMARY_LIST', {gtinToAddressAll, qtyToAddressToAll})
              self.$store.commit('ADD_ITEMSUMMARY_TO_BATCH', self.$store.state.ItemsSummary.list[i])
            }
            else {
              if (self.$store.state.ItemsSummary.list[i].pendente > 0) {
                var qtyToAddress = self.$store.state.ItemsSummary.list[i].pendente
                var gtinToAddress = self.$store.state.ItemsSummary.list[i].gtin
                self.$store.commit('SET_PENDING_FIELD_TO_SUMMARY_LIST', {gtinToAddress, qtyToAddress})
                self.$store.commit('ADD_ITEMSUMMARY_TO_BATCH', self.$store.state.ItemsSummary.list[i])
              }
            }
          }
          self.$store.commit('UPDATE_STATUS_BATCH_TO_ADDRESS')
          var postData = self.$store.state.batchToAddress
          console.log('postData:' + postData)
          console.log('self.allocateAll:' + self.allocateAll)
          self.$http.post('http://' + self.$store.state.serverAddress + ':1880/connector/v1/cyclecount/setaddress', postData)
            .then(function (response) {
              console.log('allocate:' + response.data)
              self.$http.get('http://' + self.$store.state.serverAddress + ':1880/connector/v1/cyclecount/sum/' + self.$store.state.batchToAddress.id)
                .then(function (response) {
                  if (self.allocateAll) {
                    self.$store.commit('CLEAR_ITEMS')
                    self.$store.commit('CLEAR_SUMMARY')
                    self.$store.commit('CLEAR_BATCH_TO_ADDRESS')
                    self.$store.commit('CLEAR_BATCH_CONTAINER')
                    self.$store.commit('SET_FOCUS_ON_SEARCH', true)
                  }
                  else {
                    if (self.$store.state.batchToAddress.allocationStatus === 'ALOCADO') {
                      self.$store.commit('CLEAR_ITEMS')
                      self.$store.commit('CLEAR_SUMMARY')
                      self.$store.commit('CLEAR_BATCH_TO_ADDRESS')
                      self.$store.commit('CLEAR_BATCH_CONTAINER')
                      self.$store.commit('SET_FOCUS_ON_SEARCH', true)
                    }
                    else {
                      self.$store.commit('UPDATE_ALLOCATED_FIELD_IN_SUMMARY_LIST')
                      self.$store.commit('RESET_PENDING_FIELD_IN_SUMMARY_LIST')
                      self.$store.commit('CLEAR_BATCH_TO_ADDRESS_DETAILS')
                      self.$store.commit('CLEAR_BATCH_CONTAINER')
                      self.$store.commit('SET_FOCUS_ON_SEARCH', true)
                    }
                  }
                  console.log(response)
                })
                .catch(function (error) {
                  console.log(error)
                })
              Toast.create.info({
                html: 'Operação realizada.'
              })
              self.barcodePositionField = ''
            })
            .catch(function (error) {
              console.log(error)
              Toast.create.negative({
                html: 'Erro ao tentar executar operação.'
              })
            })
        }
        if (!isWarehouseInDatabase) {
          self.$store.commit('CLEAR_BATCH_TO_ADDRESS_ALLOCATION')
          Toast.create.negative({
            html: 'O depósito informado não foi encontrado no banco de dados.'
          })
        }
      }
    },
    computed: {
      isSingleSkuOnly: {
        get () {
          if (this.$store.state.ItemsSummary.list.length === 1) {
            return true
          }
          else {
            return false
          }
        }
      },
      warehouseField: {
        get () {
          return this.$store.state.batchToAddress.warehouse
        },
        set (value) {
          this.$store.commit('SET_BATCH_TO_ADDRESS_WAREHOUSE', value)
        }
      },
      blockField: {
        get () {
          return this.$store.state.batchToAddress.block
        },
        set (value) {
          this.$store.commit('SET_BATCH_TO_ADDRESS_BLOCK', value)
        }
      },
      squareField: {
        get () {
          return this.$store.state.batchToAddress.square
        },
        set (value) {
          this.$store.commit('SET_BATCH_TO_ADDRESS_SQUARE', value)
        }
      },
      packageField: {
        get () {
          return this.$store.state.batchToAddress.package
        },
        set (value) {
          this.$store.commit('SET_BATCH_TO_ADDRESS_PACKAGE', value)
        }
      },
      floorField: {
        get () {
          return this.$store.state.batchToAddress.floor
        },
        set (value) {
          this.$store.commit('SET_BATCH_TO_ADDRESS_FLOOR', value)
        }
      },
      itemList () {
        console.log('this.$store.state.ItemsSummary.list.length: ' + this.$store.state.ItemsSummary.list.length)
        if (this.$store.state.ItemsSummary.list.length > 1) {
          // console.log('SET_PENDINGFIELD_TO_SUMMARY_LIST')
          // this.$store.commit('SET_PENDING_FIELD_TO_SUMMARY_LIST', 0)
          // this.$store.commit('RESET_PENDING_FIELD_IN_SUMMARY_LIST')
        }
        return this.$store.state.ItemsSummary.list
      },
      itemBatchId () {
        if (this.$store.state.Items.list.length > 0) {
          this.$store.commit('SET_BATCH_TO_ADDRESS_ID', this.$store.state.Items.list[0].lote)
          return this.$store.state.Items.list[0].lote
        }
        else {
          return ''
        }
      },
      itemBatchContainer () {
        return this.$store.state.batchContainer
      }
    }
  }
</script>

<template>
  <div>

    <q-list highligh>
      <template v-if="itemList.length > 0">
        <q-list-header>Conteúdo do unitizador {{ itemBatchContainer }}</q-list-header>
        <div class="col">
          <q-input ref="barcodePositionField" v-model="barcodePositionField" type="text" placeholder="9999999"
                   float-label="Posição" autofocus
                   @keydown="fieldLenValidatorBarcodePositionField" :max-length="128"/>
        </div>
        <br>
        <q-btn icon="open_in_browser" color="primary" class="my-button" @click="allocate">[Alocar]</q-btn>
        <br>
        <br>
        <q-checkbox v-model="allocateAll" label="Alocar todos os produtos no mesmo endereço"></q-checkbox>
        <table class="q-table">
          <tbody>
          <tr>
            <td class="text-left">
              <q-input ref="warehouseField" v-model="warehouseField" type="number" placeholder="XX" float-label="Depósito"
                       @keydown="fieldLenValidatorWarehouseField" :max-length="2"/>
            </td>
            <td class="text-left">
              <q-input ref="blockField" v-model="blockField" type="number" placeholder="XX" float-label="Bloco"
                       @keydown="fieldLenValidatorBlockField" :max-length="2"/>
            </td>
            <td class="text-left">
              <q-input ref="squareField" v-model="squareField" type="number" placeholder="X" float-label="Quadra"
                       @keydown="fieldLenValidatorSquareField" :max-length="1"/>
            </td>
            <td class="text-left">
              <q-input ref="packageField" v-model="packageField" type="number" placeholder="XX" float-label="Lote"
                       @keydown="fieldLenValidatorPackageField" :max-length="2"/>
            </td>
            <td class="text-left">
              <q-input ref="floorField" v-model="floorField" type="number" placeholder="X" float-label="Andar"
                       @keydown="fieldLenValidatorFloorField" :max-length="1"/>
            </td>
          </tr>

          </tbody>
        </table>

        <table class="q-table cell-separator table-responsive my-table">
          <thead>
          <tr>
            <th class="text-left" ref="sku">SKU</th>
            <th class="text-left" ref="ean">EAN</th>
            <th class="text-left" ref="desc">Descrição</th>
            <th class="text-left" ref="qtde">Quantidade Total</th>
            <th class="text-left" ref="alocados">Total Alocado</th>
            <th class="text-left" ref="pendente">Quantidade a Alocar</th>
            <th class="text-left" ref="status">Status</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="item in itemList">
            <tr>
              <td class="text-left" data-th="SKU">{{ item.sku }}</td>
              <td class="text-left" data-th="ean">{{ item.gtin }}</td>
              <td class="text-left" data-th="Descrição">{{ item.descricao }} </td>
              <td class="text-left" data-th="qtde">{{ item.quantidade }} </td>
              <td class="text-left" data-th="alocados">{{ item.alocado }} </td>

              <td class="text-left" data-th="pendente">
                <template v-if="itemsPendingFound(item)">
                  <q-input v-model="item.pendente" type="number" />
                </template>
                <template v-else>
                  <q-input v-model="item.pendente" type="number" disable/>
                </template>
              </td>
              <td class="text-left" data-th="status">{{ item.status }} </td>

            </tr>
          </template>
          </tbody>
        </table>

        <br>
        <br>


      </template>
    </q-list>
  </div>


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

  .my-button {
    width: 100%;
  }
</style>
