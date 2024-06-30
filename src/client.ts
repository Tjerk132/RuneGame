import './app.css'
import App from './App.svelte'
import { mount } from 'svelte'
import "./extensions";

const app = mount(App, {
  target: document.getElementById('root')!,
})

export default app
