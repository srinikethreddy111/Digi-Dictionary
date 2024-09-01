let searchResults = document.getElementById("searchResults");
let searchInput = document.getElementById("searchInput");
let spinner = document.getElementById("spinner");
let liveSearchItems=document.getElementById("liveSearchItems");
let searchIcon=document.getElementById("searchIcon");
let liveSearch=document.getElementById("liveSearch");
let themeSwitch=document.getElementById("themeSwitch");
let darkTheme=document.getElementById("darkTheme");
let lightTheme=document.getElementById("lightTheme");
let body=document.getElementById("body");
let liveSearchItemsArray=[document.getElementById("liveSearchItem1"),document.getElementById("liveSearchItem2"),document.getElementById("liveSearchItem3"),document.getElementById("liveSearchItem4"),document.getElementById("liveSearchItem5")];
let url = "https://apis.ccbp.in/wiki-search?search=";
let oldUrl=url;
let otherKeyEvents=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Backspace","Delete","Escape"];
let links=[document.getElementById("exploreLink"),document.getElementById("quizLink")];
let quizAnswer=0;
let count=0;

liveSearchItems.classList.add("d-none");
liveSearch.style.height="50px";

const quizForm=document.getElementById("quizForm");
quizForm.addEventListener("change",(event)=>{
    sessionStorage.setItem("selectedOption",event.target.value);
} )


//Search Results functionalities   v

let createAndAppend = function(results) {
    for (let result of results){
        let {
            description,
            title,
            link
        } = result;
        
        let resultCard = document.createElement("div");
        resultCard.classList.add("result-card");
    
        let titleElement = document.createElement("h1");
        titleElement.textContent = title;
        titleElement.classList.add("result-title");
        resultCard.appendChild(titleElement);
    
        let descriptionElement = document.createElement("p");
        descriptionElement.textContent = description;
        descriptionElement.classList.add("result-description");
        resultCard.appendChild(descriptionElement);
    
        searchResults.appendChild(resultCard);

    }
};

//quiz functionalities   v

const renderQuizResults=()=>{
    let resultPage=document.getElementById("resultPage");
    let resultPageButton=document.getElementById("resultPageButton");
    let resultDisplaySpan=document.getElementById("resultDisplaySpan");
    let resultDisplayContainer=document.getElementById("resultDisplayContainer");
    links[1].classList.remove("link-onClick");
    links[1].classList.add("link-onClick-quizTime");
    document.getElementById("quizMoniteringSection").classList.add("d-none");
    document.getElementById("quizQuestionSection").classList.add("d-none");
    resultPage.classList.remove("d-none");
    let answeredCorrect=JSON.parse(sessionStorage.getItem("answeredCorrect"));
    if(answeredCorrect>=5){
        document.getElementById("resultHead").textContent = "Congratulations";
        resultDisplayContainer.style.backgroundColor = "green";
    }else{
        document.getElementById("resultHead").textContent = "Better Luck Next Time";
        resultDisplayContainer.style.backgroundColor = "red";
    }
    resultDisplaySpan.textContent=answeredCorrect;
    resultDisplayContainer.style.width=((answeredCorrect/10)*100)+"%";
    resultPageButton.addEventListener("mousedown",()=>{
        resultPage.classList.add("d-none");
        links[1].classList.remove("link-onClick-quizTime");
        links[1].classList.add("link-onClick");
        sessionStorage.removeItem("answeredCorrect");
        sessionStorage.removeItem("noOfQuestions");
        sessionStorage.removeItem("selectedOption");
        sessionStorage.removeItem("level");
        sessionStorage.setItem("isQuizStarted",JSON.stringify(false));
        sessionStorage.setItem("currentPage","levelSelection");
        navController(sessionStorage.getItem("currentPage"));
    })
};

let lessQueries=()=>{
    alert("Please search for a minimum of 10 queries");
    sessionStorage.setItem("isQuizStarted","false");
    document.getElementById("quizGreetingSection").classList.remove("d-none");
    document.getElementById("quizMoniteringSection").classList.add("d-none");
    document.getElementById("quizQuestionSection").classList.add("d-none");
}

