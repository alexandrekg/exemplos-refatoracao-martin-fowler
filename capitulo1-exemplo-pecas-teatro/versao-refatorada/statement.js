import createStatementData from './createStatementData.js';


function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber / 100);
}

export default function statement(invoice, plays) {
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

function htmlStatement(invoice, plays) {
    return renderHTML
}

function renderHtml() {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += "<table>\n";
    result += "<tr><th>play</th><th>seats</th><th>cost</h1>\n";
    for (let performance of data.performances) {
        result += ` <tr><td>${performance.play.name}</td><td>${performance.audience}</td>`;
        result += `<td>${usd(performance.amount)}</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
    return result;
}
