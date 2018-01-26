# smm-streaming-project

Pasos para la instalación y puesta en marcha
Realizamos la instalación de nodejs, para ello lo descargamos a traves de su pagina web www.nodejs.org/es . Necesitamos una version 8 superior debido a las incompatibilidades de algunas librerías utilizadas con versiones anteriores.
Podría ser necesario la instalación del servidor de paquetes de node mediante la instrucción:
  sudo apt-get install npm
Nos vamos a la carpeta Streamut y como las dependencias están referenciadas en el archivo .json procedemos con la instalación de las dependencias del servicio a traves del comando:
  npm install
Este comando nos creará una carpeta con las dependencias llamada node_modules.
Para el lanzamiento del servicio:
  node app.js
Para acceder a la interfaz web del servicio desde cualquier equipo abrimos el navegador e introducimos:
direccion_ip_servidor:3000
  localhost:3000 (Disponible desde el equipo servidor)

Notas:
Las pruebas se han desarrollado en Ubuntu 16.04 y MacOSX Sierra 10.12.6

Requisitos previos tener instalado el VLC:
  Ubuntu: sudo apt-get install vlc
  MacOSX: https://www.videolan.org/vlc/index.es.html
Contenido a compartir: public/videos
  Los videos compartidos deben estar en mp4, otros formatos podrían requerir la
  instalación de librerías adicionales en el vlc
Carátulas: public/media (En formato jpg y mismo nombre que el video)
Editar ruta del VLC en public/Script_vlc.sh o sustituir el script incluido:
  Ubuntu: cvlc (Por defecto)
  MacOS: /Applications/VLC.app/Contents/MacOS/VLC
