const Texto = { template: '<div>'+
		'<v-layout row>' + 
		'<v-flex xs12>' +
		'<div v-if="texto==null" style="width:100%;text-align:center">'+
			'<v-progress-circular mx-auto indeterminate ></v-progress-circular>'+
		'</div>'+
		'<v-layout v-if="texto!=null">' +
		'<v-flex xs12>' +
		  '<v-card >' +
			'<v-img v-if="texto.imagen!=null" :src="basepath + \'imagenes/\' + texto.imagen" :height="getImgHeight()" class="grey lighten-2">' + 
		  		'<v-layout slot="placeholder" fill-height align-center justify-center ma-0>' + 
		  			'<v-progress-circular indeterminate color="teal"></v-progress-circular>' +
		  		'</v-layout>' +
		  	'</v-img>' +
			'<v-card-title primary-title>' +
			'<v-layout row>' + 
			'<v-flex xs12 sm10 lg8 offset-sm1 offset-lg2>' +
			  '<div>' +
				'<h3 class="headline mb-0 teal--text text--darken-4">{{texto.titulo}}</h3>' +
				'<h3 class="title mb-0 teal--text text--darken-1" style="font-size:18px!important">{{texto.subtitulo}}</h3>' +
				'<h3 class="subheading mb-0 autor-texto teal--text">Por {{texto.autor}}</h3>' +
				'<div class="contenido-texto" v-html="texto.texto" style="text-align: justify;"></div>' +
				'<div style="width:100%;text-align:center">' +
					'<v-btn small color="teal lighten-1" dark @click="volver()">Volver</v-btn>' +
				'</div>' +
			  '</div>' +
			  '</v-flex>' +
			  '</v-layout>' + 
			'</v-card-title>' +
		  '</v-card>' +
		'</v-flex>' +
	  '</v-layout>' +
	  '</v-flex>' + 
	'</v-layout>' +
	'</div>' ,
	data () {
	      return { texto:null,basepath:'../bso-radio/'}
	},
	mounted() {
			const idTexto=this.$route.params.id;
	        Vue.http.get("api/textos.php?t=" + idTexto).then(result => {
	            result.json().then(texto =>{
	            	this.texto = texto;
	            });
	        }, error => {
	            console.error(error);
	        });
	},
	methods:{
		getImgHeight:function(){
			if (this.$vuetify.breakpoint.xs){
				return "200px";
			}
			return "400px";
		},
		volver: function(){
			this.texto=null;
			this.$router.go(-1);
		}
	}
}