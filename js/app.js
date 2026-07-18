(function () {
  'use strict';

  var AD_CONFIG = {
    publisherId: 'ca-pub-0000000000000000',
    adSlots: {
      leaderboard: '0000000000',
      sidebar: '0000000000',
      infeed: '0000000000'
    },
    adMob: {
      enabled: false,
      appId: 'ca-app-pub-0000000000000000~0000000000',
      adUnitId: 'ca-app-pub-0000000000000000/0000000000'
    }
  };

  function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + ' \u20AC';
  }

  function getDiscountPercent(original, current) {
    if (!original || original <= current) return null;
    return Math.round((1 - current / original) * 100);
  }

  function isPwaStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function loadAdSenseScript() {
    if (typeof adsbygoogle !== 'undefined') return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + AD_CONFIG.publisherId;
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }

  function createAdSenseAd(container, slotId, format, isFullWidth) {
    if (AD_CONFIG.publisherId === 'ca-pub-0000000000000000') return;
    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', AD_CONFIG.publisherId);
    ins.setAttribute('data-ad-slot', slotId);
    ins.setAttribute('data-ad-format', format || 'auto');
    if (isFullWidth !== false) {
      ins.setAttribute('data-full-width-responsive', 'true');
    }
    container.appendChild(ins);
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }

  function createAdMobAd(container) {
    if (!AD_CONFIG.adMob.enabled) return;
    if (!isPwaStandalone()) return;
    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', AD_CONFIG.publisherId);
    ins.setAttribute('data-ad-slot', AD_CONFIG.adMob.adUnitId);
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    container.appendChild(ins);
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }

  function imgFallback(el) {
    el.parentElement.innerHTML = '<span class="material-symbols-outlined text-outline text-5xl">checkroom</span>';
  }

  function renderGadgetCard(item) {
    var discount = getDiscountPercent(item.originalPrice, item.price);
    return [
      '<div class="gadget-card bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">',
      '<div class="relative aspect-video bg-surface-dim flex items-center justify-center overflow-hidden">',
      '<img src="' + item.image + '" alt="' + item.name + '" class="w-full h-full object-cover" loading="lazy" onerror="imgFallback(this)">',
      item.badge ? '<span class="absolute top-2 left-2 ' + item.badgeColor + ' text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">' + item.badge + '</span>' : '',
      discount ? '<span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">-' + discount + '%</span>' : '',
      '</div>',
      '<div class="p-4 flex flex-col gap-2 flex-1">',
      '<div class="flex items-center justify-between">',
      '<span class="text-xs font-semibold uppercase tracking-wider text-secondary">' + item.category + '</span>',
      '<span class="text-xs text-outline">' + item.source + '</span>',
      '</div>',
      '<h3 class="font-bold text-primary text-base leading-tight">' + item.name + '</h3>',
      '<p class="text-sm text-on-surface-variant flex-1 line-clamp-3">' + item.description + '</p>',
      '<div class="flex items-center justify-between mt-auto pt-2 border-t border-outline-variant">',
      '<div class="flex items-baseline gap-1">',
      '<span class="text-lg font-extrabold text-primary">' + formatPrice(item.price) + '</span>',
      item.originalPrice ? '<span class="text-xs text-outline line-through">' + formatPrice(item.originalPrice) + '</span>' : '',
      '</div>',
      '<a href="' + item.url + '" target="_blank" rel="noopener sponsored" class="inline-flex items-center gap-1 bg-secondary text-on-secondary text-sm font-bold px-3 py-1.5 rounded-lg hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed transition-colors">',
      'Ver oferta',
      '<span class="material-symbols-outlined text-sm">open_in_new</span>',
      '</a>',
      '</div>',
      '</div>',
      '</div>'
    ].join('');
  }

  function renderFeaturedGadget(item, index) {
    var discount = getDiscountPercent(item.originalPrice, item.price);
    return [
      '<div class="featured-card bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col md:grid md:grid-cols-2">',
      '<div class="aspect-video md:aspect-auto bg-surface-dim overflow-hidden relative">',
      '<img src="' + item.image + '" alt="' + item.name + '" class="w-full h-full object-cover" loading="lazy" onerror="imgFallback(this)">',
      item.badge ? '<span class="absolute top-3 left-3 ' + item.badgeColor + ' text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">' + item.badge + '</span>' : '',
      '</div>',
      '<div class="p-6 flex flex-col gap-3 justify-center">',
      '<div class="flex items-center gap-2">',
      '<span class="flex items-center justify-center bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">#' + (index + 1) + '</span>',
      '<span class="text-xs font-semibold uppercase tracking-wider text-secondary">' + item.category + '</span>',
      '</div>',
      '<h3 class="font-headline-sm text-headline-sm text-primary font-bold">' + item.name + '</h3>',
      '<p class="text-sm text-on-surface-variant">' + item.description + '</p>',
      '<div class="flex items-center gap-2 text-sm text-outline">',
      '<span class="material-symbols-outlined text-sm">star</span>',
      '<span>' + item.rating + '/10 \u00B7 ' + item.source + '</span>',
      '</div>',
      '<div class="flex items-center justify-between mt-2 pt-3 border-t border-outline-variant">',
      '<div class="flex items-baseline gap-2">',
      '<span class="text-2xl font-extrabold text-primary">' + formatPrice(item.price) + '</span>',
      item.originalPrice ? '<span class="text-sm text-outline line-through">' + formatPrice(item.originalPrice) + '</span>' : '',
      discount ? '<span class="text-xs font-bold text-red-500">-' + discount + '%</span>' : '',
      '</div>',
      '<a href="' + item.url + '" target="_blank" rel="noopener sponsored" class="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm flex items-center gap-1.5">',
      'Comprar en Amazon',
      '<span class="material-symbols-outlined text-sm">shopping_cart</span>',
      '</a>',
      '</div>',
      '</div>',
      '</div>'
    ].join('');
  }

  function init() {
    var featuredContainer = document.getElementById('featured-gadgets');
    if (featuredContainer) {
      var featured = FASHION_2026.filter(function (g) { return g.featured; });
      featuredContainer.innerHTML = featured.map(function (g, i) { return renderFeaturedGadget(g, i); }).join('');
    }

    var gridContainer = document.getElementById('gadgets-grid');
    if (gridContainer) {
      var allCards = FASHION_2026.map(function (g) { return renderGadgetCard(g); });
      gridContainer.innerHTML = allCards.map(function (card, i) {
        return i >= 6 ? card.replace('class="gadget-card', 'class="gadget-card hidden-mobile') : card;
      }).join('');
    }

    loadAdSenseScript();

    var leaderboardAd = document.getElementById('ad-leaderboard');
    if (leaderboardAd) {
      leaderboardAd.className = 'ad-container w-full mb-stack-lg';
      if (isPwaStandalone() && AD_CONFIG.adMob.enabled) {
        createAdMobAd(leaderboardAd);
      } else {
        createAdSenseAd(leaderboardAd, AD_CONFIG.adSlots.leaderboard, 'auto', true);
      }
    }

    var sidebarAd = document.getElementById('ad-sidebar');
    if (sidebarAd) {
      sidebarAd.className = 'ad-container-sidebar w-full';
      if (isPwaStandalone() && AD_CONFIG.adMob.enabled) {
        createAdMobAd(sidebarAd);
      } else {
        createAdSenseAd(sidebarAd, AD_CONFIG.adSlots.sidebar, 'auto', true);
      }
    }

    document.querySelectorAll('[data-ad-native]').forEach(function (el) {
      if (AD_CONFIG.publisherId === 'ca-pub-0000000000000000') return;
      el.className = 'ad-container w-full mb-stack-lg';
      if (isPwaStandalone() && AD_CONFIG.adMob.enabled) {
        createAdMobAd(el);
      } else {
        createAdSenseAd(el, AD_CONFIG.adSlots.infeed, 'auto', true);
      }
    });

    var newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = this.querySelector('input[type="email"]');
        if (email && email.value) {
          alert('\u00A1Gracias por suscribirte! Te enviaremos consejos de moda cada semana.');
          email.value = '';
        }
      });
    }

    var loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () {
        var hidden = document.querySelectorAll('.gadget-card.hidden-mobile');
        hidden.forEach(function (el) { el.classList.remove('hidden-mobile'); });
        if (document.querySelectorAll('.gadget-card.hidden-mobile').length === 0) {
          this.style.display = 'none';
        }
      });
    }

    var searchInput = document.querySelector('input[placeholder="Buscar ropa..."]');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        var term = this.value.toLowerCase().trim();
        document.querySelectorAll('.gadget-card, .featured-card').forEach(function (card) {
          var text = card.textContent.toLowerCase();
          card.style.display = term === '' ? '' : text.includes(term) ? '' : 'none';
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
