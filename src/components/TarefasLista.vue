<template>
  <div>
    <div class="row">
      <div class="col-sm-10">
        <h1 class="font-weight-light">Lista de Tarefas</h1>
      </div>
      <div class="col-sm-2">
        <button
          class="btn btn-primary float-right"
          @click="exibirFormularioCriarTarefa"
        >
          <i class="fa fa-plus mr-2"></i>
          <span>Criar</span>
        </button>
      </div>
    </div>

    <ul class="list-group" v-if="tarefasOrdenadas.length > 0">
      <TarefasListaIten
        v-for="tarefa in tarefasOrdenadas"
        :key="tarefa.id"
        :tarefa="tarefa"
        @editar="selecionarTarefaParaEdicao"
        @deletar="deletarTarefa"
        @concluir="editarTarefa"
      />
    </ul>

    <p v-else-if="!mensagemErro">Nenhuma tarefa criada.</p>

    <div class="alert alert-danger" v-else>{{ mensagemErro }}</div>

    <TarefaSalvar
      v-if="exibirFormulario"
      :tarefa="tarefaSelecionada"
      @criar="criarTarefa"
      @editar="editarTarefa"
    />
  </div>
</template>

<script>
import axios from "./../axios";

import TarefaSalvar from "./TarefaSalvar.vue";
import TarefasListaIten from "./TarefasListaIten.vue";

export default {
  components: {
    TarefaSalvar,
    TarefasListaIten,
  },
  data() {
    return {
      tarefas: [],
      exibirFormulario: false,
      tarefaSelecionada: undefined,
      mensagemErro: undefined
    };
  },

  computed: {
    tarefasOrdenadas() { // eslint-disable-line
      return this.tarefas.sort((t1, t2) => {// eslint-disable-line
        if (t1.concluido === t2.concluido) {// eslint-disable-line
          return t1.titulo < t2.titulo ? -1 : t1.titulo > t2.titulo ? 1 : 0;// eslint-disable-line
        }// eslint-disable-line
        return t1.concluido - t2.concluido;// eslint-disable-line
      })
    }
  },
  created() {
    axios.get(`/tarefas`).then((response) => {
      console.log("Get /tarefas", response);
      this.tarefas = response.data;
    }, error => {
      console.log('Erro capturado no then: ', error)
      return Promise.reject(error)
    }).catch(error => {
      console.log('Erro capturado no catch', error)
      if(error.response){
        this.mensagemErro = `Servidor retornou um erro: ${error.mensage} ${error.response.statusText}`
        console.log('Erro [resposta]:', error.response)
      }else if (error.request){
        this.mensagemErro = `Erro ao tentar comunicar com o servidor: ${error.message}`
        console.log('Erro [requisição]: ', error.request)
      }else {
        this.mensagemErro = `Erro ao fazer requisição ao servidor: ${error.message}`
      }
    })
  },
  methods: {
    criarTarefa(tarefa) {
      axios.post(`/tarefas`, tarefa).then((response) => {
        console.log("Post /tarefas", response);
        this.tarefas.push(response.data);
        this.resetar();
      });
    },
    editarTarefa(tarefa) {
      console.log("Editar: ", tarefa);
      axios
        .put(`/tarefas/${tarefa.id}`, tarefa)
        .then((response) => {
          console.log(`PUT /tarefas/${tarefa.id}`, response);
          const indice = this.tarefas.findIndex((t) => t.id === tarefa.id);
          this.tarefas.splice(indice, 1, tarefa);
          this.resetar();
        });
    },
    deletarTarefa(tarefa) {
      const confirmar = window.confirm(
        `Deseja deletar a tarefa "${tarefa.titulo}"?`
      );
      if (confirmar) {
        axios
          .delete(`/tarefas/${tarefa.id}`)
          .then((response) => {
            console.log(`DELETE /tarefas/${tarefa.id}`, response);
            const indice = this.tarefas.findIndex((t) => t.id === tarefa.id);
            this.tarefas.splice(indice, 1);
          });
      }
    },
    exibirFormularioCriarTarefa(event) {
      if (this.tarefaSelecionada) {
        this.tarefaSelecionada = undefined;
        return;
      }
      this.exibirFormulario = !this.exibirFormulario;
    },
    resetar() {
      this.tarefaSelecionada = undefined;
      this.exibirFormulario = false;
    },
    selecionarTarefaParaEdicao(tarefa) {
      this.tarefaSelecionada = tarefa;
      this.exibirFormulario = true;
    },
  },
};
</script>
