$(document).ready(function() { //Cuando la página se ha cargado por completo

    //Ponemos el foco en el primer input
    $(".auto-focus").focus();
    var i = 0;
    var lista = $(".lista");
    var formulario = $("form");
    var controlMostrarForm = false; //Para controlar si se ha pulsado ya anteriormente el botón de +  
    var elementoAudio = $("audio");
    var body = $("body");
    var botonNext = $(".nextButton");
    var previousButton = $(".previousButton");
    var playButton = $(".playButton")
    var pauseButton = $(".pauseButton")
    var reproducir = $(".containerAudio");
    var barra = $(".progressBar");
    var progreso = $(".progreso");
    var playing = false;
    var controlAvance=false;
    body.addClass("show_list");
    botonNext.parent().attr("disabled", true);
    previousButton.parent().attr("disabled", true);
    reloadLista();
    $.ajaxSetup({
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function() {
            body.addClass("error_msg");
        },
        complete: function() {
            body.removeClass("error_msg");
        }
    });

    $(".add-button").on("click", function() {

        if (controlMostrarForm == false) {
            $("#artist").val("");
            $("#title").val("");
            $("#song_url").val("");
            $("#cover_url").val("");
            $("#elementoId").val("");
            body.addClass("show_form");
            body.removeClass("show_list");
            body.removeClass("show_reproductor");
            controlMostrarForm = true;
        } else {
            $("#artist").val("");
            $("#title").val("");
            $("#song_url").val("");
            $("#cover_url").val("");
            $("#elementoId").val("");
            body.addClass("show_list");
            body.addClass("show_reproductor");
            body.removeClass("show_form");
            controlMostrarForm = false;
        }
    });

    $(".buttonCancelar").on("click", function() { //Botón cancelar del formulario
        $("#artist").val("");
        $("#title").val("");
        $("#song_url").val("");
        $("#cover_url").val("");
        $("#elementoId").val("");
        body.addClass("show_list");
        body.removeClass("show_form");
        body.addClass("show_reproductor");
    });

    $("form").on("submit", function() {
        var id = $("#elementoId").val(); //campo oculto del formulario con el id
        var artist = $.trim($("#artist").val());
        if (artist == "") {
            alert("El artista no puede estar vacío");
            return false;
        }
        var song = $.trim($("#title").val());
        if (song == "") {
            alert("La canción no puede estar vacía");
            return false;
        }

        var url = $.trim($("#song_url").val());

        var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig;

        if (url == "" || pattern.test(url) == false) {
            alert("La url de la canción no es válida");
            return false;
        }


        var coverUrl = $.trim($("#cover_url").val());

        var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig;
        if (pattern.test(coverUrl) == false && coverUrl != "") {
            alert("La url de la portada no es válida");
            return false;
        }

        if (id == "") { //Se va a añadir una nueva
            $.ajax({
                method: 'post',
                url: '/api/songs/',
                data: JSON.stringify({
                    artist: artist,
                    song: song,
                    url: url,
                    coverUrl: coverUrl
                }),

                success: function() {
                    body.addClass("show_list");
                    body.removeClass("show_form");
                    reloadLista();
                    body.addClass("show_reproductor");
                    controlMostrarForm = false;
                },
                error: function() {
                    alert("Se ha producido un error");
                }
            });
        } else { //Se va a modificar una
            $.ajax({
                url: "/api/songs/" + id,
                method: 'put',
                data: JSON.stringify({
                    artist: artist,
                    song: song,
                    url: url,
                    coverUrl: coverUrl
                }),
                success: function() {
                    reloadLista();
                    body.addClass("show_list");
                    body.removeClass("show_form");
                    body.addClass("show_reproductor");
                    controlMostrarForm = false;
                    //Al acabar, actualizar la lista y quitar el formulario
                    $("#artist").val("");
                    $("#title").val("");
                    $("#song_url").val("");
                    $("#cover_url").val("");
                    $("#elementoId").val("");
                },
                error: function() {
                    alert("Se ha producido un error");
                }
            });
        }
        return false;
    });

    function reloadLista() {
        $.ajax({
            method: 'get',
            url: "/api/songs/",
            success: function(data) {
                var html = "";
                html += "<h2>Tu música </h2>";
                html += '<ul>';
                for (var i in data) {
                    var artist = data[i].artist;
                    var song = data[i].song;
                    var url = data[i].url || "";
                    var coverUrl = data[i].coverUrl || "";
                    var id = data[i].id;
                    html += '<li>';
                    html += '<div class="container">';
                    html += '<div class="row">';
                    html += '<div class="col-phone-9">';
                    html += '<div class="data">';
                    html += '<div class="container">';
                    html += '<div class="row">';
                    html += '<div class="col-phone-3 col-desktop-2">';
                    html += '<p class="img-wrapper">';
                    if (coverUrl == "") {
                        html += '<i class="fa fa-music fa-lg"></i>' + " ";
                    } else {
                        html += '<img src="' + coverUrl + '"/>';
                    }
                    html += '</p>';
                    html += '</div>';
                    html += '<div class="col-phone-9 col-desktop-10">';
                    html += '<p class="label-wrapper"';
                    html += '<label>'
                    html += song + " ";
                    html += '</label>'
                    html += '<label>'
                    html += artist + " ";
                    html += '</label>'
                    html += '</p>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="col-phone-3">';
                    html += '<div class="icon-wrapper">';
                    html += ' <i class="fa fa-play-circle play-button fa-lg" data-songid="' + id + '" data-url="' + url + '"></i>';
                    html += ' <i class="fa fa-pencil modify-pencil fa-lg" data-songid="' + id + '" data-url="' + url + '"></i>';
                    html += ' <i class="fa fa-trash delete-trash fa-lg" data-songid="' + id + '" data-url="' + url + '"></i>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += ' </li>';
                }
                html += '</ul>';
                lista.html(html); // innerHTML=html
            },
            error: function() {
                alert("Se ha producido un error");
            }
        });
    }

    $(".lista").on("click", ".delete-trash", function() { //Si se añaden elementos de la lista, añadir evento al icono de la basura
        var self = this;
        var id = $(self).data("songid");
        $.ajax({
            url: "/api/songs/" + id,
            method: "delete",
            success: function() {
                $(self).parents("li").remove();
            },
            error: function() {
                alert("Se ha producido un error");
            }
        });
    });

    $(".lista").on("click", ".modify-pencil", function() { //Si se añaden elementos a la lista, añadir evento al icono del lapiz de modificar elemento
        //mostrar el formulario y en el formulario añadir al botón de "modificar" el evento de modificar
        var elementoI = this;
        var idElemento = $(elementoI).data("songid");
        $.ajax({ //Coger los datos de ese id desde la base de datos
            url: "/api/songs/" + idElemento,
            method: "get",
            success: function(data) {
                //Obtener los valores de ese elemento para ponerlos en el cuestionario
                var artist;
                var song;
                var url;
                artist = data.artist;
                song = data.song;
                url = data.url;
                //Ahora poner esos valores en los valores del cuestionario
                $("#artist").val(artist);
                $("#title").val(song);
                $("#song_url").val(url);
                $("#elementoId").val(idElemento);
            },
            error: function() {
                alert("Se ha producido un error");
            }
        });
        body.addClass("show_form");
        body.removeClass("show_list");
        body.removeClass("show_reproductor");
    });

    function playSong(url, elementoListaAReproducir) {
        if ($(elementoListaAReproducir).prev("li").length == 0) {
            previousButton.parent().attr("disabled", true);
        } else {
            previousButton.parent().removeAttr("disabled");
        }
        if ($(elementoListaAReproducir).next("li").length == 0) {
            botonNext.parent().attr("disabled", true);
        } else {
            botonNext.parent().removeAttr("disabled");
        }

        if ($(elementoListaAReproducir).prev("li").length == 0 && $(elementoListaAReproducir).next("li").length == 0) {
            botonNext.parent().attr("disabled", true);
            previousButton.parent().attr("disabled", true);
        }
        elementoAudio.attr("src", url);
        playing = true;

    }; //CUIDADO!!!


    $(".lista").on("click", ".play-button", function() { //Para que el botón del play reproduzca la canción
        var elementoI = this;
        var urlElemento = $(elementoI).data("url");
        var elementoLi = $(elementoI).parents("li");
        var elementoConReproduciendo = $(".lista").find(".reproduciendo");
        elementoConReproduciendo.removeClass("reproduciendo");
        $(elementoLi).addClass("reproduciendo");
        playSong(urlElemento, elementoLi);
    });

    // Para que al hacer doble click en el elemento de la lista se reproduzca la canción

    $(".lista").on("dblclick", "li", function() {
        var elementoLi = this;
        var urlElemento = $(elementoLi).find(".delete-trash").data("url");
        var elementoConReproduciendo = $(".lista").find(".reproduciendo");
        elementoConReproduciendo.removeClass("reproduciendo");
        $(elementoLi).addClass("reproduciendo");
        playSong(urlElemento, elementoLi);

    });

    $(elementoAudio).bind("ended", function() {
        var elementoReproducido = $(lista).find(".reproduciendo");
        $(elementoReproducido).removeClass("reproduciendo");
        var elementoAReproducir = $(elementoReproducido).next("li");
        if(elementoAReproducir.length!=0){
          $(elementoAReproducir).addClass("reproduciendo");
          var urlNueva = $(elementoAReproducir).find(".delete-trash").data("url");
           playSong(urlNueva, elementoAReproducir);
        }
        else{
            botonNext.parent().attr("disabled", true);
            previousButton.parent().attr("disabled", true);
        }
    });

    $(".nextButtonwrapper").on("click", function(evt) {
        prevAndNext("next");
        evt.stopPropagation();
    });

    $(".prevButtonwrapper").on("click", function(evt) {
        evt.stopPropagation();
        var progreso=$("audio")[0].currentTime;
        if(controlAvance==true){ // No es la primera vez que lo pulso 
            if(progreso<3){
                //Si el progreso está en el principio de la canción, ir a la canción anterior.
                controlAvance=false;
                prevAndNext("prev");
            }
            controlAvance=false;
        } 
        if(controlAvance==false){ //Es la primera vez que lo pulso
             //Si el progreso está avanzado y es la primera vez que doy al botón, volver al principio de la canción.
                $("audio")[0].currentTime=0;
                controlAvance=true;
        }
    });

    function prevAndNext(prevOrNext) {
        var elementoAReproducir = null;
        var elementoReproducido = $(lista).find(".reproduciendo");
        $(elementoReproducido).removeClass("reproduciendo");
        if (prevOrNext == "prev") {
            elementoAReproducir = $(elementoReproducido).prev("li");
        } else {
            elementoAReproducir = $(elementoReproducido).next("li");
        }
        elementoAReproducir.addClass("reproduciendo");
        var urlNueva = $(elementoAReproducir).find(".delete-trash").data("url");
        playSong(urlNueva, elementoAReproducir);
    };

    //Cada 3 segundos que compruebe si no hay ninguna canción seleccionada y que desactive los botones de next y prev

    var intervalId = setInterval(function() {
        //pero si es el ultimo elemento, que no lo borre..
        if ($(lista).find(".reproduciendo").length != 0 && $(lista).find(".reproduciendo").next("li").length == 0) {
            botonNext.parent().attr("disabled", true);
        }
        if ($(lista).find(".reproduciendo").length != 0 && $(lista).find(".reproduciendo").prev("li").length == 0) {
            previousButton.parent().attr("disabled", true);
        }
        if ($(lista).find(".reproduciendo").length == 0) {
            botonNext.parent().attr("disabled", true);
            previousButton.parent().attr("disabled", true);
        }
        i++;
        if (i > 3) {
            clearInterval(intervalId); // finaliza el interval
            i = 0;
        }
    }, 3000);

    //Funciones del reproductor
    pauseButton.on("click", function() {
        var player = document.getElementById('player');
        if (playing == true) {
            player.pause();
            playing = false;
        }
    });

    playButton.on("click", function() {
        var player = document.getElementById('player');
        if (playing == false) {
            player.play();
            playing = true;
        }
    })


    var player = document.getElementById('player');
    player.addEventListener("timeupdate", function() {
        var currentTime = player.currentTime;
        var duration = player.duration;
        $('.progreso').stop(true, true).animate({ 'width': (currentTime + .25) / duration * 100 + '%' }, 250, 'linear');
    });


    var barraVolumen=$("#volumeRange");
    barraVolumen.on("click", function(){
        var barraVolumenValor = barraVolumen[0].value;
        $("audio")[0].volume = ( barraVolumenValor / 10);
    });

    barra.on("click", function(e) {
        var percent = e.offsetX / this.offsetWidth;
        player.currentTime = percent * player.duration;
        progreso.value = percent / 100;
    });



}); //fin del $(document).ready()
