const form  = document.querySelector('.search-field')
const input = document.querySelector('.search')
const template = document.querySelector('#template')
const main = document.querySelector('.result')
form.addEventListener('submit',function(e){
    e.preventDefault()
    if(input.value.trim()==''){
        form.classList.add('show')
        setTimeout(()=>{
            form.classList.remove('show')

        },1500)
        return
    }

    fetchDicitionary(input.value.trim())
    input.value =''
    
})
async function fetchDicitionary(searchTerm){
    try{
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`)
        const data = await res.json()
        console.log(data[0])
        if(res.status !== 200){

            document.querySelector('.welcome-text').innerHTML = `🙁 <p class='no-title'>${data.title}</p> ${data.message}`
        }else{
        
            renderDetails(data[0])

        }
      
    }
    catch(err){
    
    }   
}
function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}
function sound(soundName){
    const audio = new Audio(soundName)
    audio.play()
}
function renderDetails(data){

    const container = document.querySelector('.result')  
    clearElement(container)
    const templateEle= document.importNode(template.content,true) 
   
    const wordName = templateEle.querySelector('.word_name')
    wordName.innerHTML = data.word

    const pronunciation = templateEle.querySelector('.pronunciation')
    pronunciation.innerHTML = data.phonetic ? data.phonetic : '<span> No phonetic for the word</span>'

    const btn = templateEle.querySelector('.pronunciation__Btn')
    if(data.phonetics[1 || 0]?.audio){
        btn.removeAttribute("disabled")
        btn.addEventListener('click',()=>{
            sound(data.phonetics[1 || 0 ].audio)
        })
    }else{
        btn.setAttribute('disabled',false)
    }
    const synonyms = templateEle.querySelector('.synonyms')
    const synonymsList=[]

    const meanings__list = templateEle.querySelector('.meanings__list')
    const verb__list = templateEle.querySelector('.verb__list')
    const meanings = data.meanings

    const verb__meaning = templateEle.querySelector('.verb__meaning')
    const noun__meaning = templateEle.querySelector('.noun__meaning')

    if(meanings[0]?.partOfSpeech == 'noun'){
        noun__meaning.innerHTML = 'Meaning'
        meanings__list.innerHTML= createList(meanings[0].definitions)
        synonymsList.push(...meanings[0].synonyms)
    }
    else{
        noun__meaning.innerHTML = 'Sorry couldn\'t find noun'
    }
    if(meanings[1]?.partOfSpeech == 'verb' || meanings[0]?.partOfSpeech == 'verb')
    {
        verb__meaning.innerHTML = 'Meaning'
        verb__list.innerHTML= createVerb(meanings[1 || 0].definitions)  
        synonymsList.push(...meanings[1||0].synonyms)
    }
    else{
        verb__meaning.innerHTML = 'Sorry couldn\'t find verb'
    }
    synonyms.innerHTML=synonyms.length > 0 ? createParagraph(synonymsList) : '<span> No Sysnonyms</span>'

    const links__list = templateEle.querySelector('.url__links')
    links__list.innerHTML = createLinks(data.sourceUrls)
    main.appendChild(templateEle)
}

function createList(lists){
   const newList = lists.map(item=>{
    return `<li>${item.definition}</li>`
   }).join('')
   return newList
}
function createVerb(lists){
    const newList = lists.map(item=>{
        return `<li>
            <p class="verb__heading">${item.definition}</p>
            ${item.example ? `<p class="verb__examples">${item.example}</p>` : '' } 
        </li>`
       }).join('')
       return newList
}
function createParagraph(lists){
    const newList = lists.map(item=>{
        return `<span>${item}</li>`
       }).join(', ')
       return newList
}
function createLinks(lists){
    const newList = lists.map(item=>{
        return `<li><a href=${item} target="_blank">${item} <img src="images/icon-new-window.svg"></a></li>`
       }).join('')
       return newList
}

// toggle functionality
const toggleBtn= document.querySelector('#toggle');
toggleBtn.addEventListener('click',function(){
    if(document.body.classList.contains('dark')){
       document.body.classList.remove('dark')
    }
    else{
        
        document.body.classList.add('dark')
    }
})

// dropdown family
const dropdown=document.querySelector('.dropdown')
const select= dropdown.querySelector('.select')
const caret=dropdown.querySelector('.caret')
const menu = dropdown.querySelector('.font-family')
const options = dropdown.querySelectorAll('.font-family li')
const selected = dropdown.querySelector('.selected')

select.addEventListener('click',()=>{
    caret.classList.toggle('caret-rotate')
    menu.classList.toggle('open-menu')
})
options.forEach(option=>{
    option.addEventListener('click',()=>{
        selected.innerText = option.innerText
        document.body.style.fontFamily=option.dataset.family
        caret.classList.remove('caret-rotate')
        menu.classList.remove('open-menu')
        options.forEach(option=>{
            option.classList.remove('active')
        })
        option.classList.add('active')
    })
})