let checkOption=()=>{
    console.log(quizAnswer);
    if(sessionStorage.getItem("answeredCorrect")===null){
        sessionStorage.setItem("answeredCorrect",JSON.stringify(0));
    }
    if(sessionStorage.getItem("selectedOption")===null){
        alert("Please select option before submitting");
        return;
    }
    else if(sessionStorage.getItem("selectedOption")==("option"+quizAnswer)){
        let answeredCorrect=JSON.parse(sessionStorage.getItem("answeredCorrect"));
        sessionStorage.setItem("answeredCorrect",JSON.stringify(answeredCorrect+1));
        let eleId=sessionStorage.getItem("selectedOption")+"-con";
        document.getElementById(eleId).classList.add("correct-answer");
    }
    else{
        let eleId=sessionStorage.getItem("selectedOption")+"-con";
        document.getElementById(eleId).classList.add("wrong-answer");
    }
    if(sessionStorage.getItem("selectedOption")!==null){
        let noOfQuestions=JSON.parse(sessionStorage.getItem("noOfQuestions"));
        sessionStorage.setItem("noOfQuestions",JSON.stringify(noOfQuestions+1));
    }
    
    setTimeout(()=>{
        const ques=JSON.parse(sessionStorage.getItem("quizQuestions"));
        let eleId=sessionStorage.getItem("selectedOption")+"-con";
        if(ques.length===1){
            sessionStorage.setItem("currentPage","resultPage");
            renderQuizResults();
            document.getElementById(eleId).classList.remove("correct-answer");
            document.getElementById(eleId).classList.remove("wrong-answer");
            sessionStorage.removeItem("quizQuestions");           
        }
        else{
            ques.shift();
            sessionStorage.setItem("quizQuestions",JSON.stringify(ques));
            renderQuiz(JSON.parse(sessionStorage.getItem("quizQuestions"))); 
        }
        document.getElementById(sessionStorage.getItem("selectedOption")).checked = false;
        sessionStorage.removeItem("selectedOption");
    },1500);

}

let renderQuiz=(ques)=>{
    if(sessionStorage.getItem("noOfQuestions")===null){
        sessionStorage.setItem("noOfQuestions",JSON.stringify(1));
    }
    document.getElementById("quizMoniteringSectionHead").textContent = sessionStorage.getItem("noOfQuestions")+"/10";
    const question=Object.keys(ques[0])[0];
    const options=ques[0][question];
    const suffledOptions=[];
    while(suffledOptions.length<4){
        const randIndex=Math.floor(Math.random()*4);
        if(!suffledOptions.includes(options[randIndex])){
            suffledOptions.push(options[randIndex]);
        }
    }
    quizAnswer=suffledOptions.indexOf(ques[0][question][0])+1;
    document.getElementById("question").textContent = question;
    document.getElementById("forOption1").textContent = suffledOptions[0];
    document.getElementById("forOption2").textContent = suffledOptions[1];
    document.getElementById("forOption3").textContent = suffledOptions[2];
    document.getElementById("forOption4").textContent = suffledOptions[3];
    const button = document.getElementById("quizNextQuestionButton");
    document.getElementById("option1-con").classList.remove("correct-answer","wrong-answer");
    document.getElementById("option2-con").classList.remove("correct-answer","wrong-answer");
    document.getElementById("option3-con").classList.remove("correct-answer","wrong-answer");
    document.getElementById("option4-con").classList.remove("correct-answer","wrong-answer");
    console.log("before mouse down");
    
    if (count===0) {
        count=1;
        button.addEventListener("mousedown",()=>{
            console.log("mouse down");
            checkOption();  
        });
    }
}

