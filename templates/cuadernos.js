const Cuadernos = { template: '<div><v-card>'+
		'<v-card-text>' +
	    '<h1 style="text-align:center;" class="text--lighten-1 teal--text">Cuadernos</h1>' +
	     'Desde 2015, en BSO dedicamos una vez al mes un capítulo a los "autores" en el cine. En todos los casos con un invitado de lujo que nos guía por el universo particular de cada director. De manera celebratoria, en cada entrega, lanzamos y sorteamos entre los oyentes un cuaderno ilustrado por Nicolás Aponte A. Gutter y diseñado por <a href="https://www.facebook.com/despiertamacflai/?fref=ts">MacFlai</a>. Aquí está el arte de los muchachos que, claramente, da cuenta de nuestro amor por el cine.' +
	   '</v-card-text>' +
					 '</v-card>' +
					 '<v-card>' +
					 '<v-container fluid grid-list-sm>' +
					 	'<v-layout row wrap>' +
							'<v-flex v-for="(cuad,i) in cuadernos" :key="i" xs4>' +
								'<v-card class="elevation-5" style="margin:5px">' +
									'<v-img :src="basepath + \'imagenes/\' + cuad.imagenMin" height="200px" >' +
										'<v-container fill-height fluid pa-0>' +
											'<v-layout fill-height>' +
												'<v-flex xs12 align-end flexbox style="padding: 0px!important;">' +
													'<span class="headline white--text" style="justify-content: center;width: 100%;display: inline-flex;background-color: rgba(0,0,0,0.8);padding: 5px!important;" v-text="cuad.titulo"></span>' +
												'</v-flex>' +
											'</v-layout>' +
										'</v-container>' +
									'</v-img>' +
									'<v-card-actions>' +
										'<v-spacer></v-spacer>' +
										'<v-btn icon dark class="teal lighten-1" @click="hacerZoom(i)">' +
											'<v-icon>zoom_out_map</v-icon>' +
										'</v-btn>' +
									'</v-card-actions>' +
								'</v-card>' +
							'</v-flex>' +
						'</v-layout>' +
					 '</v-container>' +
					 '</v-card>' +
					 '</div>' ,
data () {
	return { cuadernos:[],basepath:'../bso-radio/'}
},
created() {
	  Vue.http.get("api/cuadernos.php").then(result => {
	          result.json().then(elem =>{
	          	this.cuadernos = elem;
	          });
	      }, error => {
	          console.error(error);
	      });
}}