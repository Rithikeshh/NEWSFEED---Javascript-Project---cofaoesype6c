let count= 0;
let timer = null;
let navigate = document.querySelector('#container-right-header h4');
let humburgerBtn = document.querySelector('#humburger');
let articleList = document.querySelector('#article-list');
let newNewsBtn = document.querySelector('#new-news');
let savedNewsBtn = document.querySelector('#saved-news');
let categoryList = document.querySelector('#category-list');
let businessBtn = document.querySelector('#category-business');
let sportsBtn = document.querySelector('#category-sports');
let scienceBtn = document.querySelector('#category-science');
let hatkeBtn = document.querySelector('#category-hatke');
let worldBtn = document.querySelector('#category-world');
let politicsBtn = document.querySelector('#category-politics');
let rights = document.querySelector('#rights')
let searchInput = document.querySelector('#search-bar--input');
let searchBtn = document.querySelector('#search-bar--button')
let savedNewsArray = [];
let resultFromApi = [];
let toggleBtnSection = document.querySelector('#dark-mode-section')
let toggleBtn = document.querySelector('#toggle-dark');

toggleBtnSection.addEventListener('click',()=>{
    
    if(toggleBtn.classList.contains('fa-moon')){
        toggleBtn.style.color = "white"
        document.querySelector('#mode-text').innerHTML = "Light"
        document.querySelector('#mode-text').style.color = "white"
    }
    else{
        toggleBtn.style.color = "black" 
        document.querySelector('#mode-text').innerHTML = "Dark" 
        document.querySelector('#mode-text').style.color = "black"  
    }
    toggleBtn.classList.toggle('fa-sun')
    toggleBtn.classList.toggle('fa-moon')
    toggleDarkMode()
})
function toggleDarkMode(){
    if(toggleBtn.classList.contains('fa-sun')){
        document.querySelector('#humburger span').classList.add('dark-mode-color') //
        document.querySelector('body').classList.add('dark-mode-background');
        document.querySelector('#container-left').classList.add('dark-mode-background');
        document.querySelector('#container-right-header').classList.add('dark-mode-background');
        document.querySelector('.heading').classList.add('dark-mode-color');
        document.querySelectorAll('.button').forEach((element)=>{
            element.classList.add('dark-mode-color');
        })
        document.querySelectorAll('.atricle-item').forEach((element)=>{
            element.classList.add('dark-mode-background');
            element.classList.add('dark-mode-color');
        })
        document.querySelectorAll('#category-list').forEach((element)=>{
            element.classList.add('dark-mode-color')
        })
        articleList.classList.add('dark-mode-color')

    }
    else{
        document.querySelector('#humburger span').classList.remove('dark-mode-color') //
        document.querySelector('body').classList.remove('dark-mode-background');
        document.querySelector('#container-left').classList.remove('dark-mode-background');
        document.querySelector('#container-right-header').classList.remove('dark-mode-background');
        document.querySelector('.heading').classList.remove('dark-mode-color');
        document.querySelectorAll('.button').forEach((element)=>{
            element.classList.remove('dark-mode-color');
        })
        document.querySelectorAll('.atricle-item').forEach((element)=>{
            element.classList.remove('dark-mode-background');
            element.classList.remove('dark-mode-color');
        })
        document.querySelectorAll('#category-list').forEach((element)=>{
            element.classList.remove('dark-mode-color')
        })
        articleList.classList.remove('dark-mode-color')
    }

}
searchBtn.addEventListener('click',()=>{
    let inputValue = searchInput.value;
    if(inputValue.trim() == ""){
        popup('Please give some input')
    }
    else{

        getData(undefined,null,inputValue)
    }
})