let quiz=()=>{
    let keys=null;
    if(sessionStorage.getItem("allQueries")!==null){
        keys=Object.keys(JSON.parse(sessionStorage.getItem("allQueries")));
    }
    if(keys===null){
        sessionStorage.setItem("currentPage","exploreContainer");
        navController(sessionStorage.getItem("currentPage"));
        lessQueries();
        return;
    }
    else if(keys.length<10){
        sessionStorage.setItem("currentPage","levelSelection");
        navController(sessionStorage.getItem("currentPage"));
        lessQueries();
        return;
    }
    if(sessionStorage.getItem("quizQueries")===null) {
        if (keys.length===10){
            sessionStorage.setItem("quizQueries",JSON.stringify(keys));
        }
        else{
            let x=[];
            while(x.length<10){
                let randInd=Math.floor(Math.random()*keys.length);
                if(!x.includes(keys[randInd])){
                    x.push(keys[randInd]);
                }
            }
            sessionStorage.setItem("quizQueries",JSON.stringify(x));
        }

    }
    if(sessionStorage.getItem("level")==="easy"){
        if(sessionStorage.getItem("quizQuestions")===null){
            let questions=[];
            const allQueries=JSON.parse(sessionStorage.getItem("allQueries"));
            for(let q of JSON.parse(sessionStorage.getItem("quizQueries"))){
                let question={};
                const len=allQueries[q].length;
                let answers=[allQueries[q][0]["description"]];
                question[allQueries[q][0]["title"]]=answers;
                while(answers.length<4){
                    let answer=allQueries[q][Math.floor(Math.random()*len)]["description"]
                    if(!answers.includes(answer)){
                        answers.push(answer);
                    }
                }
                questions.push(question);
            }
            sessionStorage.setItem("quizQuestions",JSON.stringify(questions));
            
        }
        renderQuiz(JSON.parse(sessionStorage.getItem("quizQuestions")));
    }
    else if(sessionStorage.getItem("level")==="medium"){
        if(sessionStorage.getItem("quizQuestions")===null){
            let questions=[];
            const allQueries=JSON.parse(sessionStorage.getItem("allQueries"));
            for(let q of JSON.parse(sessionStorage.getItem("quizQueries"))){
                let question={};
                const len=allQueries[q].length;
                let randInd=Math.floor(Math.random()*len);
                let answers=[allQueries[q][randInd]["description"]];
                question[allQueries[q][randInd]["title"]]=answers;
                while(answers.length<4){
                    let answer=allQueries[q][Math.floor(Math.random()*len)]["description"]
                    if(!answers.includes(answer)){
                        answers.push(answer);
                    }
                }
                questions.push(question);
            }
            sessionStorage.setItem("quizQuestions",JSON.stringify(questions));
        }
        renderQuiz(JSON.parse(sessionStorage.getItem("quizQuestions")));
    }
    else if (sessionStorage.getItem("level")==="hard"){
        if(sessionStorage.getItem("quizQuestions")===null){
            let questions=[];
            const allQueries=JSON.parse(sessionStorage.getItem("allQueries"));
            for(let q of JSON.parse(sessionStorage.getItem("quizQueries"))){
                let question={};
                const len=allQueries[q].length;
                let answers=[allQueries[q][len-1]["description"]];
                question[allQueries[q][len-1]["title"]]=answers;
                while(answers.length<4){
                    let answer=allQueries[q][Math.floor(Math.random()*len)]["description"]
                    if(!answers.includes(answer)){
                        answers.push(answer);
                    }
                }
                questions.push(question);
            }
            sessionStorage.setItem("quizQuestions",JSON.stringify(questions));
        }
        renderQuiz(JSON.parse(sessionStorage.getItem("quizQuestions")));
    }
};

//persisted variables   v

function navController(x){    
    if(x==="exploreContainer"){
        links[0].classList.add("link-onClick");
        links[1].classList.remove("link-onClick");
        links[1].classList.remove("link-onClick-quizTime");
        document.getElementById("exploreContainer").classList.remove("d-none");
        document.getElementById("levelSelection").classList.add("d-none");
        document.getElementById("quizTime").classList.add("d-none");
    }
    else if(x==="levelSelection"){
        links[0].classList.remove("link-onClick");
        links[1].classList.add("link-onClick");
        links[1].classList.remove("link-onClick-quizTime");
        sessionStorage.removeItem("val");
        document.getElementById("exploreContainer").classList.add("d-none");
        document.getElementById("levelSelection").classList.remove("d-none");
        document.getElementById("quizTime").classList.add("d-none");
    }
    else if(x==="quizTime"){
        document.getElementById("quizGreetingSection").classList.remove("d-none");
        document.getElementById("exploreContainer").classList.add("d-none");
        document.getElementById("levelSelection").classList.add("d-none");
        document.getElementById("quizTime").classList.remove("d-none");
        if(JSON.parse(sessionStorage.getItem("isQuizStarted"))){
            links[1].classList.remove("link-onClick");
            links[1].classList.add("link-onClick-quizTime");
            document.getElementById("quizGreetingSection").classList.add("d-none");
            document.getElementById("quizMoniteringSection").classList.remove("d-none");
            document.getElementById("quizQuestionSection").classList.remove("d-none");
            quiz();
        }
        else{
            links[1].classList.add("link-onClick");
            links[1].classList.remove("link-onClick-quizTime");
        }
    }
    else if(x==="resultPage"){
        document.getElementById("quizGreetingSection").classList.add("d-none");
        document.getElementById("exploreContainer").classList.add("d-none");
        document.getElementById("levelSelection").classList.add("d-none");
        document.getElementById("quizTime").classList.remove("d-none");
        renderQuizResults();
    }
}
if(sessionStorage.getItem("currentPage")===null){
    sessionStorage.setItem("currentPage","exploreContainer");
    navController(sessionStorage.getItem("currentPage"));
}
else{
    navController(sessionStorage.getItem("currentPage"));
}
if (sessionStorage.getItem("query")!==null){
    searchInput.value=sessionStorage.getItem("query");
    let queryResults = JSON.parse(sessionStorage.getItem("queryResults"));
    createAndAppend(queryResults);    
}
if(sessionStorage.getItem("theme")===null){
    body.setAttribute("theme","dark");
}
else{
    body.setAttribute("theme",sessionStorage.getItem("theme"));
}


