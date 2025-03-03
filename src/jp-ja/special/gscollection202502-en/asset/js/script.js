/**
 * エレメントが画面内に入ったらclassを付与させる
 * @param {string} el - 対象とするエレメントのセレクタ
 * @param {Object} options - 関数の設定オプション
 * @param {number} options.offset - IntersectionObserverのオプションで使用するオフセット値
 * @param {number} options.delayIncrement - 遅延時間の増分
 * @param {string} options.activeClassName - 要素が画面内に入ったときに適用するクラス名
 * @param {Function} options.onIntersect - 要素が画面内に入ったときに実行するカスタム関数
 */
export const imageBeSideInfiniteScroll = (el = "", { offset = -30, delayIncrement = 100, activeClassName = "is-active", onIntersect = null } = {}) => {
  // 対象となるエレメントを選択
  const targets = document.querySelectorAll(el);

  // IntersectionObserver の設定オプション
  const options = {
    root: null,
    rootMargin: `0px 0px ${offset}%`,
    threshold: 0,
  };

  // IntersectionObserver を生成
  const observer = new IntersectionObserver(intersected, options);

  // 対象となる各エレメントに Observer を適用
  targets.forEach((target) => observer.observe(target));

  /**
   * エレメントが画面内に入った時に呼び出される関数
   * @param {Array} entries - 画面内に入ったエレメントの情報の配列
   */
  function intersected(entries) {
    entries.forEach((entry, index) => {
      // データ属性から遅延時間を取得、もしくは0を設定
      const delay = entry.target.dataset.delay || 0;

      // エレメントが画面内に入っている場合
      if (entry.isIntersecting) {
        // 設定された遅延時間とインデックスに基づいて遅延を計算
        const timeoutDelay = delay + index * delayIncrement;

        // カスタム関数が設定されている場合はそれを呼び出す、そうでなければデフォルトのクラスを追加
        if (onIntersect) {
          setTimeout(() => onIntersect(entry, index), timeoutDelay);
        } else {
          setTimeout(() => entry.target.classList.add(activeClassName), timeoutDelay);
        }
      }
    });
  }
};

/**
 * スムーズスクロール
 * @param {string} selector - スムーズスクロールを適用する要素のセレクタ
 * @param {Object} options - 関数の設定オプション
 * @param {number} options.speed - スクロール速度（ミリ秒）
 * @param {number} options.offset - スクロール位置のオフセット値
 * @param {string} options.easing - イージングの種類
 * @param {Function} options.beforeScroll - スクロール前に実行するカスタム関数
 * @param {Function} options.afterScroll - スクロール後に実行するカスタム関数
 */
export const smoothScroll = (selector, { speed = 700, offset = 0, easing = "swing", beforeScroll = null, afterScroll = null } = {}) => {
  // クリックイベントを設定
  $(selector).on("click", function (event) {
    // デフォルトのクリックイベントを無効化
    event.preventDefault();

    // クリックされた要素のhref属性からスクロール先のIDを取得
    const href = $(this).attr("href");

    // スクロール先のエレメントを特定
    const target = $(href === "#" || href === "" ? "html" : href);

    // スクロール先の位置を計算
    const position = target.offset().top - offset;

    // カスタム関数が設定されている場合、スクロール前に実行
    if (beforeScroll) {
      beforeScroll();
    }

    // スクロール実行
    $("body,html").animate({ scrollTop: position }, speed, easing, () => {
      // カスタム関数が設定されている場合、スクロール後に実行
      if (afterScroll) {
        afterScroll();
      }
    });
  });
};

// フローティングナビゲーション
// navSelector: フローティングナビゲーションのセレクタ
// footerSelector: フッターのセレクタ
// showAt: ナビゲーションを表示するスクロール位置
export const floatingNav = (navSelector = ".js-floating", footerSelector = ".l-footer", showAt = 300) => {
  const nav = $(navSelector);
  const footer = $(footerSelector);

  // Null チェック
  if (!nav || !nav.length) {
    console.error("Nav element not found");
    return;
  }

  const navHeight = nav.innerHeight();

  $(window).on("load scroll resize", function () {
    const scrollTop = $(this).scrollTop();
    const footerTop = footer.offset().top;
    const windowHeight = $(this).outerHeight();

    if (scrollTop > showAt) {
      nav.removeClass("is-hide").addClass("is-show");
      if (windowHeight + scrollTop > footerTop + navHeight) {
        const position = windowHeight + scrollTop - footerTop;
        nav.css({ bottom: position });
      } else {
        nav.css({ bottom: 0 });
      }
    } else {
      nav.removeClass("is-show").addClass("is-hide");
    }
  });
};