async function getData(category, customNews = null, searchByValue=null){
    
    articleList.innerHTML = "";
    
    let newsArray;
    if(!customNews && count == 0){
        const response = await fetch('https://content.newtonschool.co/v1/pr/64806cf8b7d605c99eecde47/news')
        const resutl = await response.json();
        resultFromApi = resutl;
        newsArray = resultFromApi;
        count++;
    }
    else  if(!customNews){
        newsArray = resultFromApi;
    }
    else{
        newsArray = customNews;
    }

    if(searchByValue){
        newsArray = resultFromApi.filter((news)=>{
            let regex = new RegExp(searchByValue, "i")
            return regex.test(news.content);
        })
        if(newsArray.length == 0){
            articleList.innerText= "No such content Found. Click on New News to get All News."
        }
        removeRights();
    }
    else{
        searchInput.value = "";
    }
    newsArray.forEach((element) => {
        if(category === undefined || element[" category"] === category){
            let div = document.createElement('div');
            div.classList.add('atricle-item');
            div.setAttribute('id', element.content);
            // header
            let header = document.createElement('header');
            header.classList.add('article-details');

            let firstSection = document.createElement('section')
            firstSection.classList.add("atricle-detail-author")
            firstSection.innerText = 'By ';
            let firstSpan = document.createElement('span');
            firstSpan.innerText = element[' author'];
            firstSection.appendChild(firstSpan);

            let secondSection = document.createElement('section');
            secondSection.classList.add("atricle-detail-category");
            secondSection.innerText = "Category ";
            let secondSpan = document.createElement('span');
            secondSpan.innerText = element[" category"];
            secondSection.appendChild(secondSpan)

            header.appendChild(firstSection);
            header.appendChild(secondSection);

            // section with class article-content
            let thirdSection = document.createElement('section');
            thirdSection.classList.add("article-content");

            let p1=document.createElement('p');
            p1.innerText = element.content+" ";

            let a1 = document.createElement('a');
            a1.href = element.url;
            a1.setAttribute('target','_blank');

            let thirdSpan = document.createElement('span');
            thirdSpan.innerHTML="Read More";

            a1.appendChild(thirdSpan)
            p1.appendChild(a1);
            thirdSection.appendChild(p1);

            // last section with class like
            let fourthSection = document.createElement('section');
            fourthSection.classList.add('like');
            
            let heart = document.createElement('i');
            heart.classList.add('fa-heart');
            heart.classList.add('fa-regular');
            heart.classList.add('save-news-icon');


            if(savedNewsArray.find((currentNews)=>{
                return currentNews.content == element.content
            })){
                heart.classList.toggle('fa-regular')
                heart.classList.toggle('fa-solid')
            }

            heart.addEventListener('click',(e)=>{
                addToSaveNews(e,element)
                heart.classList.add('like-effect')
                setTimeout(()=>{
                    heart.classList.remove('like-effect')
                },300)
            })

            fourthSection.appendChild(heart)

            //appending all the elements to parent div
            div.appendChild(header)
            div.appendChild(thirdSection)
            div.appendChild(fourthSection);

            articleList.appendChild(div)
            toggleDarkMode()
        }
    });
    
}

function displaySavedNews(){

    savedNewsBtn.addEventListener('click',()=>{
        removeRights();
        let arr = Array.from(categoryList.children)
        arr.forEach((element)=>{
            if(element.classList.contains('active-item')){
                element.classList.remove('active-item');
            }
        });
        if(!savedNewsBtn.classList.contains('border-bottom')){
            savedNewsBtn.classList.toggle("border-bottom");
            newNewsBtn.classList.toggle('border-bottom');
        };
        if(savedNewsArray.length === 0){
            articleList.innerText = "No news added to Saved News. Click on heart to save the news.";
            searchInput.value = "";
            return;
        }
        getData(undefined,savedNewsArray);
        
    })
}

