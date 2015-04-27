// JavaScript source code
var originalGistList = [];
var fetchData = function () {
    var req = new XMLHttpRequest();
    if(!req)
    {
        throw 'Unable to create HttpRequest.';
    }
    var number =parseInt( document.getElementById("pageNum")["value"]);
    var url = 'https://api.github.com/gists';
    var params = {
        per_page: number * 30
    }
    url += '?' + urlStringify(params);
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            originalGistList = JSON.parse(this.responseText);
            createGistList(originalGistList);
            

        }
    };
    req.open('GET', url);
    req.send();
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
        gistContainer.id = "gistContainer";
        gistLocation.appendChild(gistContainer);

        var contentContainer = document.createElement("div");
        contentContainer.id = "contentContainer";
        gistContainer.appendChild(contentContainer);

        var addFavorite = document.createElement("button");
        contentContainer.appendChild(addFavorite);
        addFavorite.id = "addFavorite";
        addFavorite.onclick = addToFavoriteOnClick;

        var id = document.createElement("INPUT");
        id.setAttribute("type", "hidden");
        id.value = gistList[gist]["id"];
        id.id = "gistId";
        contentContainer.appendChild(id);

        var descripContainer = document.createElement("div");
        descripContainer.id = "descripContainer";
        contentContainer.appendChild(descripContainer);
        descripContainer.textContent = gistDescription;

        var urlContainer = document.createElement("div");
        urlContainer.id = "urlContainer";
        urlContainer.innerHTML = gistUrl;
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
            gistLocation.appendChild(gistContainer);

            var contentContainer = document.createElement("div");
            contentContainer.id = "contentContainer_f";
            gistContainer.appendChild(contentContainer);

            var addFavorite = document.createElement("button");
            contentContainer.appendChild(addFavorite);
            addFavorite.id = "addFavorite_f";

            var id = document.createElement("INPUT");
            id.setAttribute("type", "hidden");
            id.value = gist["id"];
            id.id = "gistId_f";
            contentContainer.appendChild(id);

            var descripContainer = document.createElement("div");
            descripContainer.id = "descripContainer_f";
            contentContainer.appendChild(descripContainer);
            descripContainer.textContent = gistDescription;

            var urlContainer = document.createElement("div");
            urlContainer.id = "urlContainer_f";
            urlContainer.innerHTML = gistUrl;
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
}

window.onload = function () {
    fetchData();
    document.getElementById("enterNum").onclick = function () {
        fetchData();
    }
    displayFavorite();

}