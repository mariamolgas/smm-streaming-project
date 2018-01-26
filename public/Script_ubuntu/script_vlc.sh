#! /bin/bash

#Le pasamos los siguientes parametros
#puerto_http ip puerto_video vb titulo contraseña

if [ $# -eq 6 ]
then
  echo "Numero de parametros" $# ;
  echo "http port" $1;
  echo "ip" $2;
  echo "puerto video" $3;
  echo "bitrate video" $4;
  echo "titulo" $5
  echo "pass" $6

  RAIZ_VIDEO=public/videos/


  echo "cvlc --intf http --http-port $1  /Users/mariamolgas/Streamut-files/$5 --sout '#transcode{vcodec=theo,vb=$4,acodec=vorb,ab=128}:standard{mux=ogg,dst=$2:$3,access=http}'"
  cvlc  --http-port $1 --http-password $6 --intf http $RAIZ_VIDEO$5 --sout '#transcode{vcodec=theo,vb='$4',acodec=vorb,ab=128}:standard{mux=ogg,dst='$2':'$3',access=http}'
else
  echo "introduce: p_http, ip, p_video, vb, titulo, password"
  exit
fi
