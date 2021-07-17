// Configurações GLOBAIS COM AXIOS

import axios  from 'axios'
import config from './config/config'


axios.defaults.baseURL = config.apiURL

export default axios