import moment from 'moment';

export const messageDate = (dt) => {
    return moment(dt).format('hh:mm A');
}

export const trim = (str, len) => {
    if (str && str.length > len)
        return str.substring(0, len) + '...';
    else
        return str;
}