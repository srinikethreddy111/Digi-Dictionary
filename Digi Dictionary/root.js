let searchResults = document.getElementById("searchResults");
let searchInput = document.getElementById("searchInput");
let spinner = document.getElementById("spinner");
let liveSearchItems=document.getElementById("liveSearchItems");
let searchIcon=document.getElementById("searchIcon");
let liveSearch=document.getElementById("liveSearch");
let liveSearchItemsArray=[document.getElementById("liveSearchItem1"),document.getElementById("liveSearchItem2"),document.getElementById("liveSearchItem3"),document.getElementById("liveSearchItem4"),document.getElementById("liveSearchItem5")];
let url = "https://apis.ccbp.in/wiki-search?search=";
let oldUrl=url;

liveSearchItems.classList.add("d-none");
liveSearch.style.height="50px";
let otherKeyEvents=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Backspace","Delete","Escape"];

//Fetching Query from Wikipedia

let fetchSreach=async(val)=>{
    let myResponse=await fetch(url + val);
    let myJsonResponse=await myResponse.json();
    return myJsonResponse;
}

//Implementing the RecomendationSystem for Search

let recomendSearch=async(val)=>{
    let responseResult=await fetchSreach(val);
    responseResult=responseResult.search_results;
    for(let i = 0;i<5;i++){
        liveSearchItemsArray[i].textContent=responseResult[i].title;
    }
}

//Live Search Input funtionalities   v

let onEnter=async()=>{
    searchInput.value=searchInput.value.trim();
    liveSearch.style.height="50px";
    searchInput.blur();
    if(oldUrl!==url+searchInput.value){
        
        spinner.classList.toggle('d-none');
        liveSearchItems.classList.add("d-none");
        searchResults.textContent = "";

        let myJsonResponse=await fetchSreach(searchInput.value);
        spinner.classList.toggle('d-none');
        for (let result of myJsonResponse.search_results) {
            createAndAppend(result);
        }

        oldUrl=url+searchInput.value;
    }
    else{
        //please search something
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

//Search Results functionalities   v

let createAndAppend = function(result) {
    let {
        description,
        link,
        title
    } = result;

    let aE1 = document.createElement("a");
    aE1.href = link;
    aE1.textContent = title;
    aE1.target = "_self";
    aE1.classList.add("result-title");
    searchResults.appendChild(aE1);

    let br1 = document.createElement("br");
    searchResults.appendChild(br1);

    let aE2 = document.createElement("a");
    aE2.href = link;
    aE2.target = "_self";
    aE2.textContent = link;
    aE2.classList.add("result-url");
    searchResults.appendChild(aE2);

    let br2 = document.createElement("br");
    searchResults.appendChild(br2);

    let des = document.createElement("p");
    des.textContent = description;
    des.classList.add("link-description");
    searchResults.appendChild(des);
};

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
            searchInput.value=item.textContent;
            item.classList.add("onClick-liveSearchItem");
            setTimeout(()=>{
                item.classList.remove("onClick-liveSearchItem");
            },50);
            onEnter();
        }
    })
    
}



