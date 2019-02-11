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
					 '<v-btn ripple color="cyan" dark :href="\'#/texto-editor/new\'">'+
						'<v-icon color="white">add</v-icon>Agregar Texto'+
					 '</v-btn>'+ 
					 '<v-card v-if="textos.length>0" v-for="(tex,i) in textos" :key="i" style="margin-bottom:10px">' + 
						'<v-container fluid grid-list-lg>' + 
						'<v-layout row wrap>' + 
						  '<v-flex xs12 sm5>' + 
							 '<v-img :src="basepath + \'imagenes/\' + tex.imagen" height="250px" style="border-radius:10px" class="grey lighten-2">' + 
						  		'<v-layout slot="placeholder" fill-height align-center justify-center ma-0>' + 
						  			'<v-progress-circular indeterminate color="teal"></v-progress-circular>' +
						  		'</v-layout>' +
						  	'</v-img>' + 
						  '</v-flex>' + 
						  '<v-flex xs12 sm7>' + 
							'<div>' + 
							  '<div class="headline text--lighten-1 teal--text">{{getTitulo(tex)}}</div>' + 
							  '<div class="text--lighten-1 teal--text" >{{tex.subtitulo}}</div>' + 
							  '<div class="escrito-resenia-texto" v-html="tex.resenia"></div>' + 
							  '<div class="escrito-resenia-autor">Por {{tex.autor}}</div>' + 
							'</div>' + 
							'<v-card-actions>' + 
								'<v-btn small color="cyan" dark :href="\'#/texto/\' + tex.id">Leer Más</v-btn>' + 
								'<v-btn icon ripple color="blue" dark :href="\'#/texto-editor/\' + tex.id">'+
											'<v-icon color="white">edit</v-icon>'+
								'</v-btn>'+
								'<v-btn icon ripple color="red" dark>'+
										'<v-icon color="white">delete</v-icon>'+
								'</v-btn>'+
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
					 '</div>' ,
 data () {
		return { textos:[],basepath:'../bso-radio/',pagina:0,totalPaginas:0}
 },
 created: function() {
		let pag=this.$route.params.pagina;
		if (pag!=null){
			this.pagina=parseInt(pag);
		}
		else{
			this.pagina=1;
		}
     },
	 methods:{
		getTitulo(texto){
			if (texto==null){return};
			let titulo=texto.titulo;
			if (texto.seccion!=null)
			{
				titulo=texto.seccion + ": " + titulo;
			}
			return titulo;
		},
		getPagina(){
			this.textos = new Array();
			window.history.pushState(null,'', '#/bso-escribe/' + this.pagina);
			Vue.http.get("api/textos.php?p=" + this.pagina + "&tp=" + this.totalPaginas).then(result => {
	            result.json().then(res=>{
	            	this.textos = res.textos;
	            	if (res.paginas!=null){
	            		this.totalPaginas = res.paginas; 
	            	}
	            });
	        }, error => {
	            console.error(error);
	        });
		}
	},
	watch:{
		pagina: function(val){
			this.getPagina();
		}
	}
}