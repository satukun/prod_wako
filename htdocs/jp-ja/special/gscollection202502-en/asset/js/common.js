const swiper = new Swiper('.carousel .swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  speed: 500, // 少しゆっくり(デフォルトは300)
  slidesPerView: 1.15, // 一度に表示する枚数
  spaceBetween: 0, // スライド間の距離
  centeredSlides: true, // アクティブなスライドを中央にする
  autoplay: false,

  breakpoints: {
    // スライドの表示枚数：500px以上の場合
    768: {
      slidesPerView: 1.665, 
    }
  },

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});



// 全てのSwiperインスタンスを入れる配列を用意します
var swiperArray = [];

$(document).on("opening", ".remodal", function (event) {
    // 以前のSwiperインスタンスがあれば破棄する
    for (var j = 0; j < swiperArray.length; j++) {
      swiperArray[j].destroy(true, true);
    }
    
    swiperArray = []; // 配列を空にします
    
    // カルーセルの総数を変数で管理（ここでは8）
    var totalCarousels = 8;
    
    // 1から totalCarousels までループしてSwiperを初期化します
    for (var i = 1; i <= totalCarousels; i++) {
        var swiperInstance = new Swiper(`#carousel-${i} .swiper`, {
            initialSlide: 0,
            direction: 'horizontal',
            loop: true,
            speed: 500,
            slidesPerView: 1.2,
            spaceBetween: 0,
            centeredSlides: true,
            autoplay: false,
            breakpoints: {
              768: {
                slidesPerView: 1.2, 
              }
            },
            pagination: {
              el: `#carousel-${i} .swiper-pagination`,
              clickable: true,
            },
            navigation: {
              nextEl: `#carousel-${i} .swiper-button-next`,
              prevEl: `#carousel-${i} .swiper-button-prev`,
            },
            scrollbar: {
              el: `#carousel-${i} .swiper-scrollbar`,
            },
        });
        swiperInstance.slideToLoop(0, 0, false);
        // 作ったSwiperインスタンスを配列に保存します
        swiperArray.push(swiperInstance);
    }
});
