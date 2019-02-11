function updateMinHeight(){
	document.getElementById('main-panel').style.minHeight=(window.innerHeight+10) + "px";
}

function scrollToTop(){
	scrollTo(document.documentElement,0,500);
}

function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

function reloadScrollBars() {
    document.documentElement.style.overflow = 'auto';  // firefox, chrome
    document.body.scroll = "yes"; // ie only
}

function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}

const routes = [
  { path: '/', component: Inicio },
  { path: '/inicio/:pagina', component: Inicio },
  { path: '/temporadas', component: Temporadas },
  { path: '/bso-escribe/:pagina', component: BsoEscribe },
  { path: '/bso-escucha/:pagina', component: BsoEscucha },
  { path: '/cuadernos', component: Cuadernos },
  { path: '/quienes-somos', component: QuienesSomos },
  { path: '/capitulo/:id', component: Capitulo },
  { path: '/texto/:id', component: Texto },
  { path: '/capitulo-editor/:id', component: CapituloEditor },
  { path: '/texto-editor/:id', component: TextoEditor },
  { path: '/entrevista-editor/:id', component: EntrevistaEditor },
  
]

const router = new VueRouter({
	  routes//short for `routes: routes`
	})

router.beforeEach((to, from, next) => {
	//NO HAGO NADA CON EL CAROUSEL, NI LO PONGO
	 scrollTo(document.documentElement,0,1000);
	 next();
})
	
new Vue({
	router,
    data () {
		  return { 
		  		  imagenGrande:false,
				  timer:null}
	},
	mounted(){
		updateMinHeight();
		this.timer=setInterval(this.setImagenInicial,200);
	},
	methods:{
		setImagenInicial: function(){
			let subcontainer=document.getElementById('submain-panel');
			if (subcontainer!=null && subcontainer.offsetWidth>50){
				clearInterval(this.timer);
				this.mostrarImagenGrande();
				let navBar=document.getElementById("navBar");
				sticky=navBar.offsetTop;
			}
		},
		mostrarImagenGrande: function(){
			let subcontainer=document.getElementById('submain-panel');
			if (subcontainer==null){return true;}
			this.imagenGrande=(subcontainer.offsetWidth>720);
		}
	}
}).$mount('#app')


//router.push('/inicio');