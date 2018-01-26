const express = require('express')
const app = express()
const ip = require('ip')
const fs=require('fs')
app.use(express.static('public'))
app.use(express.static('public/media'))
const util = require('util')
const exec = util.promisify(require('child_process').exec);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

let puerto_VLC_aux = 8081;
let puerto_flujo_aux = 8281;
let ip_server = ip.address();
let id_cont = 0;
let rooms = [];
let path="public/videos"



//pantalla despues de crear una sala
app.post('/init', function (req, res, next) {

  var room = {
    id: id_cont,
    name: req.body.roomname,
    user: req.body.user,
    viewersnumber: req.body.viewersnumber,
    film: req.body.film,
    cont: 0,
    ready: false,
    puerto_VLC: puerto_VLC_aux,
    puerto_flujo: puerto_flujo_aux,
    ip: ip_server,
    bitrates: []
  };
  rooms.push(room);
  id_cont++;
  puerto_VLC_aux++;
  puerto_flujo_aux++;

  res.render('init', {
    room: room,
    boton: true,
    wait: false,
    play_video: false
  })
});


//pantalla despues de unirse a una sala
app.get('/join', function (req, res, next) {
  let room = null;
  let video_play = false;
  if (req.query.new == "false") {
    room = {
      id: req.query.id,
      name: req.query.name,
      user: req.query.user,
      viewersnumber: req.query.viewersnumber,
      film: req.query.film,
      cont: req.query.cont,
      ready: req.query.ready
    };
    res.render('init', {
      room: room,
      boton: true,
      wait: false,
      play_video: false
    });
  }

});




//pantalla de espera para reproduccion y de reproduccion
app.post('/ready', function (req, res, next) {


  let room = null;
  let video_play = false;


  if (req.query.name != null) {
    room = {
      id: req.query.id,
      name: req.query.roomname,
      user: req.query.user,
      viewersnumber: req.query.viewersnumber,
      film: req.query.film,
      cont: req.query.cont,
      ready: req.query.ready
    };

    for (r in rooms) {
      if (rooms[r].id == room.id) {
        if (rooms[r].cont == rooms[r].viewersnumber) {
          room = {
            id: req.query.id,
            name: req.query.roomname,
            user: req.query.user,
            viewersnumber: req.query.viewersnumber,
            film: req.query.film,
            cont: req.query.cont,
            ready: req.query.ready,
            puerto_VLC: rooms[r].puerto_VLC,
            puerto_flujo: rooms[r].puerto_flujo,
            ip: ip_server,
            bitrates: rooms[r].bitrates
          };

          res.render('init', {
            room: room,
            boton: false,
            wait: false,
            play_video: true
          });
          video_play = true;
        } else {

          if (room.cont > rooms[r].cont) {
            rooms[r].bitrates.push(req.body.bitrate);
            rooms[r].cont++;
          }

          if (rooms[r].cont == rooms[r].viewersnumber) {
            video_play = true;
            room = {
              id: req.query.id,
              name: req.query.roomname,
              user: req.query.user,
              viewersnumber: req.query.viewersnumber,
              film: req.query.film,
              cont: req.query.cont,
              ready: req.query.ready,
              puerto_VLC: rooms[r].puerto_VLC,
              puerto_flujo: rooms[r].puerto_flujo,
              ip: ip_server
            };
            console.log("Velocidades adecuadas para cada espectador: ");
            console.log(rooms[r].bitrates);
            console.log("La elegida será: ");
            console.log(arrayMin(rooms[r].bitrates));
            console.log('Ejecutando: ./public/script_vlc.sh ' + rooms[r].puerto_VLC + ' ' + ip_server + ' ' + rooms[r].puerto_flujo + ' ' + arrayMin(rooms[r].bitrates) + ' ' + rooms[r].film + '.mp4 smmsmm');
            exec('./public/script_vlc.sh ' + rooms[r].puerto_VLC + ' ' + ip_server + ' ' + rooms[r].puerto_flujo + ' ' + arrayMin(rooms[r].bitrates) + ' ' + rooms[r].film + '.mp4 smmsmm');


            res.render('init', {
              room: room,
              boton: false,
              wait: false,
              play_video: true
            });
            video_play = true;
          }
        }
      }
    }
    if (video_play == false) {
      res.render('init', {
        room: room,
        boton: false,
        wait: true,
        play_video: false
      });
    }
  }
});


//pantalla para crear sala
app.get('/nueva_sala', function (req, res, next) {
  fs.readdir(path,function(err,items){
      for (var i=0; i<items.length; i++) {
      if(items[i]==".DS_Store"){
        items.splice(i,i+1);
      }
      if (items.length>0){
        items[i] = items[i].substring(0, items[i].indexOf('.'));
      }
    }
      res.render('nueva_sala', {
       items: items,
      })
    });

});

//pantalla para ver catalogo
app.get('/ver_catalogo', function (req, res, next) {
  fs.readdir(path,function(err,items){
    for (var i=0; i<items.length; i++) {
    if(items[i]==".DS_Store"){
      items.splice(i,i+1);
    }
    if(items.length>0){
      items[i] = items[i].substring(0, items[i].indexOf('.'));
    }
  }
    res.render('ver_catalogo', {
     items: items,
    })
  });
 });

//pantalla principal
app.get('/index', function (req, res, next) {
  res.sendFile(__dirname + '/public/index.html');
});

//pantalla para eliminar sala
app.get('/eliminar_sala', function (req, res, next) {
  if (req.query.id != null) {
    for (r in rooms) {
      if (rooms[r].id == req.query.id) {
        rooms.splice(r, r + 1);
      }
    }
  }
  res.render('eliminar_sala', {
    rooms: rooms
  })
});

//pantalla para unirse a sala
app.get('/unirse_a_sala', function (req, res, next) {
  res.render('unirse_a_sala', {
    rooms: rooms
  })
});


//calcula minimo de array, para elegir tasa de bir
function arrayMin(arr) {


  return arr.reduce(function (p, v) {
    return (p < v ? p : v);
  });
}


app.listen(3000, () => console.log('Streamut on port 3000!'))
