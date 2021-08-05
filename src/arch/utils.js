function convertToLocalDateTime(dateTimeString) {
    return (dateTimeString == null || dateTimeString.trim() == '') ? '' : (new Date(new Date(dateTimeString) - ((new Date()).getTimezoneOffset() * 120000))).toISOString().slice(0, -5).replace('T', ' ');
}

export default {
    convertToLocalDateTime: convertToLocalDateTime
}