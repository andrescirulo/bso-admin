Vue.component('cuaderno-zoom',{
	props: ['cuadernos','show','idx'],
	template: '<div class="img-overlay" v-if="zoom">' +
		'<div class="img-holder">' + 
			'<img :src="getImagenZoom()" class="img-img">' +
			'</img>' +
			'<a nohref="nohref" @click="cerrarZoom()" class="img-close">X</a>' + 
			'<a nohref="nohref" class="img-prev">' +
				'<v-icon @click="anteriorImagen()">chevron_left</v-icon>' + 
			'</a>' + 
			'<a nohref="nohref" class="img-next">' +
				'<v-icon @click="siguienteImagen()">chevron_right</v-icon>' + 
			'</a>' + 
		'</div>' +
	'</div>',
	data () {
		return { imagenZoomIdx:null,zoom:false}
    },
	methods:{
		cerrarZoom:function (index){
			reloadScrollBars();
			this.zoom=false;
			this.imagenZoomIdx=null;
			this.$root.$emit('zoom:off');
		},
		hacerZoom:function (index){
			this.imagenZoomIdx=this.idx;
			this.zoom=this.show;
			unloadScrollBars();
		},
		getImagenZoom(){
			if (this.imagenZoomIdx==null){return;}
			return 'imagenes/' + this.cuadernos[this.imagenZoomIdx].imagen;
		},
		siguienteImagen(){
			this.imagenZoomIdx++;
			if (this.imagenZoomIdx==this.cuadernos.length){
				this.imagenZoomIdx=0;
			}
		},
		anteriorImagen(){
			this.imagenZoomIdx--;
			if (this.imagenZoomIdx==-1){
				this.imagenZoomIdx=(this.cuadernos.length-1);
			}
		},
	},
	watch: {
		show: function (val) {
			if (val==true){
				this.hacerZoom();
			}
		}
	}
})