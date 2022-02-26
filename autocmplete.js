const autoCmplete = ({root1,searchMovie,createOptions,onOptionSelect})=>{
    root1.innerHTML = `<label><b>Search</b></label>
    <div class="dropdown">
    <input class="input"/>
    <ul class="dropdown-menu scrollable-menu"></ul>
    </div>`
    //doing root.query... automatically selects the tag which it is contained in
    const input= root1.querySelector('input')//here root specifies either input1/input2 class depending on the argumets passed
    const list= root1.querySelector('.dropdown-menu')
    const onInput = async event=>{
        const items = await searchMovie(event.target.value)  
        if(!items){
            input.classList.remove('show')
            list.classList.remove('show')
            return 
        }
        list.innerHTML=''
        for(let i in items){
            const a=document.createElement('a')
            a.classList.add('dropdown-item')
            a.setAttribute('href','#')
            a.innerHTML=createOptions(items[i])
            list.append(a)
            a.addEventListener('click',()=>{
                input.value=items[i].Title
                movie= onOptionSelect(items[i].imdbID)
            })
        }
        input.classList.add('show')
        list.classList.add('show')
            
    }
    input.addEventListener('input',debounce(onInput,400))  
    document.addEventListener('click',()=>{
        input.classList.remove('show')
        list.classList.remove('show')
    })
}