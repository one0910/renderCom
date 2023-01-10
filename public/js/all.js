var send = document.querySelector('#send')
var content = document.querySelector('#content')
var list = document.querySelector('#list')

send.addEventListener('click', function (event) {
    var str = content.value;
    var xhr = new XMLHttpRequest;
    xhr.open('post','/addTodo');
    xhr.setRequestHeader('Content-type','application/json')
    // 把
    var todo = JSON.stringify({
        "content":content.value,
    })

    xhr.send(todo);
    xhr.onload = function(){
        var originData = JSON.parse(xhr.response)
        console.log(originData);
        if (originData.sucess == false) {
            alert(originData.message);
            return;
        }
        var data = originData.result;
        var str = '';
        for (key in data) {
            str+=`<li>${data[key].content}&nbsp<input data-id="${key}" type="button" value="刪除"></li>`
        }
        list.innerHTML = str;
    }
}, false);

list.addEventListener('click', function (event) {
    if (event.target.nodeName !== 'INPUT') {
        return
    }
    var id = event.target.dataset.id;
    var xhr = new XMLHttpRequest;
    xhr.open('post','/removeTodo');
    xhr.setRequestHeader('Content-type','application/json');
    var removeTodo = JSON.stringify({"id":event.target.dataset.id});
    xhr.send(removeTodo);
    xhr.onload = function(){
        var originData = JSON.parse(xhr.responseText)
        var data = originData.result;
        var str = '';
        for(key in data){
            // console.log(data[key]);
            str+=`<li>${data[key]['content']}&nbsp<input data-id="${key}" type="button" value="刪除"></li>`
        }
        list.innerHTML = str;
    }
}, false);