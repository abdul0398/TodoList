function day(){
    var options = {
        weekday: 'long',
        day: 'numeric',
        month:'short'
    }
    var today = new Date();
    var currentDay = today.toLocaleDateString('en-US',options);
    return currentDay;
}
export {day};