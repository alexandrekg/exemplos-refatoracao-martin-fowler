import createStatementData from './createStatementData.js';


function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data, plays) {
    let result = `Statement for ${data.customer}\n`;
    for (let performance of data.performances) {        
        result += ` ${performance.play.name}: ${usd(performance.amount)} (${performance.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;
}
