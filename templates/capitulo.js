const Capitulo = { template: '<div>'+
		'<v-layout row>' + 
		'<v-flex xs12 md9>' +
		'<div v-if="capitulo==null" style="width:100%;text-align:center">'+
			'<v-progress-circular mx-auto indeterminate ></v-progress-circular>'+
		'</div>'+
		'<v-layout v-if="capitulo!=null">' +
		'<v-flex xs12>' +
		  '<v-card style="margin:10px" >' +
			'<v-card-media v-if="capitulo.imagen!=null" :src="basepath + \'imagenes/\' + capitulo.imagen" height="400px">' +
			'</v-card-media>' +
			'<v-card-title primary-title>' +
			  '<div>' +
				'<h3 class="headline mb-0">{{capitulo.nombre}}</h3>' +
				'<div>{{capitulo.texto}}</div>' +
			  '</div>' +
			'</v-card-title>' +
			'<v-card-actions>' +
			  '<v-btn color="orange" dark>Escuchar</v-btn>' +
			  '<v-btn color="orange" dark>Descargar</v-btn>' +
			'</v-card-actions>' +
			'<div style="padding:20px" class="body-2">' +
			'También podés escuchar nuestros progra​mas los viernes a las 22:00 hs por www.larocker.com.ar y Bunker FM 91.9' +
			'</div>' +
		  '</v-card>' +
		'</v-flex>' +
	  '</v-layout>' +
	  '</v-flex>' + 
	  '<v-flex class="hidden-sm-and-down" md3>' +
	  	'<v-card class="capitulo-panel-derecha" style="margin:10px" >' +
	  	'<h3 style="text-align:center;padding:10px;">También te puede interesar</h3>' +
		  	'<div v-if="relacionados.length==0" style="width:100%;text-align:center">'+
		  		'<v-progress-circular mx-auto indeterminate ></v-progress-circular>'+
			'</div>'+
			'<v-flex v-if="relacionados.length>0"  v-for="(rel,i) in relacionados" :key="i" xs12>' +
			  '<v-card style="margin:10px" raised hover :href="\'#/capitulo/\' + rel.numero" >' +
				'<v-card-media v-if="rel.imagen!=null" :src="\'imagenes/\' + rel.imagen" height="50px">' +
				'</v-card-media>' +
				'<v-card-title primary-title>' +
				  '<div>' +
					'<h3 class="title mb-0" style="font-size:16px!important">{{rel.nombre}}</h3>' +
					'<div>{{capitulo.fecha}}</div>' +
				  '</div>' +
				'</v-card-title>' +
			  '</v-card>' +
			'</v-flex>' +
		'</v-card>' + 
	  '</v-flex>' +
	'</v-layout>' +
	'</div>' ,
	data () {
	      return { capitulo:{},relacionados:[],basepath:'../bso-radio/'}
	},
	mounted() {
			const idCapitulo=this.$route.params.id;
	        Vue.http.get("api/capitulos.php?c=" + idCapitulo).then(result => {
	            result.json().then(capitulo =>{
	            	this.capitulo = capitulo;
	            });
	        }, error => {
	            console.error(error);
	        });
	        Vue.http.get("api/capitulos.php?r=" + idCapitulo).then(result => {
	        	result.json().then(relacionados =>{
	        		this.relacionados = relacionados;
	        	});
	        }, error => {
	        	console.error(error);
	        });
	}
}