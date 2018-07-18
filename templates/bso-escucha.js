const BsoEscucha = { template: '<div>'+
		'<v-card style="margin-bottom:10px">'+
		'<v-card-text>' +
	     '<h1 style="text-align:center;" class="text--lighten-1 teal--text">BSO ESCUCHA - Entrevistas</h1>' +
	     'Escuchar es también parte importante del asunto. Nosotros nos la pasamos hablando de cine en nuestro programa y, a veces, sentimos que es necesario hacer un poco de silencio y recibir contenidos de los demás. Es por eso que esta sección se llama "BSO escucha", porque nos acercamos a realizadores, músicos, escritores, críticos, técnicos, etcétera, intentando aprender de su experiencia en el medio.' +
	     '<br/><p style="text-align:center;">Esperamos compartir con ustedes todas nuestras inquietudes y la sapiencia de nuestros entrevistados.</p>' +
	   '</v-card-text>' +
	 '</v-card>'+
	 '<div v-if="entrevistas.length==0" style="width:100%;text-align:center">'+
	 '<v-progress-circular mx-auto :size="70" :width="7" indeterminate color="green" ></v-progress-circular>'+
	 '</div>'+
	 '<v-card v-if="entrevistas.length>0" v-for="(entrev,i) in entrevistas" :key="i" style="margin-bottom:10px">' + 
		'<v-container fluid grid-list-lg>' + 
		'<v-layout row wrap>' + 
		  '<v-flex xs12 sm5>' + 
			'<v-card-media :src="basepath + \'imagenes/\' + entrev.imagen" height="250px" style="border-radius:10px" contain></v-card-media>' + 
		  '</v-flex>' + 
		  '<v-flex xs12 sm7>' + 
			'<div>' + 
			  '<div class="headline text--lighten-1 teal--text">{{entrev.titulo}}</div>' + 
			  '<div class="texto-capitulo" v-html="entrev.texto"></div>' + 
			'</div>' + 
			'<v-card-actions>' + 
			'<v-btn color="cyan" dark :href="entrev.link">Escuchar</v-btn>' + 
			'</v-card-actions>' + 
		  '</v-flex>' + 
		'</v-layout>' + 
      '</v-container>' + 
		'</v-card>' +
	 '</div>' ,
data () {
	return { entrevistas:[],basepath:'../bso-radio/'}
},
mounted() {
	  Vue.http.get("api/entrevistas.php").then(result => {
	          result.json().then(elem =>{
	          	this.entrevistas = elem;
	          });
	      }, error => {
	          console.error(error);
	      });
}}