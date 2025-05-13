import loginPageHtml from './pages/login/login.html?raw';
import "./style.css";
import swifttaskLogo from "/swifttask-icon.png";
import { setupRoutes } from "./router";
import Alpine from 'alpinejs'

setupRoutes();
Alpine.start()
