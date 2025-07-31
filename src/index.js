import { SpineDemo } from './SpineDemo.js';
import './style.css';

// Start the demo when the page loads
window.addEventListener('load', () => {
    new SpineDemo().init().catch(error => {
        console.error('Failed to start demo:', error);
    });
});
