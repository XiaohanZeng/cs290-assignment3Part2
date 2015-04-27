// JavaScript source code
var originalGistList = [];
var fetchData = function () {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            originalGistList = JSON.parse(this.responseText);
            createGistList(originalGistList);


        }
    };
    if(!req)
    {
        throw 'Unable to create HttpRequest.';
    }
    var number = parseInt(document.getElementById("pageNum")["value"]);
    if (isNaN(number) || number < 1 || number > 5)
    {
        alert("Input is illegal");
    }
    else {
        var url = 'https://api.github.com/gists';
        var params = {
            per_page: number * 30
        }
        url += '?' + urlStringify(params);

        req.open('GET', url);
        req.send();
    }
}

function urlStringify(obj) {
    var str = [];
    for (var prop in obj) {
        var s = encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]);
        str.push(s);
        
    }
    return str.join('&');
}

function createGistList(gistList) {
    var gistLocation = document.getElementById("gistBody");
    while (gistLocation.firstChild) {
        gistLocation.removeChild(gistLocation.firstChild);
    }
    for(var gist in gistList)
    {
        var gistDescription = gistList[gist]["description"];
        var gistUrl = gistList[gist]["url"];

        var gistContainer = document.createElement("div");
        gistContainer.id = "gistContainer_g";
        gistContainer.className = "gistContainer";
        gistLocation.appendChild(gistContainer);

        var contentContainer = document.createElement("div");
        contentContainer.id = "contentContainer_g";
        contentContainer.className = "contentContainer";
        gistContainer.appendChild(contentContainer);

        var addFavorite = document.createElement("button");
        contentContainer.appendChild(addFavorite);
        addFavorite.id = "addFavorite_g";
        addFavorite.className = "gistButton";
        addFavorite.onclick = addToFavoriteOnClick;

        var id = document.createElement("INPUT");
        id.setAttribute("type", "hidden");
        id.value = gistList[gist]["id"];
        id.id = "gistId_g";
        contentContainer.appendChild(id);

        var descripContainer = document.createElement("div");
        descripContainer.id = "descripContainer";
        descripContainer.className = "descripContainer";
        contentContainer.appendChild(descripContainer);
        descripContainer.textContent = gistDescription;

        var urlContainer = document.createElement("a");
        urlContainer.id = "urlContainer_g";
        urlContainer.className = "urlContainer";
        urlContainer.href = gistUrl;
        urlContainer.text = gistUrl;
        gistContainer.appendChild(urlContainer);

        var line = document.createElement("hr");
        gistContainer.appendChild(line);
    }

}

function fetchGistById(id) {
    for (var gist in originalGistList)
    {
        if (originalGistList[gist]["id"] === id)
            return originalGistList[gist]
    }
    return null;
}

function deleteGistById(id) {
    for (var gist in originalGistList) {
        if (originalGistList[gist]["id"] === id)
        {
            originalGistList.splice(gist, 1);
            return;
        }        
    }
    return;
}

function displayFavorite() {
    var gistLocation = document.getElementById("favBody");
    while (gistLocation.firstChild) {
        gistLocation.removeChild(gistLocation.firstChild);
    }
    for (var key in localStorage) {
        if (key.startsWith("cs290")) {
            var gist = JSON.parse(localStorage.getItem(key));
            var gistDescription = gist["description"];
            var gistUrl = gist["url"];

            var gistContainer = document.createElement("div");
            gistContainer.id = "gistContainer_f";
            gistContainer.className = "gistContainer";
            gistLocation.appendChild(gistContainer);

            var contentContainer = document.createElement("div");
            contentContainer.id = "contentContainer_f";
            contentContainer.className = "contentContainer";
            gistContainer.appendChild(contentContainer);

            var removeFavorite = document.createElement("button");
            contentContainer.appendChild(removeFavorite);
            removeFavorite.id = "removeFavorite_f";
            removeFavorite.className = "gistButton";
            removeFavorite.onclick = removeToFavoriteOnClick;

            var id = document.createElement("INPUT");
            id.setAttribute("type", "hidden");
            id.value = gist["id"];
            id.id = "gistId_f";
            contentContainer.appendChild(id);

            var descripContainer = document.createElement("div");
            descripContainer.id = "descripContainer_f";
            descripContainer.className = "descripContainer";
            contentContainer.appendChild(descripContainer);
            descripContainer.textContent = gistDescription;

            var urlContainer = document.createElement("a");
            urlContainer.id = "urlContainer_f";
            urlContainer.className = "urlContainer";
            urlContainer.href = gistUrl;
            urlContainer.text = gistUrl;
            gistContainer.appendChild(urlContainer);

            var line = document.createElement("hr");
            gistContainer.appendChild(line);
        }
    }
}

function addToFavoriteOnClick(obj) {
    var addFavorite = obj.currentTarget;
    var idNode = addFavorite.parentNode.childNodes[1];
    var id = idNode.value;
    var gist = fetchGistById(id);
    localStorage.setItem("cs290." + id, JSON.stringify(gist));
    displayFavorite();
    deleteGistById(id);
    createGistList(originalGistList);
}

function removeToFavoriteOnClick(obj) {
    var addFavorite = obj.currentTarget;
    var idNode = addFavorite.parentNode.childNodes[1];
    var id = idNode.value;
    var gist = JSON.parse(localStorage.getItem("cs290." + id));
    localStorage.removeItem("cs290." + id); 
    displayFavorite();
    originalGistList.splice(originalGistList.length, 1, gist);
    createGistList(originalGistList);
}

window.onload = function () {
    fetchData();
    document.getElementById("enterNum").onclick = function () {
        fetchData();
    }
    displayFavorite();

}