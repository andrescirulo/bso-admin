const Temporadas = { template: '<div style="text-align:center">' + 
		'<v-progress-circular mx-auto :size="70" :width="7" indeterminate color="green" v-if="temporadas.length==0"></v-progress-circular>'+
		'<v-btn ripple color="cyan" dark :href="\'#/capitulo-editor/new\'">'+
			'<v-icon color="white">add</v-icon>Agregar Capítulo'+
		'</v-btn>'+ 
		'<v-expansion-panel v-if="temporadas.length>0" v-for="(temp,t) in temporadas" :key="t" style="margin-bottom:10px;">' + 
			'<v-expansion-panel-content @input="onOpenOrClose(temp)" class="panel-temporada-content">'+
			'<div slot="header" inset class="headline text--lighten-1 teal--text" style="padding-left:5px;">Temporada {{temp.numero}}</div>'+
			'<v-progress-circular mx-auto :size="70" :width="7" indeterminate color="green" v-if="temp.capitulos==null"></v-progress-circular>'+
			'<v-list v-if="temp.capitulos!=null"><v-list-tile v-for="(capitulo,c) in temp.capitulos" :key="c" avatar @click="">'+
				'<v-list-tile-content style="padding-left:25px">'+
				  '<v-list-tile-title>{{capitulo.numero}} - {{ capitulo.nombre }}</v-list-tile-title>'+
				  '<v-list-tile-sub-title>{{ capitulo.fecha }}</v-list-tile-sub-title>'+
				'</v-list-tile-content>'+
				'<v-list-tile-action>'+
				  '<v-btn class="hidden-xs-only" ripple color="cyan" dark :href="capitulo.link">'+
					'Descargar'+
				  '</v-btn>'+
				  '<v-btn icon class="hidden-sm-and-up" ripple color="cyan" dark :href="capitulo.link">'+
				  	  '<v-icon color="white">file_download</v-icon>'+
				  '</v-btn>'+
				'</v-list-tile-action>'+
				'<v-list-tile-action>'+
				  '<v-btn icon ripple color="blue" dark :href="\'#/capitulo-editor/\' + capitulo.numero">'+
				  	  '<v-icon color="white">edit</v-icon>'+
				  '</v-btn>'+
				'</v-list-tile-action>'+
				'<v-list-tile-action>'+
				  '<v-btn icon ripple color="red" dark>'+
				  	  '<v-icon color="white">delete</v-icon>'+
				  '</v-btn>'+
				'</v-list-tile-action>'+
			'</v-list-tile>'+
			'</v-list>' +
			'</v-expansion-panel-content>' +
		'</v-expansion-panel>' +
		'</div>',
	 data () {
		return { temporadas:[]}
	 },
	 methods: {
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
	 },
	 mounted() {
	  Vue.http.get("api/temporadas.php").then(result => {
          result.json().then(elem =>{
          	this.temporadas = elem;
          });
      }, error => {
          console.error(error);
      });
}}