const Inicio = { template: '<div>'+
		'<v-layout row>' + 
		'<v-flex xs12 md9>' +
			'<div v-if="posts.length==0" style="width:100%;text-align:center">'+
				'<v-progress-circular mx-auto :size="70" :width="7" indeterminate color="green" ></v-progress-circular>'+
			'</div>'+
			'<v-card v-if="posts.length>=0" v-for="(post,i) in posts" :key="i" style="margin-bottom:10px">' + 
				'<v-container fluid grid-list-lg>' + 
				'<v-layout row wrap>' + 
				  '<v-flex xs12 sm5>' + 
					'<v-img :src="getImagen(post)" height="250px" style="border-radius:10px" class="grey lighten-2">' + 
				  		'<v-layout slot="placeholder" fill-height align-center justify-center ma-0>' + 
				  			'<v-progress-circular indeterminate color="teal"></v-progress-circular>' +
				  		'</v-layout>' +
				  	'</v-img>' + 
				  '</v-flex>' + 
				  '<v-flex xs12 sm7>' + 
					'<div>' + 
					  '<div v-if="post.seccion!=null" class="post-seccion">{{post.seccion}}</div>' + 
					  '<div class="headline post-titulo">{{post.titulo}}</div>' + 
					  '<div>{{getFecha(post)}}</div>' +
					  '<div class="post-texto" v-html="post.texto"></div>' + 
					'</div>' + 
					'<v-card-actions style="justify-content:space-between;padding:0px;margin-top: 10px;">' + 
						'<v-btn small v-if="post.tipo==\'CAPITULO\'" color="teal lighten-1" dark :href="\'#/capitulo/\' + post.id">Leer Más</v-btn>' + 
						'<v-btn small v-if="post.tipo==\'TEXTO\'" color="teal lighten-1" dark :href="\'#/texto/\' + post.id">Leer Más</v-btn>' + 
						'<v-btn small v-if="post.tipo==\'ENTREVISTA\'" color="teal lighten-1" dark :href="\'#/bso-escucha/1\'">Ver entrevistas</v-btn>' +
						'<v-chip class="v-btn--small" style="margin-top: 0px; margin-bottom: 0px;" label :color="getColorTag(post)" text-color="white">' +
				      		'<v-icon left>label</v-icon>{{getTextoTag(post)}}' +
				      	'</v-chip>' +
					'</v-card-actions>' + 
				  '</v-flex>' + 
				'</v-layout>' + 
		      '</v-container>' + 
		  '</v-card>' +
		  '<v-layout row wrap>' +
			  '<v-flex>' +
			  	'<v-pagination v-model="pagina" :length="totalPaginas" ></v-pagination>' +
			  '</v-flex>' + 
		  '</v-layout>' + 
	  '</v-flex>' + 
	  '<v-flex class="hidden-sm-and-down" md3>' +
	  	'<v-card class="inicio-panel-derecha" color="teal">' +
		'</v-card>' + 
	  '</v-flex>' +
	'</v-layout>' +
	'</div>' ,
	data () {
	      return { posts:[],pagina:0,totalPaginas:0,basepath:'../bso-radio/'}
	},
	created() {
		let pag=this.$route.params.pagina;
		if (pag!=null){
			this.pagina=parseInt(pag);
		}
		else{
			this.pagina=1;
		}
	},
	methods:{
		getPagina: function(){
			this.posts = new Array();
			window.history.pushState(null,'', '#/inicio/' + this.pagina);
			Vue.http.get("api/inicio.php?p=" + this.pagina + "&tp=" + this.totalPaginas).then(result => {
	            result.json().then(res=>{
	            	this.posts = res.posts;
	            	if (res.paginas!=null){
	            		this.totalPaginas = res.paginas; 
	            	}
	            });
	        }, error => {
	            console.error(error);
	        });
		},
		getImagen: function(post){
			if (post==null || post.imagen==null){
				return this.basepath + 'imagenes/default.jpg';
			}
			return this.basepath + 'imagenes/' + post.imagen;
		},
		getFecha: function (post){
			let fechaLim=dayjs().subtract(14, 'day');
			return dayjs(post.fecha).format('DD/MM/YYYY');
		},
		getColorTag:function(post){
			if (this.esNuevo(post)){
				return 'red';
			}
			if (post.tipo=="CAPITULO"){
				return 'green';
			}
			if (post.tipo=="TEXTO"){
				return 'purple';
			}
			if (post.tipo=="ENTREVISTA"){
				return 'orange';
			}
		},
		getTextoTag:function(post){
			let texto="";
			if (this.esNuevo(post)){
				texto = "¡NUEVO! ";
			}
			if (post.tipo=="CAPITULO"){
				texto+= "PROGRAMA";
			}
			if (post.tipo=="TEXTO"){
				texto+= "BSO-ESCRIBE";
			}
			if (post.tipo=="ENTREVISTA"){
				texto+= "BSO-ESCUCHA";
			}
			return texto;
		},
		esNuevo: function(post){
			if (post==null){return};
			let fechaLim=dayjs().subtract(14, 'day');
			let fechaPost=dayjs(post.fecha);
			return fechaPost.isAfter(fechaLim);
		}
	},
	watch:{
		pagina: function(val){
			this.getPagina();
		}
	}
}