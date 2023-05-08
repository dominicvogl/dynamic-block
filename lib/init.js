// import Swiper from "swiper";

const allCarousels = document.querySelectorAll("[data-swiper-carousel]");

allCarousels.forEach((carousel) => {
	const swiperCarousel = new Swiper(carousel, {
		slidesPerView: 1,
		slidesPerGroup: 1,
		freeMode: true,
		sticky: true,
		spaceBetween: 20,
		loop: false,
		navigation: {
			nextEl: "[data-swiper-next]",
			prevEl: "[data-swiper-prev]",
		},
		breakpoints: {
			// when window width is >= 320px
			782: {
				slidesPerView: 3,
				spaceBetween: 40,
				slidesPerGroup: 3,
				freeMode: false,
				sticky: false,
			},
		},
	});
});
