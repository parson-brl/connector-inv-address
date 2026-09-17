
<script>
import {
  //  dom,
  //  event,
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
  QModal,
  QModalLayout,
  QSelect,
  Toast
} from 'quasar'
import AlocateForm from './form.vue'
import AlocateList from './list.vue'

export default {
  name: 'index',
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
    QModal,
    QModalLayout,
    QSelect,
    AlocateForm,
    AlocateList,
    Toast
  },
  data () {
    return {
      // selectedServerToDisplay: '192.168.0.63',
      // selectedServerToDisplay: '192.168.30.6',
      selectedServerToDisplay: '192.168.0.63',
      username: '',
      password: '',
      authenticated: false,
      isLoginFormOpen: true,
      loginLinkText: 'Login',
      serverList: [{
        label: 'São Bento - 192.168.0.63',
        value: '192.168.0.63'
      },
      {
        label: 'São Mateus - 192.168.30.6',
        value: '192.168.30.6'
      },
      {
        label: 'Serra - 192.168.0.76',
        value: '192.168.0.76'
      }]
    }
  },
  computed: {
    serverRef: {
      get () {
        return this.$store.state.serverAddress
      },
      set (value) {
        this.$store.commit('SET_SERVER_ADDRESS', value)
      }
    }
  },
  methods: {
    logout () {
      this.authenticated = false
      this.username = ''
      this.password = ''
      this.isLoginFormOpen = true
      this.loginLinkText = 'Login'
      this.$refs.userLogin.focus()
    },
    openLoginModal () {
      if (!this.authenticated || this.authenticated !== true) {
        this.isLoginFormOpen = true
      }
    },
    cleanUp () {
      this.$store.commit('CLEAR_ITEMS')
      this.$store.commit('CLEAR_SUMMARY')
      this.$store.commit('CLEAR_BATCH_TO_ADDRESS')
    },
    doLogin () {
      var self = this
      // var host = window.location.hostname
      self.$http.get('http://' + this.serverRef + ':1880/connector/v1/login/' + this.username + '/' + this.password, {
        headers: {
          'Accept': '*',
          'Access-Control-Allow-Origin': '*'
        }})
        .then(function (response) {
          console.log('Login:' + response.data.toString())
          if (response.data.length === 0 || response.data[0].match === 0) {
            Toast.create.warning({
              html: 'Usuário ou senha inválidos.'
            })
          }
          else if (response.data[0].match === 1) {
            self.password = ''
            self.authenticated = true
            self.isLoginFormOpen = false
            self.loginLinkText = 'Sair'
            // self.$refs.loginModal.close() // Maybe this.$refs.maximizedModal.close()
          }
          else {
            Toast.create.warning({
              html: 'Erro ao tentar executar login'
            })
          }
        })
        .catch(function (error) {
          console.log(error)
          Toast.create.negative({
            html: 'Erro ao tentar executar login.'
          })
        })
    },
    reset () {
      this.username = ''
      this.password = ''
      this.authenticated = false
    }
  },
  mounted () {
    this.$store.commit('SET_SERVER_ADDRESS', this.selectedServerToDisplay)
    this.$refs.loginModal.open()
    this.$refs.userLogin.focus()
  }
}
</script>

<template>
  <q-layout
    ref="layout"
            view="lHh Lpr fff"
            :left-class="{'bg-grey-2': true}"
            >
    <q-toolbar slot="header" class="glossy">
      <q-btn
        flat
        @click="$refs.layout.toggleLeft()"
      >
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        Parson Connector - Alocação Inventário
        <div slot="subtitle">v1.0.15</div>
      </q-toolbar-title>
    </q-toolbar>

    <div slot="left">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->

      <q-list no-border link inset-delimiter>
        <q-list-header>Menu</q-list-header>
        <template v-if="authenticated">
        <q-item @click="cleanUp">
          <q-item-side icon="clear_all" />
          <q-item-main label="Limpar" />
        </q-item>
        </template>
        <q-item @click="logout">
          <q-item-side icon="exit_to_app" />
          <q-item-main :label="loginLinkText" />
        </q-item>
      </q-list>
    </div>
    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <div v-if="authenticated">
    <alocate-form class="glossy"> </alocate-form>
    <alocate-list > </alocate-list>
    </div>

    <q-modal v-model="isLoginFormOpen" ref="loginModal" :content-css="{padding: '50px', minWidth: '50vw'}" @escape-key="openLoginModal" @close="openLoginModal">
      <h4>Connector - Login</h4>
      <form @submit.prevent="doLogin">
        <q-select
          v-model="serverRef"
          float-label="Servidor"
          radio
          :options="serverList"
        />
        <q-input ref="userLogin" v-model="username"  type="number"  float-label="Usuário"/>
        <q-input v-model="password"  type="password"  float-label="Senha"/>
        <q-btn icon="security" color="primary">[Login]</q-btn>
      </form>
    </q-modal>
  </q-layout>
</template>

