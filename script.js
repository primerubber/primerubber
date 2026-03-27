// --- Top Banner Rotation ---
const bannerSlides = [
    '<i class="fas fa-truck-fast"></i> NEXT DAY NATIONWIDE DISPATCH ON ALL ORDERS',
    '<i class="fas fa-certificate"></i> ISO 9001 CERTIFIED QUALITY STANDARDS',
    '<i class="fas fa-star"></i> 4.9★ RATED BY OVER 25,000+ CUSTOMERS',
    '<i class="fas fa-scissors"></i> EXPERT CUSTOM CUTTING SERVICE AVAILABLE'
];

let currentBanner = 0;
const bannerSlider = document.getElementById('bannerSlider');

function rotateBanner() {
    currentBanner = (currentBanner + 1) % bannerSlides.length;
    if (bannerSlider) {
        bannerSlider.innerHTML = `<div class="banner-slide">${bannerSlides[currentBanner]}</div>`;
    }
}

setInterval(rotateBanner, 5000);

// --- Hero Slider ---
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let sliderTimer;

const heroSec = document.querySelector('.hero-sec');
const heroImages = [
    'images/slider_matting.png',
    'images/slider_sheet.png',
    'images/slider_flooring.png',
    'images/slider_tarpaulin.png'
];

function showSlide(index) {
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlideIndex = (index + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');

    if (heroSec) {
        heroSec.style.setProperty('--hero-bg', `url('${heroImages[currentSlideIndex]}')`);
    }
}

// BUG FIX: nextSlide now calls resetTimer() to stay in sync with manual navigation
function nextSlide() { showSlide(currentSlideIndex + 1); resetTimer(); }
function prevSlide() { showSlide(currentSlideIndex - 1); resetTimer(); }
function setSlide(index) { showSlide(index); resetTimer(); }

function resetTimer() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(nextSlide, 5000);
}

if (slides.length > 0) {
    sliderTimer = setInterval(nextSlide, 5000);
    showSlide(0);
}


// --- Cart State ---
let cart = JSON.parse(localStorage.getItem('prime_cart')) || [];

function updateCartCount() {
    const countElements = document.querySelectorAll('.h-cart-count, .badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    countElements.forEach(el => {
        el.textContent = totalItems;
        if (totalItems === 0) {
            el.style.display = 'none';
        } else {
            el.style.display = 'flex';
        }
    });
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    localStorage.setItem('prime_cart', JSON.stringify(cart));
    updateCartCount();
    showBasketNotification(product, quantity);
}

function showBasketNotification(product, quantity) {
    const notify = document.getElementById('basketNotify');
    if (!notify) return;

    const content = notify.querySelector('.notify-content');
    if (content) {
        content.innerHTML = `
            <img src="${product.image}" style="width:40px; height:40px; border-radius:5px; object-fit:cover;">
            <div>
                <div style="font-weight:bold; font-size:0.85rem;">${product.title}</div>
                <div style="font-size:0.75rem; color:#64748b;">${quantity} Item(s) added to basket</div>
            </div>
        `;
    }

    notify.classList.add('active');
    setTimeout(() => {
        notify.classList.remove('active');
    }, 4500);
}

// --- Dynamic Product Rendering (Index Page) ---
function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    const targetCategories = ["Rubber Matting", "Rubber Flooring", "Rubber Sheet", "Tarpaulins", "Entrance Matting", "Outdoor Matting"];
    const filteredProducts = products.filter(p => targetCategories.includes(p.category));
    const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    productGrid.innerHTML = selected.map(product => `
        <div class="product-card">
            <a href="./product.html?slug=${product.slug}">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.title}" loading="lazy" decoding="async">
                </div>
            </a>
            <div class="product-label-bar">
                <h3>${product.title}</h3>
            </div>
            <div class="product-price-bar">
                <span style="color: #64748b; font-size: 0.8rem;">From</span> 
                <span style="color: #059669;">${product.price}</span>
            </div>
        </div>
    `).join('');
}