//themeSwitch functionalities    v

if(body.getAttribute("theme")==="dark"){
    darkTheme.classList.add("d-none");
    lightTheme.classList.remove("d-none");
}
else{
    darkTheme.classList.remove("d-none");
    lightTheme.classList.add("d-none");
}

themeSwitch.addEventListener("mousedown",()=>{
    if(body.getAttribute("theme")==="dark"){
        sessionStorage.setItem("theme","light");
        body.setAttribute("theme","light");
        darkTheme.classList.remove("d-none");
        lightTheme.classList.add("d-none");
    }
    else{
        sessionStorage.setItem("theme","dark");
        body.setAttribute("theme","dark");
        darkTheme.classList.add("d-none");
        lightTheme.classList.remove("d-none");
    }
});


//Fetching Query from Wikipedia   v

let fetchSreach=async(val)=>{
    let myResponse=await fetch(url + val);
    let myJsonResponse=await myResponse.json();
    return myJsonResponse.search_results;
}

//Implementing the RecomendationSystem for Search   v

let recomendSearch=async(val)=>{
    let Fresults=await fetchSreach(val);
    let x=Fresults.length;
    if(x>5) x=5;
    for(let i = 0;i<x;i++){
        liveSearchItemsArray[i].textContent=Fresults[i].title;
    }
}

//Live Search Input funtionalities   v

let onEnter=async()=>{
    searchInput.value=searchInput.value.trim();
    const query=searchInput.value;
    liveSearch.style.height="50px";
    searchInput.blur();
    if(oldUrl!==url+query){
        spinner.classList.toggle('d-none');
        liveSearchItems.classList.add("d-none");
        searchResults.textContent = "";

        let myJsonResponse=await fetchSreach(query);
        spinner.classList.toggle('d-none');
        createAndAppend(myJsonResponse);
        oldUrl=url+query;
        sessionStorage.setItem('query', query);
        sessionStorage.setItem('queryResults',JSON.stringify(myJsonResponse));
        console.log(myJsonResponse);
        if(sessionStorage.getItem("allQueries")===null && myJsonResponse.length!==0){
            let q={};
            q[query]=myJsonResponse;
            sessionStorage.setItem("allQueries",JSON.stringify(q));
        }
        else if(myJsonResponse.length!==0){
            const allQueries=JSON.parse(sessionStorage.getItem("allQueries"));
            allQueries[query]=myJsonResponse;
            sessionStorage.setItem("allQueries",JSON.stringify(allQueries));
        }
    }
    else{
        alert("Please Search Something Else...");
    }
}
searchInput.addEventListener("focus",()=>{
    liveSearch.classList.add("onFocus-liveSearch");
});
searchInput.addEventListener("blur",()=>{
    liveSearch.classList.remove("onFocus-liveSearch");
});
searchInput.addEventListener("keyup", (x) => {
    if(searchInput.value.trim()===""){
        oldUrl=url;
        searchResults.textContent = "";
        liveSearch.style.height="50px";
        liveSearchItems.classList.add("d-none");
        sessionStorage.removeItem("query");
        sessionStorage.removeItem("queryResults");
    }
    else if(otherKeyEvents.includes(x.key)){
        if(x.key==="ArrowDown"){
            liveSearchItemsArray[0].focus();
        }
    }
    else if(x !== null && x.key!=="Enter"){
        recomendSearch(searchInput.value.trim());
        liveSearchItems.classList.remove("d-none");
        liveSearch.style.height="271px";
    }
    if (x.key==="Enter") {
        onEnter();
    }
});
searchInput.addEventListener("keydown",(x)=>{
    liveSearch.classList.add("onType-liveSearch");
    setTimeout(()=>{
        liveSearch.classList.remove("onType-liveSearch");
    },50);
    if(x.key==="Enter"){
        searchIcon.classList.add("search-icon-onEnter");
        setTimeout(()=>{
            searchIcon.classList.remove("search-icon-onEnter");
        },50); 
    }
});

