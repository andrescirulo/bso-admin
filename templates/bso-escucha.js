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
	 '<v-btn ripple color="cyan" dark :href="\'#/entrevista-editor/new\'">'+
	 	'<v-icon color="white">add</v-icon>Agregar Entrevista'+
	 '</v-btn>'+ 
	 '<v-card v-if="entrevistas.length>0" v-for="(entrev,i) in entrevistas" :key="i" style="margin-bottom:10px">' + 
		'<v-container fluid grid-list-lg>' + 
		'<v-layout row wrap>' + 
		  '<v-flex xs12 sm5>' + 
		  	'<v-img :src="basepath + \'imagenes/\' + entrev.imagen" height="250px" style="border-radius:10px" class="grey lighten-2">' + 
		  		'<v-layout slot="placeholder" fill-height align-center justify-center ma-0>' + 
		  			'<v-progress-circular indeterminate color="teal"></v-progress-circular>' +
		  		'</v-layout>' +
		  	'</v-img>' +
		  '</v-flex>' + 
		  '<v-flex xs12 sm7>' + 
			'<div style="margin-bottom:10px">' + 
			  '<div class="headline text--lighten-1 teal--text">{{entrev.titulo}}</div>' + 
				'<div class="entrevista-texto" v-html="entrev.texto"></div>' +
				'<div class="entrevista-autor">Por {{entrev.autor}}</div>' +  
			'</div>' + 
			'<v-card-actions>' +
			'<iframe v-if="entrev.ivoox!=null" width="238" height="48" frameborder="0" allowfullscreen="" scrolling="no" :src="\'https://ar.ivoox.com/es/player_ek_\' + entrev.ivoox + \'_2_1.html\'"></iframe>' +
			'<v-btn v-if="entrev.ivoox==null" :href="entrev.link" target="blank" color="red" dark>Ver en Youtube</v-btn>' +
				'<v-btn icon ripple color="blue" dark :href="\'#/entrevista-editor/\' + entrev.id">'+
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
	return { entrevistas:[],basepath:'../bso-radio/',pagina:0,totalPaginas:0}
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
		this.entrevistas= new Array();
		window.history.pushState(null,'', '#/bso-escucha/' + this.pagina);
		Vue.http.get("api/entrevistas.php?p=" + this.pagina + "&tp=" + this.totalPaginas).then(result => {
		          result.json().then(res =>{
		          	this.entrevistas = res.entrevistas;
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