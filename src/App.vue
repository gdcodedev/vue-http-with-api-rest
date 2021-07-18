<template>
  <div id="app">
    
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-4">Requisições HTTP no Vue</h1>
        <p class="lead">Usando a biblioteca Axios para fazer chamadas Ajax à uma API REST.</p>
      </div>
    </div>

    <div class="container">

      <TarefasLista />

    </div>

  </div>
</template>

<script>

import axios from 'axios'
import config from './config/config'

import TarefasLista from './components/TarefasLista.vue'

export default {
    components: {
        TarefasLista
    },

    // Requisições simultâneas 
    created(){
    /*  axios.all([
        axios.get(`${config.apiURL}/tarefas/1`),
        axios.get(`${config.apiURL}/tarefas/3`)
      ]).then(axios.spread((tarefa1, tarefa3) => {
        console.log('Requisições simultâneas:')
        console.log('Tarefa 1: ', tarefa1)
        console.log('Tarefa 3: ', tarefa3)
      }))*/

      //Requisições simultâneas sem o operador Spread
      axios.all([
        axios.get(`${config.apiURL}/tarefas/1`),
        axios.get(`${config.apiURL}/tarefas/3`)
      ]).then(response => {
        const [tarefa1,  tarefa3] = response
        console.log('Tarefa 1: ', tarefa1)
        console.log('Tarefa 3: ', tarefa3)
      })
    }
}
</script>