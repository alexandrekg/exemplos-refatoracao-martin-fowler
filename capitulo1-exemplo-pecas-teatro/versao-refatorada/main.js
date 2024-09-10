const plays = require('./plays.json');
const invoices = require('./invoices.json');


function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays))
}

function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
}

function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID]
}

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`
    for (let performance of data.performances) {        
        result += ` ${performance.play.name}: ${usd(amountFor(performance))} (${performance.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(totalAmount())}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;
    return result;
}

function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0)
}

function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber / 100);
}

function volumeCreditsFor(arrayPerformance) {
    let result = 0;
    result += Math.max(arrayPerformance.audience - 30, 0);
    if ("comedy" === arrayPerformance.type) result += Math.floor(arrayPerformance.audience / 5);
    return result;
}

function playFor(arrayPerformance) {
    return plays[arrayPerformance.playID];
}

function amountFor(arrayPerformance) {
    let result = 0;

    switch (playFor(arrayPerformance).type) {
        case "tragedy":
            result = 40000;
            if (arrayPerformance.audience > 30) {
                // exemplo: arrayPerformance.audience for 50, 1000 * 20 (arrayPerformance.audience - 30), ou seja, vou somar no result 40000 + 20000
                result += 1000 * (arrayPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (arrayPerformance.audience > 20) {
                // exemplo: arrayPerformance.audience for 50, 10000 + (500 * 30) (arrayPerformance.audience - 20), ou seja, vou somar no result 30000 + 10000 + 15000
                result += 10000 + 500 * (arrayPerformance.audience - 20);
            }
            result += 300 * arrayPerformance.audience;
            break;
        default:
            throw new Error(`unknown type: ${playFor(arrayPerformance).type}`);
    }

    return result;
}

console.log(statement(invoices, plays));