// --- Dynamic Product Ticker (Horizontal) ---
function renderTicker() {
    const tickerTrack = document.getElementById('productTicker');
    if (!tickerTrack) return;

    const tickerProducts = products.filter(p => ["Rubber Matting", "Rubber Sheet", "Rubber Flooring", "Tarpaulins"].includes(p.category));
    const displayArray = [...tickerProducts, ...tickerProducts];

    tickerTrack.innerHTML = displayArray.map(p => `
        <a href="./product.html?slug=${p.slug}" class="t-card">
            <div class="t-img-box">
                <img src="${p.image}" alt="${p.title}" loading="lazy" decoding="async">
            </div>
            <div class="t-info">
                <span class="t-cat">${p.category}</span>
                <h4>${p.title}</h4>
                <div class="t-price-box">
                    <span class="t-price">${p.price}</span>
                    <div class="t-btn"><i class="fas fa-plus"></i></div>
                </div>
            </div>
        </a>
    `).join('');
}

// --- Product Detail Population ---
function initProductPage() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const slug = params.get('slug');
    const product = products.find(p => (slug && p.slug === slug) || (productId && p.id === productId));

    if (!product) return;

    document.title = `${product.title} | Prime Rubber`;
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `<a href="./">Home</a> / <a href="./category.html?type=${product.category.toLowerCase().replace(/ /g, '-')}">${product.category}</a> / ${product.title}`;
    }

    const topTitle = document.getElementById('topProdTitle');
    const priceBig = document.getElementById('pPriceBig');
    if (topTitle) topTitle.textContent = product.title;
    if (priceBig) priceBig.textContent = product.price;

    const img = document.getElementById('mainProductImg');
    if (img) {
        img.src = product.image;
        img.alt = product.title;
        img.decoding = "async";
    }

    const thumbGallery = document.getElementById('thumbGallery');
    if (thumbGallery && product.images) {
        thumbGallery.innerHTML = product.images.map((src, i) => `
            <div class="thumb-item ${src === product.image ? 'active' : ''}" onclick="changeImg('${src}', this)">
                <img src="${src}" alt="${product.title} view ${i + 1}" loading="lazy" decoding="async">
            </div>
        `).join('');
    }

    const specContainer = document.querySelector('.p-specs');
    if (specContainer && product.specs) {
        specContainer.innerHTML = Object.entries(product.specs).map(([label, value]) => `
            <div class="spec-row">
                <span class="spec-label">${label}</span>
                <span class="spec-value">${value}</span>
            </div>
        `).join('');
    }

    const variantSelect = document.getElementById('variantSelect');
    if (variantSelect && product.specs) {
        const sizeDisplay = product.specs.Size || product.specs.Dimensions || "Standard Size";
        const thickness = product.specs.Thickness ? ` x ${product.specs.Thickness}` : '';
        const colorDisplay = product.specs.Color ? `${product.specs.Color} - ` : '';
        variantSelect.innerHTML = `<option>${colorDisplay}${sizeDisplay}${thickness} - ${product.price} Inc. VAT</option>`;
    }

    const descContent = document.getElementById('productDesc');
    if (descContent) {
        descContent.innerHTML = `
            <div style="color: #444; line-height: 1.8;">
                <p style="margin-bottom: 20px;">${product.description}</p>
                ${product.features ? `
                    <h4 style="color: #000; font-weight: 800; margin-bottom: 15px;">Key Features:</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${product.features.map(f => `<li style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px;"><i class="fas fa-check-circle" style="color: #059669;"></i> ${f}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
    }

    const relatedGrid = document.getElementById('relatedGrid');
    if (relatedGrid) {
        const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
        if (related.length > 0) {
            relatedGrid.innerHTML = related.map(p => `
            <div class="related-card">
                <div class="related-img">
                    <img src="${p.image}" alt="${p.title}" loading="lazy" decoding="async">
                </div>
                    <div class="related-info">
                        <h3>${p.title}</h3>
                        <span class="related-price">From ${p.price}</span>
                        <a href="./product.html?slug=${p.slug}" class="related-btn">More Information</a>
                    </div>
                </div>
            `).join('');
        } else {
            const relSec = document.querySelector('.related-section');
            if (relSec) relSec.style.display = 'none';
        }
    }

    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn) {
        addBtn.onclick = () => {
            const qtyInput = document.getElementById('baseQty');
            const qty = qtyInput ? parseInt(qtyInput.value) : 1;
            addToCart(product.id, qty);
        };
    }

    const moreFrom = document.querySelector('.z-more-from');
    if (moreFrom) {
        const h3 = moreFrom.querySelector('h3');
        const a = moreFrom.querySelector('a');
        if (h3) h3.textContent = `More from ${product.category}`;
        if (a) a.href = `/category/${product.category.toLowerCase().replace(/ /g, '-')}`;
    }

    // BUG FIX: use replaceAll to handle prices with multiple commas e.g. £1,968,000
    const cleanPrice = product.price.replace('£', '').replaceAll(',', '');
    const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": [product.image],
        "description": product.description,
        "sku": product.id,
        "brand": { "@type": "Brand", "name": "Prime Rubber UK" },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "GBP",
            "price": cleanPrice,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": { "@type": "Organization", "name": "Prime Rubber UK" }
        }
    };
    const schemaScript = document.createElement('script');
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify(schemaData);
    document.head.appendChild(schemaScript);
}

// --- Dynamic Helpers ---
function changeImg(src, el) {
    document.getElementById('mainProductImg').src = src;
    document.querySelectorAll('.thumb-item').forEach(th => th.classList.remove('active'));
    el.classList.add('active');
}

function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    lbImg.src = src;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// BUG FIX: accordion now correctly checks computed style for initial state (empty string case)
function toggleAccordion() {
    const acc = document.querySelector('.desc-accordion');
    const content = document.getElementById('productDesc');
    const icon = acc.querySelector('.arrow i');

    const isHidden = content.style.display === 'none' || getComputedStyle(content).display === 'none';

    if (isHidden) {
        content.style.display = 'block';
        icon.className = 'fas fa-chevron-up';
    } else {
        content.style.display = 'none';
        icon.className = 'fas fa-chevron-down';
    }
}

// --- Prime Material Scale Visualizer ---
document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.thickness-btn');
    const sample = document.getElementById('materialSample');
    const display = document.getElementById('mmDisplay');

    if (!btns || !sample) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mm = btn.getAttribute('data-mm');
            sample.style.height = `${mm}px`;
            display.innerText = `${mm}MM`;
        });
    });
});

// --- Prime Chat AI Agent System ---
function toggleChat() {
    const drawer = document.getElementById('primeChatDrawer');
    if (drawer) {
        drawer.classList.toggle('active');
        if (drawer.classList.contains('active')) {
            const body = drawer.querySelector('.chat-body');
            if (body && body.children.length === 0) {
                addBotMsg("Hi there! I'm James from the Prime Rubber support team. I've been helping customers with industrial materials for years—what project are you working on today? I'll find you exactly what you need.");
            }
        }
    }
}

function addBotMsg(text) {
    const body = document.getElementById('chatBody');
    if (!body) return;
    const msg = document.createElement('div');
    msg.className = 'chat-msg msg-bot';
    msg.innerHTML = `<strong>James | Expert Advisor</strong> ${text}`;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
}

function addUserMsg(text) {
    const body = document.getElementById('chatBody');
    if (!body) return;
    const msg = document.createElement('div');
    msg.className = 'chat-msg msg-user';
    msg.style.alignSelf = 'flex-end';
    msg.style.background = '#059669';
    msg.style.color = '#fff';
    msg.style.marginLeft = 'auto';
    msg.innerHTML = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
}

function handleChat() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    addUserMsg(text);
    input.value = '';

    setTimeout(() => {
        const response = generateAIResponse(text.toLowerCase());
        addBotMsg(response);
    }, 800);
}

function generateAIResponse(query) {
    let matchedProducts = [];

    const stockPrefixes = [
        "Let me just check our current stock levels for you... Ah, yes! We've got it.",
        "That's a very common requirement. Honestly, for quality, we're the best in the UK.",
        "One second, let me look into our warehouse inventory... Okay, found it!",
        "Great question. I actually recommended this exact thing to a client earlier today."
    ];
    let prefix = stockPrefixes[Math.floor(Math.random() * stockPrefixes.length)];

    if (query.includes('mat') || query.includes('floor')) {
        matchedProducts = products.filter(p => p.category.includes('Matting') || p.category.includes('Flooring')).slice(0, 2);
    } else if (query.includes('sheet') || query.includes('rubber')) {
        matchedProducts = products.filter(p => p.category.includes('Sheet')).slice(0, 2);
    } else if (query.includes('tarp') || query.includes('cover')) {
        matchedProducts = products.filter(p => p.category.includes('Tarpaulin')).slice(0, 2);
    } else if (query.includes('price') || query.includes('cost')) {
        return "I've just compared our current rates with the market—we're definitely the most competitive. Most of our heavy-duty rolls are priced far better than our competitors. Which one caught your eye? I can get your order processed for next-day dispatch right now.";
    }

    if (matchedProducts.length > 0) {
        // BUG FIX: chat links now consistently use ?slug= instead of ?id=
        let resp = `${prefix} For ${matchedProducts[0].category}, I'd personally recommend our **${matchedProducts[0].title}**. It's our most durable option and honestly, clients love it.<br><br>`;
        resp += matchedProducts.map(p => `
            <div style="background:#fff; border:1px solid #ddd; padding:10px; border-radius:10px; margin-top:10px;">
                <img src="${p.image}" style="width:50px; height:50px; float:left; margin-right:10px; object-fit:cover; border-radius:5px;">
                <div style="font-weight:bold; font-size:0.8rem;">${p.title}</div>
                <div style="color:#059669; font-weight:bold; font-size:0.9rem;">${p.price}</div>
                <a href="product.html?slug=${p.slug}" style="font-size:0.75rem; color:var(--primary); font-weight:800; text-decoration:underline;">Grab it now →</a>
            </div>
        `).join('');
        resp += "<br>If you order now, I can ensure it gets on tomorrow's dispatch. Should I help you checkout with one of these?";
        return resp;
    }

    return "No problem, I'm here to help. At Prime Rubber UK, we've got the largest stock of industrial surfaces in the country. Just tell me what you're working on, and I'll find the perfect material for you. Or, if it's easier, give us a call!";
}


document.addEventListener('DOMContentLoaded', () => {
    const globalSearchInput = document.querySelector('.search-input');
    const globalSearchBtn = document.querySelector('.search-btn');
    const searchContainer = document.querySelector('.search-container');

    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'search-suggestions';
    if (searchContainer) searchContainer.appendChild(suggestionBox);

    const popularSearches = ["Rubber Flooring", "Rubber Matting", "Gym Flooring", "Anti-Fatigue Mats", "PVC Strip Curtains", "Sound Deadening", "Horse Mats", "Grass Mats"];
    const collections = ["Rubber Chippings", "Rubber Mats", "Rubber Sheet", "Rubber Tiles"];

    const hideSuggestions = () => {
        setTimeout(() => { suggestionBox.style.display = 'none'; }, 200);
    };

    const showSuggestions = (query = '') => {
        if (!suggestionBox) return;
        suggestionBox.style.display = 'block';
        const q = query.toLowerCase().trim();

        if (q === '') {
            suggestionBox.innerHTML = `
                <span class="section-title">Popular Searches</span>
                <div class="suggestion-pills">
                    ${popularSearches.map(s => `<div class="suggestion-pill" onclick="window.location.href='all-products.html?search=${encodeURIComponent(s)}'">${s}</div>`).join('')}
                </div>
            `;
        } else {
            const filtered = products.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            ).slice(0, 5);

            suggestionBox.innerHTML = `
                <span class="section-title">Collections</span>
                <div class="suggestion-pills">
                    ${collections.map(c => `<div class="suggestion-pill" onclick="window.location.href='all-products.html?search=${encodeURIComponent(c)}'">${c}</div>`).join('')}
                </div>
                ${filtered.length > 0 ? `
                    <div class="suggestion-list">
                        ${filtered.map(p => `
                            <a href="product.html?slug=${p.slug}" class="suggestion-item">
                                <div class="suggestion-thumb"><img src="${p.image}" alt=""></div>
                                <div class="suggestion-info">
                                    <span class="suggestion-title">${p.title}</span>
                                    <span class="suggestion-cat">${p.category}</span>
                                </div>
                                <div class="suggestion-price">${p.price}</div>
                            </a>
                        `).join('')}
                    </div>
                ` : '<div style="text-align:center; padding:10px; color:#94a3b8; font-size:0.8rem;">No instant matches found</div>'}
            `;
        }
    };

    const triggerGlobalSearch = () => {
        const query = globalSearchInput.value.trim();
        if (query) {
            window.location.href = `all-products.html?search=${encodeURIComponent(query)}`;
        }
    };

    if (globalSearchBtn) globalSearchBtn.onclick = triggerGlobalSearch;
    if (globalSearchInput) {
        globalSearchInput.onkeydown = (e) => {
            if (e.key === 'Enter') triggerGlobalSearch();
        };
        globalSearchInput.onfocus = () => showSuggestions(globalSearchInput.value);
        globalSearchInput.oninput = (e) => showSuggestions(e.target.value);
        globalSearchInput.onblur = hideSuggestions;
    }

    updateCartCount();
    if (document.querySelector('.product-grid')) renderProducts();
    if (document.getElementById('productTicker')) renderTicker();
    if (window.location.pathname.includes('product.html')) initProductPage();

    const chatBtn = document.querySelector('.chat-cta');
    const sendBtn = document.querySelector('.chat-send-btn');
    const chatInput = document.getElementById('chatInput');

    if (chatBtn) chatBtn.onclick = toggleChat;
    if (sendBtn) sendBtn.onclick = handleChat;
    if (chatInput) {
        chatInput.onkeypress = (e) => {
            if (e.key === 'Enter') handleChat();
        };
    }
});

// --- Header Scroll State ---
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header-main');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// --- Mouse Parallax for Aura Glows ---
document.addEventListener('mousemove', (e) => {
    const auras = document.querySelectorAll('.aura-glow');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    auras.forEach((aura, index) => {
        const factor = (index + 1) * 30;
        aura.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
});

console.log('%c PRIME RUBBER V2.1 🚀 Initialized ', 'background: #059669; color: #fff; font-weight: bold; padding: 5px; border-radius: 5px;');

// --- Premium Cookie Consent System ---
function initCookieConsent() {
    if (localStorage.getItem('prime_cookie_consent')) return;

    const overlay = document.createElement('div');
    overlay.className = 'cookie-overlay';
    overlay.innerHTML = `
        <div class="cookie-modal">
            <div class="c-modal-header">
                <h3>Manage Consent</h3>
                <p>We use technologies like cookies to store and/or access device information. Consenting helps us deliver the best Prime Rubber experience directly tailored to your industry needs.</p>
            </div>
            <div class="c-options">
                <div class="c-option-row">
                    <div class="c-opt-left">
                        <span class="c-opt-title">Functional</span>
                    </div>
                    <span style="color: #059669; font-weight: 600; font-size: 0.85rem;">Always active &nbsp;<i class="fas fa-chevron-down"></i></span>
                </div>
                <div class="c-option-row">
                    <div class="c-opt-left">
                        <span class="c-opt-title">Statistics</span>
                    </div>
                    <div>
                        <input type="checkbox" class="c-toggle" id="cOptStat">
                        <i class="fas fa-chevron-down" style="margin-left:8px; color:#1e293b; font-size:0.8rem;"></i>
                    </div>
                </div>
                <div class="c-option-row">
                    <div class="c-opt-left">
                        <span class="c-opt-title">Marketing</span>
                    </div>
                    <div>
                        <input type="checkbox" class="c-toggle" id="cOptMark">
                        <i class="fas fa-chevron-down" style="margin-left:8px; color:#1e293b; font-size:0.8rem;"></i>
                    </div>
                </div>
            </div>
            <a href="#" style="font-size: 0.8rem; color: #3b82f6; text-decoration: underline; display: block; margin-bottom: 15px;">Manage services</a>
            <div class="c-footer">
                <button class="c-btn c-btn-accept" id="cookieAcceptBtn">Accept All</button>
                <button class="c-btn c-btn-deny" id="cookieDenyBtn">Deny Optional</button>
                <button class="c-btn c-btn-save" id="cookieSaveBtn">Save Selected</button>
            </div>
            <div class="c-links">
                <a href="./privacy.html">Privacy Policy</a> | <a href="./terms.html">Cookie Policy</a>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => overlay.classList.add('active'), 1500);

    const saveBtn = overlay.querySelector('#cookieSaveBtn');
    const acceptBtn = overlay.querySelector('#cookieAcceptBtn');
    const denyBtn = overlay.querySelector('#cookieDenyBtn');

    const closeConsent = (consentData) => {
        localStorage.setItem('prime_cookie_consent', JSON.stringify(consentData));
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 500);
    };

    saveBtn.onclick = () => {
        closeConsent({
            functional: true,
            statistics: document.getElementById('cOptStat').checked,
            marketing: document.getElementById('cOptMark').checked
        });
    };

    acceptBtn.onclick = () => {
        closeConsent({ functional: true, statistics: true, marketing: true });
    };

    denyBtn.onclick = () => {
        closeConsent({ functional: true, statistics: false, marketing: false });
    };
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
} else {
    setTimeout(initCookieConsent, 500);
}
