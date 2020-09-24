#browser-sync start --ss assets/ --cwd html/,html/admin/ --server  --port 4000 --files "html/*.html,assets/css/*.css" &
#browser-sync start --ss assets/  --server html/ --port 4000 --files "html/*.html,html/admin/*.html,assets/css/*.css" &
node-sass -r -w assets/sass/app.scss -o assets/css/ 
#pug -O options.js ./template/views -w -o html &
