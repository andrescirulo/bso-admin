const Inicio = { template: '<div>'+
		'<v-layout row>' + 
		'<v-flex xs12 md9>' +
		'<div v-if="capitulos.length==0" style="width:100%;text-align:center">'+
			'<v-progress-circular mx-auto :size="70" :width="7" indeterminate color="green" ></v-progress-circular>'+
		'</div>'+
		'<v-card v-if="capitulos.length>=0" v-for="(cap,i) in capitulos" :key="i" style="margin-bottom:10px">' + 
		'<v-container fluid grid-list-lg>' + 
		'<v-layout row wrap>' + 
		  '<v-flex xs12 sm5>' + 
			'<v-card-media :src="basepath + \'imagenes/\' + cap.imagen" height="250px" contain></v-card-media>' + 
		  '</v-flex>' + 
		  '<v-flex xs12 sm7>' + 
			'<div>' + 
			  '<div class="headline">{{cap.nombre}}</div>' + 
			  '<div>{{cap.fecha}}</div>' + 
			  '<div class="texto-capitulo">{{cap.texto}}</div>' + 
			'</div>' + 
			'<v-card-actions>' + 
			'<v-btn color="cyan" dark :href="\'#/capitulo/\' + cap.numero">Leer Más</v-btn>' + 
			'</v-card-actions>' + 
		  '</v-flex>' + 
		'</v-layout>' + 
      '</v-container>' + 
	  '</v-card>' +
	  '</v-flex>' + 
	  '<v-flex class="hidden-sm-and-down" md3>' +
	  	'<v-card class="inicio-panel-derecha" color="teal">' +
		'</v-card>' + 
	  '</v-flex>' +
	'</v-layout><vue-editor v-model="content"></vue-editor>' +
	'</div>' ,
	data () {
	      return { capitulos:[],basepath:'../bso-radio/'}
	},
	mounted() {
	        Vue.http.get("api/capitulos.php").then(result => {
	            result.json().then(capitulos =>{
	            	this.capitulos = capitulos;
	            });
	        }, error => {
	            console.error(error);
	        });
	}
}