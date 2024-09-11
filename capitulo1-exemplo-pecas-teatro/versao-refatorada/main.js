import statement from './statement.js';

const plays = require('./plays.json');
const invoices = require('./invoices.json');


console.log(statement(invoices, plays));