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

const routes = [
  { path: '/', component: Inicio },
  { path: '/temporadas', component: Temporadas },
  { path: '/bso-escribe', component: BsoEscribe },
  { path: '/bso-escucha', component: BsoEscucha },
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
	 scrollTo(document.documentElement,0,1000);
	 next();
})
	
new Vue({
	router,
    data () {
		  return { }
	},
	mounted(){
		updateMinHeight();
	}
}).$mount('#app')


//router.push('/inicio');