//the whole autocomplete process and after optionselect
const data={
    async searchMovie(name){
        const res = await axios.get('http://www.omdbapi.com/',{
            params :{
                apikey: 'cfe875a1',
                s: name
            }
        })
        return res.data.Search
    },
    createOptions(movie){
        const imgSrc = movie.Poster === 'N/A'?'':movie.Poster;
        return`<img class="img"src="${imgSrc}"/> ${movie.Title}(${movie.Year})`
    },
    onOptionSelect(movie){
        fetchMovieByID(movie)
    }
}
//to remove if div contains greater element(this is for the 2nd row div box)
const div=document.querySelector('#div3')
div.classList.remove('greater')
div.classList.add('notify')
//LHS autocomplete
autoCmplete({root1:document.querySelector('#input1'),...data,onOptionSelect(movie){
    fetchMovieByID(movie,document.querySelector('#result1'),'left')
}})
//RHS autocomplete
autoCmplete({root1:document.querySelector('#input2'),...data,onOptionSelect(movie){
    fetchMovieByID(movie,document.querySelector('#result2'),'right')
}})


let leftContent;
let rightContent;
const fetchMovieByID=async (ID,root,side)=>{
    const res = await axios.get('http://www.omdbapi.com/',{
        params :{
            apikey: 'cfe875a1',
            i: ID
        }
    })
    root.innerHTML=showResult({
        title     : res.data.Title,
        plot      : res.data.Plot,
        year      : res.data.Year,
        poster    : res.data.Poster,
        genre     : res.data.Genre,
        awards    : res.data.Awards,
        boxOffice : res.data.BoxOffice,
        metascore : res.data.Metascore,
        imdbRating: res.data.imdbRating,
        imdbVotes : res.data.imdbVotes
    })
    if(side=="left"){
        leftContent=res.data;
    }
    else{
        rightContent=res.data;
    }
    if(leftContent && rightContent){
        runCmpre()
        //this is done to edit the 2nd row div content
        const h4=document.querySelector('#h4')
        const div=document.querySelector('#div3')
        const h5=document.querySelector('h5')
        h4.innerHTML="Green is the best!!"
        div.classList.remove('notify')
        div.classList.add('greater')
        h5.remove()
    }
}
//comparison function which adds the detailing 
const runCmpre=()=>{
    const leftMovie = document.querySelectorAll('#result1 .one')
    const rightMovie = document.querySelectorAll('#result2 .one')

    leftMovie.forEach((left,index)=>{
        const right= rightMovie[index]
        let leftStat,rightStat
        //for imdbRating because we dont want it to be parsedInt
        if(index==3){
             leftStat  = parseFloat(left.dataset.value)
             rightStat = parseFloat(right.dataset.value)
        }
        else{
             leftStat  = parseInt(left.dataset.value)
             rightStat = parseInt(right.dataset.value)
        }
        //selecting the classlist of the specified div element
        const leftlist=left.classList
        const rightlist=right.classList
        
        //checking if greater class and shadow-lg class previously exists or not
        if(leftlist[1]=="greater" && leftlist[2]=="shadow-lg"){
            leftlist.remove('shadow-lg')
            leftlist.remove('greater')
            leftlist.add('content')
            leftlist.add('shadow')
        }  
        if(rightlist[1]=="greater" && rightlist[2]=="shadow-lg"){
            rightlist.remove('shadow-lg')
            rightlist.remove('greater')
            rightlist.add('content')
            rightlist.add('shadow')
        }

        //comparing the individual div elements
        if(leftStat>rightStat){
            leftlist.remove('shadow')
            leftlist.remove('content')
            leftlist.add('greater')
            leftlist.add('shadow-lg')
        }
        else if(leftStat==rightStat){
            leftlist.remove('shadow')
            leftlist.remove('content')
            rightlist.remove('shadow')
            rightlist.remove('content')
            leftlist.add('greater')
            leftlist.add('shadow-lg')
            rightlist.add('greater')  
            rightlist.add('shadow-lg')
        }
        else{
            rightlist.remove('shadow')
            rightlist.remove('content')
            rightlist.add('greater')  
            rightlist.add('shadow-lg')
        }
    })
}
const showResult = (movie)=>{
    /*here basically the split reduce part is done so that if it catches a N/A value it will automatically convert it to 0 but for imdbRating it doesn't work like that*/ 
    /*if we did parsedInt for the values then for string cases it would stop and give us a NaN */
    /*here split and reduce are done to remove characters and only accept numbers so that we can parse it in runCmpre() function */
    const MetaScore  = movie.metascore.split(' ').reduce((prev,word) =>{
        const value=parseInt(word);
        if(isNaN(value)){
            return prev;
        }else {
            return prev + value;
        }
     },0);
    const IMdbRating = parseFloat(movie.imdbRating);
    const IMdbVotes  = movie.imdbVotes.replace(/,/g, '').split(' ').reduce((prev,word) =>{
        const value=parseInt(word);
        if(isNaN(value)){
            return prev;
        }else {
            return prev + value;
        }
     },0)
    const BoxOffice  = movie.boxOffice.replace('$','').replace(/,/g, '').split(' ').reduce((prev,word) =>{
        const value=parseInt(word);
        if(isNaN(value)){
            return prev;
        }else {
            return prev + value;
        }
     },0)
    const Awards     = movie.awards.split(' ').reduce((prev,word) =>{
       const value=parseInt(word);
       if(isNaN(value)){
           return prev;
       }else {
           return prev + value;
       }
    },0);
    //separatly checking the value of imdbRating
    if(isNaN(IMdbRating)){
        IMdbRating=0;
    }
    //returning the whole html content
    return `<div class="media">
        <img class="image" src="${movie.poster}" alt="Generic placeholder image"/>
    <div class="initials">
        <h2>${movie.title}</h1>
        <h4>${movie.genre}</h4>
        <p>${movie.plot}</p>
    </div>
    <div data-value=${Awards} class="content shadow one">
        <h2 class="textsize">${movie.awards}</h2>
        <h4 class="textsize1 fw-normal">Awards</h4>
    </div><br>
    <div data-value=${BoxOffice} class="content shadow one">
        <h2 class="textsize">${movie.boxOffice}</h2>
        <h4 class="textsize1 fw-normal">BoxOffice</h4>
    </div><br>
    <div data-value=${MetaScore} class="content shadow one">
        <h2 class="textsize">${movie.metascore}</h2>
        <h4 class="textsize1 fw-normal">Metascore</h4>
    </div><br>
    <div data-value=${IMdbRating} class="content shadow one">
        <h2 class="textsize">${movie.imdbRating}</h2>
        <h4 class="textsize1 fw-normal">IMDB Rating</h4>
    </div><br>
    <div data-value=${IMdbVotes} class="content shadow one">
        <h2 class="textsize">${movie.imdbVotes}</h2>
        <h4 class="textsize1 fw-normal">Votes</h4>
    </div><br>
    </div>`
}