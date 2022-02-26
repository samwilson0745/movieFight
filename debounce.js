//this for the delay of the function so as to limit the no of requests send by the api
const debounce = (func,delay=1000)=>{
    let timer;
    return (...args)=>{
        if(timer){
            clearTimeout(timer)
        }
        timer=setTimeout(()=>{
            func.apply(null,args)
        },delay)
    }
}