// アコーディオン
// buttonSelector: アコーディオンのボタンのセレクタ
// contentSelector: アコーディオンのコンテンツのセレクタ
// speed: スライドダウン/スライドアップの速度
export const openAccordion = (buttonSelector = ".c-accordion__button", contentSelector = ".c-accordion", speed = 200) => {
  const btn = $(buttonSelector);
  btn.on("click", function () {
    $(this).addClass("is-hide");
    $(this).prev(contentSelector).slideDown(speed);
  });
};

/**
 * トップへ戻るボタン
 * @param {string} selector - トップへ戻るボタンのセレクタ
 * @param {Object} options - スクロールの速度やオフセットなどを設定するオプションオブジェクト
 * @param {number} options.speed - スクロールの速度（ミリ秒）
 * @param {string} options.easing - イージングの種類
 * @param {Function} options.beforeScroll - スクロール前に実行するコールバック関数
 * @param {Function} options.afterScroll - スクロール後に実行するコールバック関数
 */
export const goTopFunction = (selector = "", options = {}) => {
  const defaults = {
    speed: 1000,
    easing: "swing",
    beforeScroll: null,
    afterScroll: null,
  };

  const settings = { ...defaults, ...options };

  const goTop = $(selector);
  if (!goTop || goTop.length === 0) {
    console.error("GoTop element not found");
    return;
  }

  goTop.on("click", function (event) {
    event.preventDefault();

    // Before Scroll コールバックが指定されていれば実行
    if (typeof settings.beforeScroll === "function") {
      settings.beforeScroll();
    }

    $("body,html").animate({ scrollTop: 0 }, settings.speed, settings.easing, () => {
      // After Scroll コールバックが指定されていれば実行
      if (typeof settings.afterScroll === "function") {
        settings.afterScroll();
      }
    });
  });
};

/**
 * ブラウザのスクロール位置が最下部に近づいたかを検出
 * @param {Object} options - 関数のオプション
 * @param {number} options.offset - 最下部と判定するまでのオフセット値
 * @param {string} options.className - 対象とするエレメントのクラス名
 * @param {string} options.addClass - 近づいた時に追加するクラス名
 * @param {Function} options.callback - 最下部に近づいた時に実行するコールバック関数
 */
export const detectScrollBottom = (options = {}) => {
  const defaults = {
    offset: 0,
    className: "",
    addClass: "fix",
    callback: null,
  };

  const settings = { ...defaults, ...options };

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const targetElements = document.querySelectorAll(settings.className);
    const isNearBottom = scrollTop + windowHeight >= documentHeight - settings.offset;

    targetElements.forEach((element) => {
      if (isNearBottom) {
        element.classList.add(settings.addClass);

        // コールバック関数が指定されていれば実行
        if (typeof settings.callback === "function") {
          settings.callback(element);
        }
      } else {
        element.classList.remove(settings.addClass);
      }
    });
  });
};

/**
 * 背景画像を設定する
 * @param {string} _el - 対象とするエレメントのセレクタ
 * @param {Object} options - 関数の設定オプション
 * @param {string} options.childSelector - 画像のソースを取得する子要素のセレクタ
 * @param {Object} options.bgStyles - 追加する背景画像のスタイル
 */
export const bgImgSet = (_el = "", options = {}) => {
  // デフォルトオプション
  const defaults = {
    childSelector: "img",
    bgStyles: {},
  };

  // オプションをマージ
  const settings = { ...defaults, ...options };

  // 対象となるエレメントを選択
  const elements = $(_el);

  // 各エレメントに対して背景画像を設定
  elements.each(function () {
    const src = $(this).find(settings.childSelector).attr("src");
    $(this).css("background-image", `url("${src}")`);

    // 追加の背景スタイルが指定されていれば適用
    if (Object.keys(settings.bgStyles).length > 0) {
      $(this).css(settings.bgStyles);
    }
  });
};

/**
 * タブクリック時にクラスを切り替える関数
 * @param {string} tabSelector - タブアイテムのセレクタ
 * @param {Object} options - 関数の設定オプション
 * @param {string} options.activeClass - 付与するアクティブクラス名
 */
