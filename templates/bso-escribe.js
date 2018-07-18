const BsoEscribe = { template: '<div>'+
					'<v-card style="margin-bottom:10px">'+
						'<v-card-text>' +
					     '<h1 style="text-align:center;" class="text--lighten-1 teal--text">BSO ESCRIBE - Textos</h1>' +
					     'Porque no sólo nos gusta la radio. Porque los pensamientos no sólo se charlan o se escuchan sino que también se escriben. Porque, tal vez, algunos textos se pueden volver imágenes cinematográficas. Porque nos encanta que el séptimo arte nos invada en todas sus dimensiones y podamos incluir voces acerca de él y sus aledaños.Porque queremos escribir. Porque queremos leer. Porque nos interesa.' +
					     '<br/><p style="text-align:center;">Por todo esto... ¡BSO escribe!</p>' +
					   '</v-card-text>' +
					 '</v-card>'+
					 '<div v-if="textos.length==0" style="width:100%;text-align:center">'+
					 '<v-progress-circular mx-auto :size="70" :width="7" indeterminate color="green" ></v-progress-circular>'+
					 '</div>'+
					 '<v-card v-if="textos.length>0" v-for="(tex,i) in textos" :key="i" style="margin-bottom:10px">' + 
						'<v-container fluid grid-list-lg>' + 
						'<v-layout row wrap>' + 
						  '<v-flex xs12 sm5>' + 
							'<v-card-media :src="basepath + \'imagenes/\' + tex.imagen" height="250px" style="border-radius:10px" contain></v-card-media>' + 
						  '</v-flex>' + 
						  '<v-flex xs12 sm7>' + 
							'<div>' + 
							  '<div class="headline text--lighten-1 teal--text">{{tex.titulo}}</div>' + 
							  '<div class="text--lighten-1 teal--text" >{{tex.subtitulo}}</div>' + 
							  '<div class="texto-capitulo" v-html="tex.resenia"></div>' + 
							'</div>' + 
							'<v-card-actions>' + 
							'<v-btn color="cyan" dark :href="\'#/texto/\' + tex.id">Leer Más</v-btn>' + 
							'</v-card-actions>' + 
						  '</v-flex>' + 
						'</v-layout>' + 
				      '</v-container>' + 
						'</v-card>' +
					 '</div>' ,
 data () {
		return { textos:[],basepath:'../bso-radio/'}
 },
 mounted() {
  Vue.http.get("api/textos.php").then(result => {
          result.json().then(elem =>{
          	this.textos = elem;
          });
      }, error => {
          console.error(error);
      });
}}