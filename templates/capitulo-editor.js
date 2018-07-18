const CapituloEditor = { template: '<div>'+
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
					'<v-text-field v-model="capitulo.numero" type="number" label="Número" required></v-text-field>' +
					'<v-select :items="temporadas" v-model="capitulo.temporada" label="Temporada" required></v-select>' + 
					'<v-text-field v-model="capitulo.nombre" :counter="50" label="Nombre" required></v-text-field>' +
					'<v-text-field class="textarea-label" v-model="capitulo.texto" multi-line :counter="1000" label="Texto" required></v-text-field>' +
					'<v-dialog ref="dialog" v-model="modal" :return-value.sync="capitulo.fecha" persistent lazy full-width width="290px" >' +
						'<v-text-field class="fecha-picker" slot="activator" v-model="capitulo.fecha" label="Fecha" readonly></v-text-field>' +
						'<v-date-picker v-model="capitulo.fecha" scrollable>' +
							'<v-spacer></v-spacer>' +
							'<v-btn flat color="primary" @click="modal = false">Cancelar</v-btn>' +
							'<v-btn flat color="primary" @click="$refs.dialog.save(capitulo.fecha)">OK</v-btn>' +
						'</v-date-picker>' +
					'</v-dialog>' +
					'<v-text-field v-model="capitulo.linkDescargar" :counter="100" label="Link para Descargar" required></v-text-field>' +
					'<v-text-field v-model="capitulo.linkEscuchar" :counter="100" label="Link para Escuchar" required></v-text-field>' +
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
	  '</v-flex>' + 
	'</v-layout>' +
	'</div>' ,
	data () {
	      return { capitulo:{},temporadas:['7','6','5','4','3','2','1'],modal: false}
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
							this.capitulo.editando=true;
						});
				}, error => {
						console.error(error);
				});
			}
	},
	methods: {
		 onGuardar(){
			Vue.http.post("api/capitulos.php",this.capitulo).then(result => {
					result.json().then(capitulo =>{
						this.capitulo = capitulo;
						router.push({ path: '/temporadas' });
					});
			}, error => {
					console.error(error);
			});
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
		 }
	}
}