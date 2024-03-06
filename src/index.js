const { BubbleApplication } = require('./app/app');
const controllers = require('./controllers');

const env = require('./config/env')
const authApplication = new BubbleApplication({ env, controllers })

authApplication.runApp()