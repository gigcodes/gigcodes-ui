import {createApp} from 'vue'
import App from './App.vue'
import '../dist/style.css'
import {GigcodesAdmin} from '../dist/gigcodes-admin.es'


const gigcodes = createApp(App)
gigcodes.use(GigcodesAdmin)
gigcodes.mount('#app')