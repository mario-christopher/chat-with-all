import moment from 'moment';

export const messageDate = (dt) => {
    return moment(dt).format('hh:mm A');
}