// Define theme array
let topics = ['soccer', 'football', 'basketball', 'hockey', 'ping pong', 'tennis', 'rugby', 'formula 1', 'skating', 'formula drift', 'cricket', 'volleyball'];
// Define default search params
const apiKey = '1loVfAxwBi0t2FP96Nsgh8JVUzZLWHxE';
let q = 'football';
let limit = 10;
let response;

let list = JSON.parse(localStorage.getItem("favlist"));
if (!Array.isArray(list)) {
    list = [];
}
renderFavs(list);

$('document').ready(function () {
    displayBtns();
    getData();
});

let getData = () => {
    let url = `https://api.giphy.com/v1/gifs/search?q=${q}&api_key=${apiKey}&limit=${limit}`;

    let xhr = $.get(url);
    xhr.done(function(data) {
        showGifs(data.data);
        response = data.data;
    });
};

function displayBtns () {
    $('.buttons').empty();
    for( let topic of topics) {
        let newBtn = $('<button>', {
            text: topic,
            class: 'btn btn-success',
            id: 'buttons',
            data_value: topic
        });
        $('.buttons').append(newBtn);
    }
}

var showGifs = (data) => {
    console.log(data);
    $('#my-gifs').empty();

    for (let x in data) {
        let gif = $(`<div class='gifDiv'>
            <img id="gif" data-index = ${x} src=${data[x].images.fixed_height_still.url} data-state = 'still' width="250px" height="200px"><br>
            <span id="badge" class="badge badge-warning">Rated: ${data[x].rating}</span><br>
            <a href=${data[x].images.fixed_height.url} download=${data[x].title}>Download</a></div>`);
        $('#my-gifs').append(gif);
    }
};

$('.row').on('click', 'img#gif', function () {
    let state = $(this).attr('data-state');
    let index = $(this).attr('data-index');

    if (state === 'still') {
        $(this).attr('src', `${response[index].images.fixed_height.url}`);
        $(this).attr('data-state', 'animated');
    } else {
        $(this).attr('src', `${response[index].images.fixed_height_still.url}`);
        $(this).attr('data-state', 'still');
    }
});

$('#add').on('click', function () {
    event.preventDefault();

    let newKey = $('#newKey').val().trim().toLowerCase();
    if (newKey === '') {
        alert('please enter a search item');
    } else {
        topics.push(newKey);
        displayBtns();
    }
});

$('.buttons').on('click', '#buttons', function () {
    limit = 10;
    let newkey = $(this).attr('data_value');
    console.log(newkey);
    q = newkey;
    getData();
});

$('#more').on('click', function () {
    limit += 10;
    getData();
});

$('#favsBtn').on('click', function () {
    event.preventDefault();

    let newFav = $('#newKey').val().trim().toLowerCase();
    console.log(newFav);
    if (newFav === '') {
        alert('please enter a new favorite item');
    } else {
        list.push(newFav);
        renderFavs(list);
        localStorage.setItem("favlist", JSON.stringify(list));
    }
});

function renderFavs (list) {
    $('.favCard').empty();

    for (let fav in list) {
        let newFav = $('<li>');
        newFav.text(list[fav]);
        newFav.addClass("list-group-item");
        newFav.attr("data-to-do", fav);

        $('.favCard').append(newFav);
    }
}

$('.favCard').on('click', 'li', function () {
     let index = $(this).attr('data-to-do');
     q = list[index];
     getData();
});

$('#favsClear').on('click', function () {
    localStorage.clear();
    list.length = 0;
    $('.favCard').empty();
});



