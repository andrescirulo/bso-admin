const Temporadas = { template: '<div style="text-align:center">' + 
		'<v-progress-circular mx-auto :size="70" :width="7" indeterminate color="green" v-if="temporadas.length==0"></v-progress-circular>'+
		'<v-btn ripple color="cyan" dark :href="\'#/capitulo-editor/new\'">'+
			'<v-icon color="white">add</v-icon>Agregar Capítulo'+
		'</v-btn>'+ 
		'<v-expansion-panel v-if="temporadas.length>0" v-for="(temp,t) in temporadas" :key="t" style="margin-bottom:10px;">' + 
			'<v-expansion-panel-content @input="onOpenOrClose(temp)" class="panel-temporada-content">'+
			'<div slot="header" inset class="headline text--lighten-1 teal--text" style="padding-left:5px;">{{temp.descripcion}} ({{temp.anio}})</div>'+
			'<v-progress-circular mx-auto :size="70" :width="7" indeterminate color="green" v-if="temp.capitulos==null"></v-progress-circular>'+
			'<v-list v-if="temp.capitulos!=null">' + 
				'<template v-for="(capitulo,c) in temp.capitulos" >' + 
				'<v-list-tile avatar :key="c">'+
					'<v-list-tile-content style="padding-left:25px" v-on:click="irACapitulo(capitulo)">'+
					  '<v-list-tile-title>{{capitulo.numero}} - {{ capitulo.nombre }}</v-list-tile-title>'+
					  '<v-list-tile-sub-title>{{ capitulo.fecha }}</v-list-tile-sub-title>'+
					'</v-list-tile-content>'+
					'<v-list-tile-action>'+
					
					'<v-speed-dial v-model="fab[capitulo.numero]" style="right:0px!important;" :direction="\'left\'" :transition="\'slide-x-reverse-transition\'">' +
					    '<template v-slot:activator >' +
					      '<v-btn v-model="fab[capitulo.numero]" style="background-color:#DD3333;" dark fab small>' +
					        '<v-icon>headset</v-icon>' +
					        '<v-icon>close</v-icon>' +
					      '</v-btn>' +
					    '</template>' +
					    
					    '<v-btn class="fab-link-capitulo" v-if="capitulo.linkSpotify!=null" fab dark small style="background-color:#1dd15d!important" :href="capitulo.linkSpotify" target="_blank">' +
							'<img src="imagenes/logo_spotify_sml.png"  />' + 
						'</v-btn>' +
						'<v-btn class="fab-link-capitulo" v-if="capitulo.linkIvoox!=null" fab color="orange" dark small :href="capitulo.linkIvoox" target="_blank">' + 
						  	'<img src="imagenes/logo_ivoox_sml.png"/>' + 
						'</v-btn>' +
						'<v-btn class="fab-link-capitulo" v-if="capitulo.linkMixcloud!=null" fab color="black" dark small :href="capitulo.linkMixcloud" target="_blank">' + 
							'<img src="imagenes/logo_mixcloud_sml.png"/>' + 
						'</v-btn>' +
						'<v-btn class="fab-link-capitulo" fab color="blue darken-4" dark small :href="capitulo.linkDescargar" target="_blank">' + 
						  	'<v-icon color="white">file_download</v-icon>'+
						'</v-btn>' +
						'<v-btn class="fab-link-capitulo" fab color="red darken-1" dark small v-on:click="irACapitulo(capitulo)">' + 
							'<img src="imagenes/logo_bso_btn_sml.png"/>' + 
						'</v-btn>' +
					'</v-speed-dial>' +
					  
					'</v-list-tile-action>'+
				'</v-list-tile>'+
				'<v-divider style="border-color:rgba(50,50,50,0.2)!important"></v-divider>' +
				'</template>' +
			'</v-list>' +
			'</v-expansion-panel-content>' +
		'</v-expansion-panel>' +
		'</div>',
	 data () {
		return { temporadas:[],fab:[]}
	 },
	 created() {
		 Vue.http.get("api/temporadas.php").then(result => {
			 result.json().then(elem =>{
				 this.temporadas = elem;
			 });
		 }, error => {
			 console.error(error);
		 });
	 },
	 methods: {
		 irACapitulo:function(capitulo){
			this.$router.push('/capitulo/' + capitulo.numero) ;
		 },
		 onOpenOrClose(temporada){
			 if (temporada.capitulos!=null){return;}
			 Vue.http.get("api/temporadas.php?t=" + temporada.numero).then(result => {
		          result.json().then(elem =>{
		        	  temporada.capitulos = elem;
		          });
		      }, error => {
		          console.error(error);
		      });
		 }
	 }
}