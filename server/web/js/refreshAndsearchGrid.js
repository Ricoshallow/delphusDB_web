/** Improve performance with throttling and debounce function*/
function throttle(event, interval) {
    let timer = null
    return function () {
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            event.call()
            timer = null
        }, interval)
    }
}

function debounce(event, interval) {
    let timer = null
    return function () {
        clearTimeout(timer)
        timer = setTimeout(() => {
            event.call()
        }, interval)
    }
}


//refresh event: use throttle
function refreshEvent() {
    bindGrid()
    $('#btn_refresh').after(`<div class="alert alert-success fade in" id="grant_alert">
    <button type="button" class="close" data-dismiss="alert">&times;</button>
    <strong> The grid has been refreshed !</strong> 
</div>`)

}
$('#btn_refresh').bind('click', throttle(refreshEvent, 500))


// searchbox event: use debounce
function searchboxHandler() {
    $("table tbody tr").hide().filter(":contains('" + ($('#searchbox').val()) + "')").show()
}
$('#searchbox').keyup(debounce(searchboxHandler, 800))