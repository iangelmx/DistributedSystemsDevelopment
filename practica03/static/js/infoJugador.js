

$(function(){
    var a = "";

    $("#sendButton").click(function(){
        swal("Enviando", "Enviando archivo a coordinador", "info");
    });
    
    a = setInterval(function(){
        $.ajax({
            type: "GET",
            url: '/numeros/getTime/0/',
            //data: JSON.stringify({'auditoria':idAuditoria , 'preguntas':misCambios}),
            contentType:'application/json;charset=UTF-8',    
        })
        .done(function(data) {
            //console.log( "exito R1" );
            //console.log(data);
            
            var horaFormat = "";
            var horaR1 = data.description.tiempo;
            if( horaR1.hora < 10){
                horaR1.hora = "0"+horaR1.hora;
            }
            if( horaR1.mins < 10){
                horaR1.mins = "0"+horaR1.mins;
            }
            if( horaR1.segs < 10){
                horaR1.segs = "0"+horaR1.segs;
            }
            horaFormat = horaR1.hora+":"+horaR1.mins+":"+horaR1.segs;
            document.getElementById('reloj1').innerHTML = horaFormat;

        })
        .fail(function(data) {
        console.log( "error" );
        console.log(data);
        });
    }, 500);
    
    
    $("#edit1").click(function(){
        clearInterval(a);

        $.ajax({
            type: "GET",
            url: `/relojes/pausa/${0}/pausa`,
            //data: JSON.stringify({'auditoria':idAuditoria , 'preguntas':misCambios}),
            contentType:'application/json;charset=UTF-8',    
        });
        
        swal({
            text: 'Dame la nueva hora en formato HH:MM:SS',
            content: "input",
            button: {
              text: "Editar!",
              closeModal: true,
            },
          })
          .then(name => {
            if (!name) throw null;
            tiempo=name.split(":");
            console.log(`/relojes/edit/${0}/${tiempo[0]-1}/${tiempo[1]-1}`);
            $.ajax({
                type: "POST",
                async: false,
                url: `/relojes/edit/${0}/${tiempo[0]-1}/${tiempo[1]-1}`,
                //data: JSON.stringify({'auditoria':idAuditoria , 'preguntas':misCambios}),
                contentType:'application/json;charset=UTF-8',    
            })
            .done(function(data) {
              console.log(data);
                $.ajax({
                    type: "GET",
                    async: false,
                    url: `/relojes/pausa/${0}/retoma`,
                    //data: JSON.stringify({'auditoria':idAuditoria , 'preguntas':misCambios}),
                    contentType:'application/json;charset=UTF-8',    
                });
                a = setInterval(function(){
                    $.ajax({
                        type: "GET",
                        url: '/relojes/getTime/0/',
                        //data: JSON.stringify({'auditoria':idAuditoria , 'preguntas':misCambios}),
                        contentType:'application/json;charset=UTF-8',    
                    })
                    .done(function(data) {
                        //console.log( "exito R1" );
                        //console.log(data);
                        
                        var horaFormat = "";
                        var horaR1 = data.description.tiempo;
                        if( horaR1.hora < 10){
                            horaR1.hora = "0"+horaR1.hora;
                        }
                        if( horaR1.mins < 10){
                            horaR1.mins = "0"+horaR1.mins;
                        }
                        if( horaR1.segs < 10){
                            horaR1.segs = "0"+horaR1.segs;
                        }
                        horaFormat = horaR1.hora+":"+horaR1.mins+":"+horaR1.segs;
                        document.getElementById('reloj1').innerHTML = horaFormat;
            
                    })
                    .fail(function(data) {
                    console.log( "error" );
                    console.log(data);
                    });
                }, 200);
            })
            .fail(function(data) {
            console.log( "error" );
            console.log(data);
            });
          })
    });
    $("#send").click(function(){
        swal("Actualizando...", "Todo se está actualizando", "info");
        $.ajax({
            type: "POST",
            url: `/relojes/sendUpdate`,
            //data: JSON.stringify({'auditoria':idAuditoria , 'preguntas':misCambios}),
            contentType:'application/json;charset=UTF-8',    
        }).done(function(data){
            if(data.ok == true){
                console.log("Actualización terminada...");
                console.log(data);
                swal("Listo!", "Todo se actualizó...", "success");
                setTimeout(function () {
                    location.reload();
                }, 2000);
            }else{
                console.log("ERROR");
                console.log(data);
                console.log("------");
                swal("Oh!", "Ha ocurrido un error...", "error");
                /*setTimeout(function () {
                    location.reload();
                }, 2000);*/
            }
        });
    });
});



/////////////////////
function add1(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("ACELERA");
      console.log(this.responseText);
    }
  };
  xhttp.open("GET", "/numeros/0/A", true);
  xhttp.send();
}

function sub1(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("DESACELERA");
      console.log(this.responseText);
    }
  };
  xhttp.open("GET", "/numeros/0/D", true);
  xhttp.send();
}

////////////////////