export const handleTabClick = (tabSelector = ".tab_item", options = {}) => {
  // デフォルトオプション
  const defaults = {
    activeClass: "active", // デフォルトで使用するアクティブクラス名
  };

  // オプションをマージ（ユーザーが指定したオプションがあれば、デフォルトに上書きする）
  const settings = { ...defaults, ...options };

  // タブアイテムを選択
  const tabItems = document.querySelectorAll(tabSelector); // 指定されたセレクタで全てのタブアイテムを取得
  const movementConts = document.querySelectorAll(".movement_cont"); // コンテンツを取得
  const modelInners = document.querySelectorAll(".model_inner"); // model_innerを取得
  const movementTabs = document.querySelectorAll(".movement_tab"); // movement_tabを取得

  // 共通のアクティブクラスを切り替える関数
  const updateActiveClasses = (index) => {
    // 全ての要素からアクティブクラスを削除し、非表示に設定
    [...tabItems, ...movementTabs, ...movementConts, ...modelInners].forEach((item) => {
      item.classList.remove(settings.activeClass);
      if (item.classList.contains("movement_cont") || item.classList.contains("model_inner")) {
        item.style.display = "none";
        item.style.transform = "translateX(50px)";
        item.style.opacity = "0";
      }
    });

    // クリックされたインデックスの要素にアクティブクラスを付与し、アニメーションを適用
    if (tabItems[index]) tabItems[index].classList.add(settings.activeClass);
    if (movementTabs[index]) movementTabs[index].classList.add(settings.activeClass);

    if (movementConts[index]) {
      movementConts[index].classList.add(settings.activeClass);
      movementConts[index].style.display = "block";
      setTimeout(() => {
        movementConts[index].style.transform = "translateX(0)";
        movementConts[index].style.opacity = "1";
        movementConts[index].style.transition = "transform 0.4s ease, opacity 0.4s ease";
      }, 10);
    }

    if (modelInners[index]) {
      modelInners[index].classList.add(settings.activeClass);
      modelInners[index].style.display = "block";
      setTimeout(() => {
        modelInners[index].style.transform = "translateX(0)";
        modelInners[index].style.opacity = "1";
        modelInners[index].style.transition = "transform 0.4s ease, opacity 0.4s ease";
      }, 10);
    }
  };

  // タブアイテムにクリックイベントを設定
  tabItems.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      updateActiveClasses(index); // 対応するインデックスの要素をアクティブ化
    });
  });

  // movement_tabにクリックイベントを設定
  movementTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      updateActiveClasses(index); // 対応するインデックスの要素をアクティブ化
    });
  });
};

/**
 * スクロール時に.movementクラスが画面を通過したら.tabクラスにアクティブクラスを付与し、.model_item_btnまたは.p_lp_presentが画面上部に到達したらアクティブクラスを削除する関数
 * @param {string} switchSelector - 対象とする.movementクラスのセレクタ
 * @param {string} tabSelector - アクティブクラスを付与する.tabクラスのセレクタ
 * @param {Object} options - 関数の設定オプション
 * @param {string} options.activeClass - 付与するアクティブクラス名
 */
export const handleScrollActivation = (modelSelector = ".model", tabSelector = ".tab", options = {}) => {
  const defaults = {
    activeClass: "active", // デフォルトで使用するアクティブクラス名
  };
  const settings = { ...defaults, ...options };

  const tabElement = document.querySelector(tabSelector);
  const modelElement = document.querySelector(modelSelector);

  if (!tabElement || !modelElement) return; // 必須要素が存在しない場合は何もしない

  // modelElementが画面の上端に到達したときにアクティブクラスを追加し、通過して画面外に出たら削除するオブザーバー
  const modelObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.boundingClientRect.top <= 0) {
          tabElement.classList.add(settings.activeClass); // modelElementが画面の上端に達した時にアクティブクラスを追加
        } else if (!entry.isIntersecting) {
          tabElement.classList.remove(settings.activeClass); // modelElementが画面外に完全に通過したらアクティブクラスを削除
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -100% 0px" }
  );

  // 監視を開始
  modelObserver.observe(modelElement);
};

const ModuleLibrary = {
  imageBeSideInfiniteScroll,
  // detectScrollBottom,
  smoothScroll,
  goTopFunction,
  handleTabClick,
  handleScrollActivation,
};

ModuleLibrary.smoothScroll(".tab_item");
ModuleLibrary.imageBeSideInfiniteScroll(".fade-element", {
  offset: -40,
  delayIncrement: 150,
  activeClassName: "is-active",
});
ModuleLibrary.handleTabClick();
ModuleLibrary.handleScrollActivation();
