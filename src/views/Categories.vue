<template>
  <div class="container">
    <h1>Categorías</h1>
    <p class="error" v-if="error">{{ error }}</p>
    <p class="success" v-if="success">{{ success }}</p>

    <div class="card">
      <input v-model="form.name" placeholder="Nombre categoría" />
      <input v-model="form.description" placeholder="Descripción" />
      <button @click="save">Guardar</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in categories" :key="c.id">
          <td>{{ c.id }}</td>
          <td>{{ c.name }}</td>
          <td>{{ c.status }}</td>
          <td>
            <button @click="edit(c)">Editar</button>
            <button @click="remove(c.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      categories: [],
      form: { id: null, name: '', description: '', status: 1 },
      error: '',
      success: ''
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      api.get('/categories').then(res => {
        this.categories = res.data.categories
      }).catch(err => this.error = err.userMessage)
    },
    edit(c) {
      this.form = c
    },
    save() {
      if (!this.form.name) {
        this.error = 'Nombre obligatorio'
        return
      }
      const url = '/categories' + (this.form.id ? '/' + this.form.id : '')
      const method = this.form.id ? 'put' : 'post'
      api({ method, url, data: this.form })
        .then(() => {
          this.success = 'Guardado'
          this.form = { id: null, name: '', description: '', status: 1 }
          this.load()
        }).catch(err => {
          this.error = err.userMessage
        })
    },
    remove(id) {
      api.delete('/categories/' + id).then(() => this.load()).catch(err => {
        this.error = err.userMessage
      })
    }
  }
}
</script>
