// import Swiper from "swiper";

const allCarousels = document.querySelectorAll("[data-swiper-carousel]");

allCarousels.forEach((carousel) => {
	const swiperCarousel = new Swiper(carousel, {
		slidesPerView: 3,
		slidesPerGroup: 3,
		spaceBetween: 40,
		loop: false,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});
});
