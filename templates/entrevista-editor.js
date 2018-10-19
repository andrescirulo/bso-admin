const EntrevistaEditor = { template: '<div>'+
		'<v-layout row>' + 
			'<v-flex xs12>' +
				'<v-alert v-for="(err,e) in errores" :key="e" :value="true" type="error" dismissible>' +
				'{{err}}' + 
				'</v-alert>'+
			'</v-flex>' +
		'</v-layout>' + 
		'<v-layout row>' + 
		'<v-flex xs12>' +
		'<div v-if="entrevista==null" style="width:100%;text-align:center">'+
			'<v-progress-circular mx-auto indeterminate ></v-progress-circular>'+
		'</div>'+
		'<v-layout v-if="entrevista!=null">' +
		'<v-flex xs12>' +
			'<v-card style="margin:10px;padding:10px" >' +
				'<h2 v-if="!entrevista.editando">Nueva Entrevista</h2>' + 
				'<h2 v-if="entrevista.editando">Editando entrevista</h2>' + 
				'<v-form ref="form" lazy-validation>' + 
					'<v-text-field v-model="entrevista.titulo" :counter="50" label="Título" required></v-text-field>' +
					'<v-text-field v-model="entrevista.autor" :counter="100" label="Autor" required></v-text-field>' +
					'<v-text-field class="textarea-label" v-model="entrevista.texto" multi-line :counter="1000" label="Texto" required></v-text-field>' +
					'<v-dialog ref="dialog" v-model="modal" :return-value.sync="entrevista.fecha" persistent lazy full-width width="290px" >' +
						'<v-text-field class="fecha-picker" slot="activator" v-model="entrevista.fecha" label="Fecha" readonly></v-text-field>' +
						'<v-date-picker v-model="entrevista.fecha" scrollable>' +
							'<v-spacer></v-spacer>' +
							'<v-btn flat color="primary" @click="modal = false">Cancelar</v-btn>' +
							'<v-btn flat color="primary" @click="$refs.dialog.save(entrevista.fecha)">OK</v-btn>' +
						'</v-date-picker>' +
					'</v-dialog>' +
					'<v-text-field v-model="entrevista.link" :counter="100" label="Link para Escuchar" required></v-text-field>' +
					'<v-text-field type="file" label="Imagen" required></v-text-field>' +
				'</v-form>' +
				'<v-card-actions style="justify-content: flex-end;">' +
					'<v-btn color="red" dark >' +
						'<v-icon color="white">delete</v-icon>'+
						'Eliminar' +
					'</v-btn>' +
					'<v-btn color="blue" dark v-on:click="onGuardar()">' +
						'<v-icon color="white">save</v-icon>'+
						'Guardar' +
					'</v-btn>' +
					'<v-btn color="green" dark v-if="entrevista.publico!=null && entrevista.publico==0" v-on:click="onPublicar()">' +
						'<v-icon color="white" >public</v-icon>'+
						'Publicar' +
					'</v-btn>' +
					'<v-btn color="orange" dark v-if="entrevista.publico!=null && entrevista.publico==1" v-on:click="onPublicar()">' +
						'<v-icon color="white" >public</v-icon>'+
						'Des(?)Publicar' +
					'</v-btn>' +
				'</v-card-actions>' +
			'</v-card>' +
		'</v-flex>' +
	  '</v-layout>' +
	  '</v-flex>' + 
	'</v-layout>' +
	'</div>' ,
	data () {
	      return { entrevista:{},modal: false,errores:[]}
	},
	mounted() {
			const idEntrevista=this.$route.params.id;

			if (idEntrevista == 'new' ){
				this.entrevista={};
				this.entrevista.editando=false;
			}
			else{
				this.editando=true;
				Vue.http.get("api/entrevistas.php?e=" + idEntrevista).then(result => {
						result.json().then(entrevista =>{
							this.entrevista = entrevista;
							this.entrevista.editando=true;
						});
				}, error => {
						console.error(error);
				});
			}
	},
	methods: {
		validar(){
			 this.errores=[];
			 if (this.entrevista.titulo==null){
				 this.errores.push('El titulo de la entrevista es obligatorio');
			 }
			 if (this.entrevista.autor==null){
				 this.errores.push('El autor de la entrevista es obligatorio');
			 }
			 if (this.entrevista.fecha==null){
				 this.errores.push('La fecha de la entrevista es obligatoria');
			 }
			 if (this.entrevista.texto==null){
				 this.errores.push('El texto de la entrevista es obligatorio');
			 }
			 if (this.entrevista.link==null){
				 this.errores.push('El link de la entrevista es obligatorio');
			 }
			 return this.errores.length==0;
		 },
		 onGuardar(){
			if (!this.validar()){
				scrollToTop();
				return;
			}
			Vue.http.post("api/entrevistas.php",this.entrevista).then(result => {
					result.json().then(entrevista =>{
						this.entrevista = entrevista;
						router.push({ path: '/bso-escucha' });
					});
			}, error => {
					console.error(error);
			});
		 },
		 onPublicar(){
			 let op = new Object();
			 op.operacion="PUBLICAR";
			 op.entrevista=this.entrevista.id;
			 op.publico=this.entrevista.publico==1?0:1;
			Vue.http.post("api/entrevistas.php",op).then(result => {
					result.json().then(res =>{
						if (res.respuesta=="OK"){
							this.entrevista.publico=op.publico;
						}
						else{
							console.error("PUM!" + res);
						}
					});
			}, error => {
				console.error(error);
			});
		 }
	}
}