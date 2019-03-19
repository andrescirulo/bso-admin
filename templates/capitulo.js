const Capitulo = { template: '<div>'+
		'<v-layout row>' + 
		'<v-flex xs12 md9>' +
		'<div v-if="capitulo==null" style="width:100%;text-align:center">'+
			'<v-progress-circular mx-auto indeterminate ></v-progress-circular>'+
		'</div>'+
		'<v-layout v-if="capitulo!=null">' +
		'<v-flex xs12>' +
		  '<v-card style="margin:10px" >' +
			'<v-img v-if="capitulo.imagen!=null" :src="basepath + \'imagenes/\' + capitulo.imagen" height="400px" class="grey lighten-2">' + 
		  		'<v-layout slot="placeholder" fill-height align-center justify-center ma-0>' + 
		  			'<v-progress-circular indeterminate color="teal"></v-progress-circular>' +
		  		'</v-layout>' +
		  	'</v-img>' +
			'<v-card-title primary-title>' +
			  '<div style="width:100%">' +
				'<h3 class="headline mb-0">{{capitulo.titulo}}</h3>' +
				'<iframe v-if="capitulo.linkMixcloud!=null" width="100%" height="60" :src="getSrcMixcloud(capitulo.linkMixcloud)" frameborder="0" ></iframe>' +
				'<iframe v-if="capitulo.linkIvoox!=null && capitulo.linkMixcloud==null" width="100%" height="110" frameborder="0" allowfullscreen="" scrolling="no" :src="getSrcIvoox(capitulo.linkIvoox)"></iframe>' + 
				'<div v-html="capitulo.texto"></div>' +
			  '</div>' +
			'</v-card-title>' +
			'<v-card-actions>' +
			  '<v-btn v-if="capitulo.linkMixcloud!=null" color="teal lighten-1" dark :href="capitulo.linkMixcloud" target="_blank">Escuchar en Mixcloud</v-btn>' +
			  '<v-btn v-if="capitulo.linkIvoox!=null" color="teal lighten-1" dark :href="capitulo.linkIvoox" target="_blank">Escuchar en Ivoox</v-btn>' +
			  '<v-btn color="teal lighten-1" dark :href="capitulo.linkDescargar" target="_blank">Descargar</v-btn>' +
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
				'<v-img v-if="rel.imagen!=null" :src="basepath + \'imagenes/\' + rel.imagen" height="50px">' +
					'<v-layout slot="placeholder" fill-height align-center justify-center ma-0>' + 
		  				'<v-progress-circular indeterminate color="teal"></v-progress-circular>' +
		  			'</v-layout>' +
				'</v-img>' +
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
	created() {
			const idCapitulo=this.$route.params.id;
	        Vue.http.get("api/capitulos.php?c=" + idCapitulo).then(result => {
	            result.json().then(capitulo =>{
	            	this.capitulo = capitulo;
	            	this.addMetaData();
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
	},
	methods:{
		getSrcMixcloud: function(link){
			return 'https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=' + link.replace('https://www.mixcloud.com','');
		},
		getSrcIvoox: function(link){
			return link.replace('https://ar.ivoox.com/es/','https://ar.ivoox.com/es/player_ej_') + '_2_1.html';
		},
		addMetaData: function(){
			var meta = document.createElement('meta');
			meta.name = "og:url";
			meta.content = "http://www.bsoradio.com.ar/capitulo/" + this.capitulo.numero;
			document.getElementsByTagName('head')[0].appendChild(meta);
		}
	}
}