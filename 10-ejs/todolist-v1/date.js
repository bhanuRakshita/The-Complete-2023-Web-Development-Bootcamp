module.exports.getDate = function() {
    let today = new Date();
    let dateOptions = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let date = today.toLocaleDateString("en-US", dateOptions);

    return date;
}

module.exports.getDay = function() {
    let today = new Date();
    let dateOptions = {
        weekday: "long",
    };

    let day = today.toLocaleDateString("en-US", dateOptions);

    return day;
}