function popup(text){
    if(navigate.classList.contains('added-to-saved-news')){
        navigate.classList.remove('added-to-saved-news')
    }
    else{
        navigate.classList.add('added-to-saved-news')
    }
    clearTimeout(timer);
    navigate.style.display = 'flex';
    navigate.innerText = text;
    timer = setTimeout(()=>{
        navigate.classList.remove('added-to-saved-news')
        navigate.style.display = 'none'
    },3000)
}
function addToSaveNews(e,news){
    e.target.classList.toggle('fa-regular')
    e.target.classList.toggle('fa-solid')
    if(e.target.classList.contains('fa-solid')){
        savedNewsArray.push(news);
        popup(`Added to saved news`)
    }
    else{
        savedNewsArray = savedNewsArray.filter((currentNews)=>{
            return currentNews.content !== news.content;
        })
    }
    localStorage.setItem("savedNews", JSON.stringify(savedNewsArray));
}
function addAndRemoveClass(listItem){
    let arr = Array.from(categoryList.children)
    arr.forEach((element)=>{
        if(element === listItem){
            element.classList.add("active-item");
        }
        else if(element.classList.contains('active-item')){
            element.classList.remove('active-item');
        }
    })
    if(savedNewsBtn.classList.contains('border-bottom')){
        savedNewsBtn.classList.toggle("border-bottom");
        newNewsBtn.classList.toggle('border-bottom');
    }
}
function removeRights(){
    if(rights.classList.contains('show')){
        rights.classList.remove('show'); 
    }
    if(!rights.classList.contains('hidden')){
        rights.classList.add('hidden'); 
    }
}
function displayNewsByCategory(){
    let category = "";
    newNewsBtn.addEventListener('click',(event)=>{
        if(!newNewsBtn.classList.contains('border-bottom')){
            savedNewsBtn.classList.toggle("border-bottom");
            newNewsBtn.classList.toggle('border-bottom');
        }
        addAndRemoveClass(event.target)
        getData()
        if(rights.classList.contains('hidden')){
            rights.classList.remove('hidden'); 
        }
        if(!rights.classList.contains('show')){
            rights.classList.add('show'); 
        }
            
    })
    businessBtn.addEventListener('click',(event)=>{
        category = "business";
        addAndRemoveClass(event.target)  
        getData(category);
        removeRights()
    })
    sportsBtn.addEventListener('click',(event)=>{
        category = "sports";
        addAndRemoveClass(event.target)
        getData(category);
        removeRights()
    })
    scienceBtn.addEventListener('click',(event)=>{
        category = "science";
        addAndRemoveClass(event.target)
        getData(category);
        removeRights()
    })
    hatkeBtn.addEventListener('click',(event)=>{
        category = "hatke";
        addAndRemoveClass(event.target)
        getData(category);
        removeRights()
    })
    worldBtn.addEventListener('click',(event)=>{
        category = "world";
        addAndRemoveClass(event.target)
        getData(category);
        removeRights()
    })
    politicsBtn.addEventListener('click',(event)=>{
        category = "politics";
        addAndRemoveClass(event.target)
        getData(category);
        removeRights()
    })
}
function humburgerFunctionality(){

    let x = document.querySelector('#container-left');
    humburgerBtn.addEventListener('click',()=>{
        if(window.getComputedStyle(x).visibility == "hidden"){
            x.style.visibility ="visible";
        }
        else{
            x.style.visibility='hidden'
        }
    })
    document.querySelector('#container-right').addEventListener('click',()=>{
        if(x.style.visibility =="visible" && window.innerWidth < 445 ){
            x.style.visibility ='hidden';
        }
    })
    window.addEventListener('resize',()=>{
        if (window.innerWidth > 445){
            x.style.visibility ="visible";
        }
        else{
            x.style.visibility ='hidden';
        }
    })
}
function tour(){
    navigate.addEventListener('click',(event)=>{
        if(event.target.classList.contains('hide')){
            navigate.style.display = 'none';
        }
    })
}
async function init(){
    if(!localStorage.getItem('savedNews')){
        tour();
    }
    else{
        navigate.style.display = 'none';
    }
    // localStorage.clear('sacedNews')
    savedNewsArray = localStorage.getItem("savedNews")
    ? JSON.parse(localStorage.getItem("savedNews"))
    : [];
    await getData();
    displaySavedNews();
    displayNewsByCategory();
    humburgerFunctionality();
}
init()
