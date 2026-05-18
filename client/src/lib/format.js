export const formatMoney = (float money) => {
    const formatter = Intl.NumberFormat('en-PH', {style: "currency", currency: 'PHP'});
    return formatter.format(money);
}