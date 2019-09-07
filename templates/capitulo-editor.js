const CapituloEditor = { template: '<div>'+
		'<v-layout row>' + 
			'<v-flex xs12>' +
				'<v-alert v-for="(err,e) in errores" :key="e" :value="true" type="error" dismissible>' +
				'{{err}}' + 
				'</v-alert>'+
			'</v-flex>' +
		'</v-layout>' + 
		'<v-layout row>' + 
		'<v-flex xs12>' +
		'<div v-if="capitulo==null" style="width:100%;text-align:center">'+
			'<v-progress-circular mx-auto indeterminate ></v-progress-circular>'+
		'</div>'+
		'<v-layout v-if="capitulo!=null">' +
		'<v-flex xs12>' +
			'<v-card style="margin:10px;padding:10px" >' +
				'<h2 v-if="!capitulo.editando">Nuevo Capítulo</h2>' + 
				'<h2 v-if="capitulo.editando">Editando capítulo</h2>' + 
				'<v-form ref="form" lazy-validation>' + 
					'<v-text-field v-model="capitulo.numero" :key="tmpCap" type="number" disabled="disabled" label="Número" required></v-text-field>' +
					'<v-select :items="temporadas" item-text="descripcion" item-value="num" v-model="capitulo.temporada" label="Temporada" v-on:change="onTemporadaSelected($event)" required></v-select>' + 
					'<v-text-field v-model="capitulo.nombre" :counter="50" label="Nombre" required></v-text-field>' +
					'<v-text-field v-model="capitulo.titulo" :counter="50" label="Titulo" required></v-text-field>' +
					'<v-textarea class="textarea-label" v-model="capitulo.texto" multi-line :counter="1000" label="Texto" required></v-textarea>' +
					'<v-dialog ref="dialog" v-model="modal" :return-value.sync="capitulo.fecha" persistent lazy full-width width="290px" >' +
						'<v-text-field class="fecha-picker" slot="activator" v-model="capitulo.fecha" label="Fecha" readonly></v-text-field>' +
						'<v-date-picker v-model="capitulo.fecha" scrollable>' +
							'<v-spacer></v-spacer>' +
							'<v-btn flat color="primary" @click="modal = false">Cancelar</v-btn>' +
							'<v-btn flat color="primary" @click="$refs.dialog.save(capitulo.fecha)">OK</v-btn>' +
						'</v-date-picker>' +
					'</v-dialog>' +
					'<v-text-field v-model="capitulo.linkSpotify" :counter="300" label="Link de Spotify" required></v-text-field>' +
					'<v-text-field v-model="capitulo.linkDescargar" :counter="300" label="Link para Descargar" required></v-text-field>' +
					'<v-text-field v-model="capitulo.linkIvoox" :counter="300" label="Link de Ivoox" required></v-text-field>' +
					'<v-text-field style="margin-bottom:20px" v-model="capitulo.linkMixcloud" :counter="300" label="Link de Mixcloud" required hint="Link del capitulo. Ej: https://www.mixcloud.com/bsoradio/spinoff-04-captain-marvel-2019/" persistent-hint></v-text-field>' +
					'<image-uploader v-bind:idElem="capitulo.numero" v-bind:tipo="\'CAPITULO\'" v-bind:path="\'capitulos\'" v-bind:imagenUrl="capitulo.imagen"></image-uploader>' +
				'</v-form>' +
				'<v-card-actions style="justify-content: flex-end;">' +
					'<v-btn color="red" dark v-if="capitulo.editando" v-on:click="onEliminar()">' +
						'<v-icon color="white">delete</v-icon>'+
						'Eliminar' +
					'</v-btn>' +
					'<v-btn color="blue" dark v-on:click="onGuardar()">' +
						'<v-icon color="white">save</v-icon>'+
						'Guardar' +
					'</v-btn>' +
					'<v-btn color="green" dark v-if="capitulo.publico!=null && capitulo.publico==0" v-on:click="onPublicar()">' +
						'<v-icon color="white" >public</v-icon>'+
						'Publicar' +
					'</v-btn>' +
					'<v-btn color="orange" dark v-if="capitulo.publico!=null && capitulo.publico==1" v-on:click="onPublicar()">' +
						'<v-icon color="white" >public</v-icon>'+
						'Des(?)Publicar' +
					'</v-btn>' +
				'</v-card-actions>' +
			'</v-card>' +
		'</v-flex>' +
	  '</v-layout>' +
	  
	  '<v-dialog v-model="dialog" max-width="350">' +
      	'<v-card>' +
      		'<v-card-title class="headline">Confirmar Eliminación</v-card-title>' +
      		'<v-card-text>' +
      			'¿Estás seguro que queres eliminar el capitulo? Esta acción no se puede deshacer.' +
      		'</v-card-text>' +
      		'<v-card-actions>' +
      			'<v-btn class="secondary" @click="dialog = false">No</v-btn>' +
      			'<v-btn class="primary" @click="dialog = false">Si</v-btn>' +
      		'</v-card-actions>' +
      	'</v-card>' +
      '</v-dialog>' +
	  
	  '</v-flex>' + 
	'</v-layout>' +
	'</div>' ,
	data () {
	      return { capitulo:{},
	    	  temporadas:[
	    		  {num:8,descripcion:'Temporada 8'},
		    	  {num:7,descripcion:'Temporada 7'},
		    	  {num:6,descripcion:'Temporada 6'},
		    	  {num:5,descripcion:'Temporada 5'},
		    	  {num:4,descripcion:'Temporada 4'},
		    	  {num:3,descripcion:'Temporada 3'},
		    	  {num:2,descripcion:'Temporada 2'},
		    	  {num:1,descripcion:'Temporada 1'},
		    	  {num:0,descripcion:'Spinoff!'}],
	    	  modal: false,errores:[],dialog:false,tmpCap:null}
	},
	mounted() {
			const idCapitulo=this.$route.params.id;

			if (idCapitulo == 'new' ){
				this.capitulo={};
				this.capitulo.editando=false;
			}
			else{
				this.editando=true;
				Vue.http.get("api/capitulos.php?c=" + idCapitulo).then(result => {
						result.json().then(capitulo =>{
							this.capitulo = capitulo;
							this.capitulo.temporada=parseInt(this.capitulo.temporada);
							this.capitulo.editando=true;
						});
				}, error => {
						console.error(error);
				});
			}
	},
	methods: {
		 validar(){
			 this.errores=[];
			 if (this.capitulo.numero==null){
				 this.errores.push('El número del capitulo es obligatorio');
			 }
			 if (this.capitulo.temporada==null){
				 this.errores.push('La temporada del capitulo es obligatoria');
			 }
			 if (this.capitulo.nombre==null){
				 this.errores.push('El nombre del capitulo es obligatorio');
			 }
			 if (this.capitulo.texto==null){
				 this.errores.push('El texto del capitulo es obligatorio');
			 }
			 if (this.capitulo.linkDescargar==null){
				 this.errores.push('El link para descargar es obligatorio');
			 }
			 return this.errores.length==0;
		 },
		 onTemporadaSelected: function (valor){
			if (this.capitulo.editando == false){
				Vue.http.get("api/capitulos.php?tn=" + valor).then(result => {
					result.json().then(resp =>{
						this.capitulo.numero = resp.num;
						this.tmpCap = resp.num;
					});
				}, error => {
					console.error(error);
				});
			}
		 },
		 onGuardar(){
			if (!this.validar()){
				scrollToTop();
				return;
			}
			this.capitulo.linkSpotify=this.normalizarVacio(this.capitulo.linkSpotify);
			this.capitulo.linkIvoox=this.normalizarVacio(this.capitulo.linkIvoox);
			this.capitulo.linkMixcloud=this.normalizarVacio(this.capitulo.linkMixcloud);
			this.capitulo.linkDescargar=this.normalizarVacio(this.capitulo.linkDescargar);
			Vue.http.post("api/capitulos.php",this.capitulo).then(result => {
					result.json().then(capitulo =>{
						this.capitulo = capitulo;
						router.push({ path: '/temporadas' });
					});
			}, error => {
					console.error(error);
			});
		 },
		 normalizarVacio(link){
			if (link==null){return null;};
			if (link.trim().length==0){return null;};
			return link;
		 },
		 onPublicar(){
			let op = new Object();
			op.operacion="PUBLICAR";
			op.capitulo=this.capitulo.numero;
			op.publico=this.capitulo.publico==1?0:1;
			Vue.http.post("api/capitulos.php",op).then(result => {
					result.json().then(res =>{
						if (res.respuesta=="OK"){
							this.capitulo.publico=op.publico;
						}
						else{
							console.error("PUM!" + res);
						}
					});
			}, error => {
				console.error(error);
			});
		 },
		 onEliminar(){
			 this.dialog=true;
		 }
	},
//	watch: {
//		tmpCap: function (val) {
//	    	this.capitulo.numero = this.tmpCap;
//		}
//	}
}