//Search Icon funtionalities   v

searchIcon.addEventListener("mouseenter",(x)=>{
    x.target.textContent="🔍 Search";
    let s=document.createElement("span");
    
    x.target.classList.toggle("search-icon-mouseenter");
});
searchIcon.addEventListener("mouseleave",(x) =>{
    x.target
    x.target.textContent="🔍";
    x.target.classList.toggle("search-icon-mouseenter");
})
searchIcon.addEventListener("mousedown",()=>{
    searchIcon.classList.add("search-icon-onclick")
    setTimeout(()=>{
        searchIcon.classList.remove("search-icon-onclick")
    },50);
    onEnter();
})



//Live Search Items functionalities
for(let i=0;i<5;i++){
    let item=liveSearchItemsArray[i];
    item.addEventListener("mousedown",()=>{
        searchInput.value=item.textContent;
        item.classList.add("onClick-liveSearchItem");
        setTimeout(()=>{
            item.classList.remove("onClick-liveSearchItem");
        },50);
        onEnter();
    });
    item.addEventListener("keydown",(x)=>{
        if(x.key==="ArrowUp"){
            if(i===0){
                searchInput.focus();
            }
            else{
                liveSearchItemsArray[i-1].focus();
            }
        }
        else if(x.key==="ArrowDown"){
            if(i===4){
                liveSearchItemsArray[0].focus();
            }
            else{
                liveSearchItemsArray[i+1].focus();
            }
        }
        else if(x.key==="Enter"){
            item.classList.add("onClick-liveSearchItem");
            setTimeout(()=>{
                item.classList.remove("onClick-liveSearchItem");
            },50);
            onEnter();
        }
    })
    item.addEventListener("focusin",()=>{
        searchInput.value=item.textContent;
    });
}
//navBar functionalities   v 
for (let item of links){
    item.addEventListener("mousedown",()=>{
        if(JSON.parse(sessionStorage.getItem("isQuizStarted"))){
            alert("Complete the Quiz to exit");
        }
        else{
            if(links.indexOf(item)===0){
                sessionStorage.setItem("currentPage","exploreContainer");    
            }
            else{
                sessionStorage.setItem("currentPage","levelSelection");
            }
            navController(sessionStorage.getItem("currentPage"));
        }
    });
    
}




//level Select Js
const levelForm=document.getElementById("levelForm");
const button=document.getElementById("button");
//sessionStorage.setItem("val","");
levelForm.addEventListener("change",(x)=>{
    sessionStorage.setItem("level",x.target.value);
});
button.addEventListener("click",(x)=>{
    x.preventDefault();
    document.getElementById(val).checked=false;
});
button.addEventListener("mousedown",(x)=>{
    x.target.classList.add("clicked");
    setTimeout(()=>{
        x.target.classList.remove("clicked");
    },100);
    if(sessionStorage.getItem("level")!==null){
        sessionStorage.setItem("currentPage","quizTime");
        navController(sessionStorage.getItem("currentPage"));
    }
    else{
        alert("Please Select a Valid Level");
    }
});






// quizTime Js     v
const quizStartButton=document.getElementById("quizStartButton");
const quizGreetingSection = document.getElementById("quizGreetingSection");
const quizMoniteringSection = document.getElementById("quizMoniteringSection");
const quizQuestionSection= document.getElementById("quizQuestionSection");
const quizNextQuestionButton= document.getElementById("quizNextQuestionButton");

quizStartButton.addEventListener("click", (event) => {
    links[1].classList.remove("link-onClick");
    links[1].classList.add("link-onClick-quizTime");
    if(sessionStorage.getItem("isQuizStarted")===null){
        sessionStorage.setItem("isQuizStarted","false");
    }
    sessionStorage.setItem("isQuizStarted","true");
    quizGreetingSection.classList.add("d-none");
    quizMoniteringSection.classList.remove("d-none");
    quizQuestionSection.classList.remove("d-none");
    quiz();
});


