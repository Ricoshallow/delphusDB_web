/** Improve performance with throttling function*/
function thtottle(event, interval){
    let timer = null
    return function(){
        if(timer){return}
        timer = setTimeout(()=>{
            event.call()
            timer = null
        },interval)
    }
}

function debounce(event, interval){
    let timer = null
    reutrn function(){
        clearTimeout(timer)
        timer = setTimeout(()=>{
            event.call()
        },interval)
    }
}