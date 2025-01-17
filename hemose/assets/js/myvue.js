const vm = new Vue({
  el: '#areaNoticia',
  data: {
    noticias: [],
    noticiaAtual: null,
  },
  methods: {
    async myFetch() {
      try {
        const resposta = await fetch(
          'http://172.23.42.17:3002/apinoticias/listar/0',
        );
        const json = await resposta.json();
        this.noticias = json;
        console.log(json);
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      }
    },
    verNoticia(idNoticia) {
      this.noticiaAtual = Number(idNoticia);
      window.location.href = `blogDetailsHemose.html?id=${idNoticia}`;
    },
  },
  mounted() {
    this.myFetch();
  },
});

const comentarios = new Vue({
  el: '#depoimentos',
  data: {
    depoimentos: [],
    swiper: null,
  },
  methods: {
    async handleGetDepoimentos() {
      try {
        const respostaJson = await fetch(
          'http://172.23.42.17:3002/apidepoimento/listar',
        );
        const resposta = await respostaJson.json();
        this.depoimentos = resposta.data;

        this.$nextTick(() => {
          if (this.swiper) {
            this.swiper.destroy();
          }

          this.swiper = new Swiper('#testiSlide1', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            },
            breakpoints: {
              576: { slidesPerView: 1 },
              768: { slidesPerView: 1 },
              992: { slidesPerView: 2 },
              1200: { slidesPerView: 1.3 },
              1500: { slidesPerView: 1.8 },
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
          });
        });
      } catch (error) {
        console.error('Error fetching testimonials:', error.message);
      }
    },
  },
  mounted() {
    this.handleGetDepoimentos();
  },
  beforeDestroy() {
    if (this.swiper) {
      this.swiper.destroy();
    }
  },
});
