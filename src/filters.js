import Vue from 'vue';
import store from './store';

Vue.filter('paid', paid);
Vue.filter('sum', sum);
Vue.filter('localeDate', localeDate);
Vue.filter('status', status);

function status(value) {
    if (!value) return '';
    const status = store.state.statuses.find((item) => {
        return item.value === value;
    });
    return status.text;
}

function localeDate(ISOdate) {
    const date = new Date(ISOdate);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return date.toLocaleDateString('ru', options);
}

function sum(order) {
    return order.qty * order.price;
}

function paid(order) {
    let totalPaid = 0;
    if (order.payments) {
        totalPaid = order.payments.reduce((total, payment) => {
        return total + payment.sum;
        }, 0);
    }
    return totalPaid;
}