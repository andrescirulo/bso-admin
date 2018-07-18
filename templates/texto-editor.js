const TextoEditor = { template: '<div>'+
		'<v-layout row>' + 
		'<v-flex xs12>' +
		'<div v-if="texto==null" style="width:100%;text-align:center">'+
			'<v-progress-circular mx-auto indeterminate ></v-progress-circular>'+
		'</div>'+
		'<v-layout v-if="texto!=null">' +
		'<v-flex xs12>' +
			'<v-card style="margin:10px;padding:10px" >' +
				'<h2 v-if="!texto.editando">Nuevo Texto</h2>' + 
				'<h2 v-if="texto.editando">Editando texto</h2>' + 
				'<v-form ref="form" lazy-validation>' + 
					'<v-text-field v-model="texto.titulo" :counter="100" label="Título" required></v-text-field>' +
					'<v-text-field v-model="texto.subtitulo" :counter="150" label="Subtítulo" required></v-text-field>' +
					'<v-text-field v-model="texto.autor" :counter="50" label="Autor" required></v-text-field>' +
					'<v-text-field class="textarea-label" v-model="texto.resenia" multi-line :counter="1000" label="Reseña" required></v-text-field>' +
					'<v-dialog ref="dialog" v-model="modal" :return-value.sync="texto.fecha" persistent lazy full-width width="290px" >' +
						'<v-text-field class="fecha-picker" slot="activator" v-model="texto.fecha" label="Fecha" readonly></v-text-field>' +
						'<v-date-picker v-model="texto.fecha" scrollable>' +
							'<v-spacer></v-spacer>' +
							'<v-btn flat color="primary" @click="modal = false">Cancelar</v-btn>' +
							'<v-btn flat color="primary" @click="$refs.dialog.save(texto.fecha)">OK</v-btn>' +
						'</v-date-picker>' +
					'</v-dialog>' +
					'<vue-editor v-model="texto.texto"></vue-editor>' + 
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
					'<v-btn color="green" dark v-if="texto.publico!=null && texto.publico==0" v-on:click="onPublicar()">' +
						'<v-icon color="white" >public</v-icon>'+
						'Publicar' +
					'</v-btn>' +
					'<v-btn color="orange" dark v-if="texto.publico!=null && texto.publico==1" v-on:click="onPublicar()">' +
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
	      return { texto:{},modal: false}
	},
	mounted() {
			const idTexto=this.$route.params.id;

			if (idTexto == 'new' ){
				this.texto={};
				this.texto.editando=false;
			}
			else{
				this.editando=true;
				Vue.http.get("api/textos.php?t=" + idTexto).then(result => {
						result.json().then(texto =>{
							this.texto = texto;
							this.texto.editando=true;
						});
				}, error => {
						console.error(error);
				});
			}
	},
	methods: {
		 onGuardar(){
			Vue.http.post("api/textos.php",this.texto).then(result => {
					result.json().then(texto =>{
						this.texto = texto;
						router.push({ path: '/bso-escribe' });
					});
			}, error => {
					console.error(error);
			});
		 },
		 onPublicar(){
			 let op = new Object();
			 op.operacion="PUBLICAR";
			 op.texto=this.texto.id;
			 op.publico=this.texto.publico==1?0:1;
			Vue.http.post("api/textos.php",op).then(result => {
					result.json().then(res =>{
						if (res.respuesta=="OK"){
							this.texto.publico=op.publico;
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