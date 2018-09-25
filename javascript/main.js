// Define theme array
let sports = ['soccer', 'football', 'basketball', 'hockey', 'ping pong', 'tennis', 'rugby', 'formula 1', 'skating', 'formula drift', 'cricket', 'volleyball'];
// Define default search params
const apiKey = '1loVfAxwBi0t2FP96Nsgh8JVUzZLWHxE';
let q = 'sports';
let response;

$('document').ready(function () {
    displayBtns();
    getData();
});

let getData = () => {
    let url = `http://api.giphy.com/v1/gifs/search?q=${q}&api_key=${apiKey}&limit=10`;

    let xhr = $.get(url);
    xhr.done(function(data) {
        showGifs(data.data);
        response = data.data;
    });
};

function displayBtns () {
    $('.buttons').empty();
    for( let sport of sports) {
        let newBtn = $('<button>', {
            text: sport,
            class: 'btn btn-success',
            id: 'buttons',
            data_value: sport
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

    let newKey = $('#newKey').val().trim();
    if (newKey === '') {
        alert('please enter a search item');
    } else {
        sports.push(newKey);
        displayBtns();
    }
});

$('.buttons').on('click', '#buttons', function () {
    let newkey = $(this).attr('data_value');
    console.log(newkey);
    q = newkey;
    getData();
});


