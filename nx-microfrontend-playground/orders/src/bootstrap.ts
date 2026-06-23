import { createApp } from 'vue';
import App from './app/app.vue';
import { pinia } from './app/stores/pinia';
import './styles.scss';

createApp(App).use(pinia).mount('#root');
