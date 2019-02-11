/**
 * 
 */
Vue.component('image-uploader',{
	props: ['idElem','tipo','path','imagenUrl'],
	template: '<v-container fluid >' + 
		'<v-layout row wrap>' + 
			'<v-flex xs12 d-flex class="foto-load-container" style="border: 1px solid orange;" >' +
				'<label  :for="\'file-input-\' + tipo" class="input-label">' + 
					'<div v-if="imgLocalUrl==null && !subiendo" style="height:50px;margin-top: 10px;margin-bottom: 10px;">' + 
						'<div class="btn-cargar-foto">Cargar Imagen</div>' + 
						'<v-icon color="orange" large>insert_photo</v-icon>' +
					'</div>' + 
					'<v-img v-if="imgLocalUrl!=null" :src="basepath + \'imagenes/\' + imgLocalUrl"> ' +
					'</v-img> ' +
					'<v-progress-linear v-if="subiendo" color="orange" :value="progresoSubida">{{ progresoSubida }}%</v-progress-linear>' +
					'<input type="file" :id="\'file-input-\' + tipo" v-on:change="subirFoto"></input>' + 
				'</label>' +
			'</v-flex>' +
		'</v-layout>' + 
		'<v-snackbar class="perfil-snackbar" :top="true" v-model="snackbar" :color="messageColor" multi-line  :timeout="5000">' +
			'<span v-html="getMensajes()"></span>' + 
			'<v-btn dark flat @click="snackbar = false" >Cerrar</v-btn>' +
		'</v-snackbar>' +
		'</v-container>',
	data () {
	      return {
	    	  subiendo:false,
	    	  progresoSubida:0,
	    	  snackbar:false,
	    	  messageColor:'error',
	    	  mensajes:[],
	    	  imgLocalUrl:null,
	    	  basepath:'../bso-radio/'}
	},
	mounted(){
	},
	methods:{
			getMensajes: function(){
				return this.mensajes.join("<br/>");
			},
			clearMessages: function(){
				this.mensajes.splice(0,this.mensajes.length);
			},
			subirFoto: function(e){
				this.snackbar=false;
				this.clearMessages();
				//ME FIJO QUE NO HAYA ERRORES EN EL ARCHIVO A SUBIR
				var inputFoto = document.getElementById('file-input-' + this.tipo);
				let archivo = inputFoto.files[0];
				let nomArch = archivo.name.toLowerCase();
				if ((nomArch.indexOf('.jpg', nomArch.length - 4) == -1) && (nomArch.indexOf('.png', nomArch.length - 4) == -1)){
					this.mensajes.push('La extension tiene que ser jpg o png');
				}
				if (archivo.size>=(5*1024*1024)){
					this.mensajes.push('El tamaño del archivo no puede superar los 5MB');
				}
				if (this.mensajes.length>0){
					this.messageColor='error';
					this.snackbar=true;
					inputFoto.value = "";
					return;
				}
				this.progresoSubida=0;
				this.subiendo=true;
				this.imgLocalUrl=null;
				//SI ESTA TODO BIEN, LO SUBO
				// var vFD = new FormData(document.getElementById('upload_form'));
				var vFD = new FormData();
				vFD.append('file',archivo);
				vFD.append('tipo',this.tipo);
				vFD.append('id',this.idElem);
				vFD.append('path',this.path);
	   			var oXHR = new XMLHttpRequest();
	    		oXHR.upload.addEventListener('progress', this.uploadProgress, false);
	    		oXHR.addEventListener('load', this.uploadFinish, false);
	    		oXHR.addEventListener('error', this.uploadError, false);
			    oXHR.addEventListener('abort', this.uploadAbort, false);
	    		oXHR.open('POST', 'api/foto-upload.php');
	    		oXHR.send(vFD);
			},
			uploadProgress:function(e){
				if (e.lengthComputable) {
					//var iPercentComplete = Math.round(e.loaded * 100 / e.total);
					var iPercentComplete = e.loaded * 100 / e.total;
					this.progresoSubida=iPercentComplete;
				} else {
					//document.getElementById('progress').innerHTML = 'unable to compute';
				}
			},
			uploadFinish:function(e) { // upload successfully finished
				this.subiendo=false;
				let response=JSON.parse(e.target.responseText);
				if (response.error==false){
					let rnd =Math.floor((Math.random() * 5000000) + 1);
					this.imgLocalUrl = response.archivo + '?rnd=' + rnd;
				}
			},
			uploadError:function (e) { // upload error
				this.clearMessages();
				this.mensajes.push('Error al subir el archivo');
				this.messageColor='error';
				this.snackbar=true;
			},
			uploadAbort:function (e) { // upload abort
				this.clearMessages();
				this.mensajes.push('Subida abortada');
				this.messageColor='error';
				this.snackbar=true;
			}
	},
	watch: {
	    imagenUrl: function (val) {
			this.imgLocalUrl=val;
		}
	}
});