// Stussy Neobrutalist E-Commerce - Carrinho, Busca & UI Global
document.addEventListener('DOMContentLoaded', () => {

    // === Estado do Carrinho ===
    let cart = [];
    try {
        const savedCart = localStorage.getItem('stussy_cart');
        if (savedCart) cart = JSON.parse(savedCart);
    } catch (e) {
        console.error('Erro ao carregar carrinho', e);
    }

    const cartToggle = document.getElementById('cart-toggle');
    const searchInput = document.querySelector('.search-input');
    const quickResults = document.querySelector('.quick-results');

    const defaultQuickLinksHTML = `
        <h4>ACESSO RÁPIDO:</h4>
        <div class="quick-tags">
            <a href="clothes.html">MOLETONS</a>
            <a href="tshirt.html">CAMISETAS</a>
            <a href="pants.html">CALÇAS</a>
            <a href="accessories.html">BONÉS</a>
        </div>
    `;

    // === Catálogo de Produtos ===
    const products = [
        {
            id: 'hoodie',
            name: 'MOLETOM STUSSY GLOBAL APPAREL - PRETO',
            price: 1980.00,
            image: 'hoodie.png',
            url: 'clothes.html',
            keywords: ['moletom', 'hoodie', 'blusa', 'casaco', 'roupas']
        },
        {
            id: 'cap',
            name: 'BONÉ STUSSY GLOBAL APPAREL - PRETO',
            price: 760.00,
            image: 'bone_mockup-removebg-preview.png',
            url: 'accessories.html',
            keywords: ['boné', 'bone', 'cap', 'hat', 'acessório']
        },
        {
            id: 'tshirt',
            name: 'CAMISETA STUSSY WORLD TOUR - BRANCA',
            price: 490.00,
            image: 'tshirt.png',
            url: 'tshirt.html',
            keywords: ['camiseta', 'tshirt', 't-shirt', 'camisa', 'roupas']
        },
        {
            id: 'pants',
            name: 'CALÇA CARGO STUSSY WORK - BEGE',
            price: 890.00,
            image: 'pants.png',
            url: 'pants.html',
            keywords: ['calça', 'pants', 'cargo', 'roupas']
        },
        {
            id: 'jacket',
            name: 'JAQUETA STUSSY GLOBAL APPAREL - PRETA',
            price: 2490.00,
            image: 'homemFrente.webp',
            url: 'jacket.html',
            keywords: ['jaqueta', 'jacket', 'casaco', 'roupas']
        },
        {
            id: 'shorts',
            name: 'BERMUDA STUSSY CARGO - BEGE',
            price: 590.00,
            image: 'homemFrenteECosta.png',
            url: 'shorts.html',
            keywords: ['bermuda', 'shorts', 'cargo', 'roupas']
        },
        {
            id: 'cap-bege',
            name: 'BONÉ STUSSY CLASSIC - BEGE',
            price: 580.00,
            image: 'bone.png',
            url: 'bone-bege.html',
            keywords: ['boné', 'bone', 'bege', 'classic', 'acessório']
        },
        {
            id: 'bag',
            name: 'SHOULDER BAG STUSSY - PRETA',
            price: 1290.00,
            image: 'acessorios.png',
            url: 'bag.html',
            keywords: ['bolsa', 'bag', 'shoulder', 'acessório']
        }
    ];

    // === Renderizar Carrinho ===
    function renderCart() {
        const drawerContentContainers = document.querySelectorAll('.drawer-content');
        const subtotalContainers = document.querySelectorAll('.subtotal');

        drawerContentContainers.forEach(container => {
            if (!container) return;
            if (cart.length === 0) {
                container.innerHTML = `
                    <div class="empty-cart-message" style="
                        text-align: center;
                        margin-top: 50px;
                        font-size: 18px;
                        font-weight: bold;
                        border: 3px dashed #0c080d;
                        padding: 30px 15px;
                        background-color: #fff;
                        box-shadow: 4px 4px 0px #0c080d;
                    ">
                        SEU CARRINHO ESTÁ VAZIO ★<br>COMECE A COMPRAR!
                    </div>
                `;
                return;
            }
            container.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>TAM: ${item.size} | QTD: ${item.qty}</p>
                        <div class="item-price">US$ ${(item.price * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <button class="remove-item" data-index="${index}">×</button>
                </div>
            `).join('');
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const formattedTotal = 'US$ ' + total.toLocaleString('en-US', { minimumFractionDigits: 2 });

        subtotalContainers.forEach(subtotalBox => {
            if (!subtotalBox) return;
            const valSpan = subtotalBox.querySelector('span:last-child');
            if (valSpan) valSpan.textContent = formattedTotal;
        });

        localStorage.setItem('stussy_cart', JSON.stringify(cart));
        updateBadge();
        updateFreteBar();
    }

    // === Badge de Contador ===
    function updateBadge() {
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        let badge = document.querySelector('.cart-badge');
        if (!badge) {
            const cartLabel = document.querySelector('label[for="cart-toggle"].icon-link');
            if (cartLabel) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                cartLabel.appendChild(badge);
            }
        }
        if (badge) {
            badge.textContent = totalQty;
            badge.style.display = totalQty > 0 ? 'flex' : 'none';
        }
    }

    // === Barra de Progresso de Frete ===
    function updateFreteBar() {
        const threshold = 150;
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const remaining = Math.max(0, threshold - subtotal);
        const progress = Math.min(100, (subtotal / threshold) * 100);

        let bar = document.querySelector('.frete-progress');
        if (!bar) {
            const drawerHeader = document.querySelector('.drawer-header');
            if (!drawerHeader) return;
            bar = document.createElement('div');
            bar.className = 'frete-progress';
            drawerHeader.insertAdjacentElement('afterend', bar);
        }

        if (remaining > 0) {
            bar.classList.remove('frete-free');
            bar.innerHTML = `
                <p>Falta <strong>US$ ${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> para frete grátis</p>
                <div class="frete-bar-track"><div class="frete-bar-fill" style="width: ${progress}%"></div></div>
            `;
        } else {
            bar.classList.add('frete-free');
            bar.innerHTML = `
                <p>★ Você ganhou frete grátis!</p>
                <div class="frete-bar-track"><div class="frete-bar-fill" style="width: 100%"></div></div>
            `;
        }
    }

    // === Adicionar Item ===
    function addItem(name, price, size, qty, image, id) {
        const existingIndex = cart.findIndex(item => item.id === id && item.size === size);
        if (existingIndex > -1) {
            cart[existingIndex].qty += qty;
        } else {
            cart.push({ id, name, price, size, qty, image });
        }
        renderCart();
        if (cartToggle) cartToggle.checked = true;
    }

    // === Remover Item ===
    document.body.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('remove-item')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            if (!isNaN(index) && index >= 0 && index < cart.length) {
                cart.splice(index, 1);
                renderCart();
            }
        }
    });

    // === Botão Adicionar ao Carrinho ===
    const addToCartBtn = document.querySelector('.buy-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const pathname = window.location.pathname;
            let name, price, image, id;

            if (pathname.includes('clothes.html')) {
                name = 'MOLETOM STUSSY GLOBAL APPAREL - PRETO';
                price = 1980.00; image = 'hoodie.png'; id = 'hoodie';
            } else if (pathname.includes('accessories.html')) {
                name = 'BONÉ STUSSY GLOBAL APPAREL - PRETO';
                price = 760.00; image = 'bone_mockup-removebg-preview.png'; id = 'cap';
            } else if (pathname.includes('tshirt.html')) {
                name = 'CAMISETA STUSSY WORLD TOUR - BRANCA';
                price = 490.00; image = 'tshirt.png'; id = 'tshirt';
            } else if (pathname.includes('pants.html')) {
                name = 'CALÇA CARGO STUSSY WORK - BEGE';
                price = 890.00; image = 'pants.png'; id = 'pants';
            } else if (pathname.includes('jacket.html')) {
                name = 'JAQUETA STUSSY GLOBAL APPAREL - PRETA';
                price = 2490.00; image = 'homemFrente.webp'; id = 'jacket';
            } else if (pathname.includes('shorts.html')) {
                name = 'BERMUDA STUSSY CARGO - BEGE';
                price = 590.00; image = 'bermuda.webp'; id = 'shorts';
            } else if (pathname.includes('bone-bege.html')) {
                name = 'BONÉ STUSSY CLASSIC - BEGE';
                price = 580.00; image = 'bone.png'; id = 'cap-bege';
            } else if (pathname.includes('bag.html')) {
                name = 'SHOULDER BAG STUSSY - PRETA';
                price = 1290.00; image = 'bag.jpg'; id = 'bag';
            } else {
                const pageTitle = document.querySelector('.product-info h1');
                const pagePrice = document.querySelector('.price');
                name = pageTitle ? pageTitle.innerText.replace('\n', ' ') : 'PRODUTO STUSSY';
                price = pagePrice ? parseFloat(pagePrice.innerText.replace(/[^0-9.]/g, '')) : 0;
                image = 'hoodie.png'; id = 'custom-item';
            }

            const activeSizeBtn = document.querySelector('.size-btn.active');
            const size = activeSizeBtn ? activeSizeBtn.innerText.trim() : 'M';
            const qtyValElement = document.getElementById('qty-val');
            const qty = qtyValElement ? parseInt(qtyValElement.innerText.trim()) : 1;

            addItem(name, price, size, qty, image, id);

            // Feedback visual no botão
            addToCartBtn.textContent = '✓ ADICIONADO!';
            addToCartBtn.classList.add('added');
            addToCartBtn.disabled = true;
            setTimeout(() => {
                addToCartBtn.textContent = 'ADICIONAR AO CARRINHO';
                addToCartBtn.classList.remove('added');
                addToCartBtn.disabled = false;
            }, 2000);
        });
    }

    // === Botão Finalizar Compra ===
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    // === Busca Dinâmica ===
    if (searchInput && quickResults) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                quickResults.innerHTML = defaultQuickLinksHTML;
                return;
            }
            const matches = products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.keywords.some(keyword => keyword.includes(query))
            );
            if (matches.length === 0) {
                quickResults.innerHTML = `
                    <h4 style="margin-bottom: 10px;">RESULTADO PARA "${query.toUpperCase()}":</h4>
                    <div style="border: 3px dashed #0c080d; background-color: #fff; box-shadow: 4px 4px 0px #0c080d; padding: 20px; font-weight: bold; text-align: center;">
                        NENHUM PRODUTO ENCONTRADO ★
                    </div>
                `;
            } else {
                quickResults.innerHTML = `
                    <h4 style="margin-bottom: 15px;">RESULTADO PARA "${query.toUpperCase()}":</h4>
                    <div style="display: flex; flex-direction: column; gap: 15px; max-width: 600px;">
                        ${matches.map(product => `
                            <div style="display: flex; align-items: center; gap: 15px; background-color: #fff; border: 3px solid #0c080d; box-shadow: 4px 4px 0px #0c080d; padding: 12px;">
                                <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border: 2px solid #0c080d;">
                                <div style="flex: 1;">
                                    <h5 style="font-size: 15px; font-weight: bold; color: #0c080d;">${product.name}</h5>
                                    <p style="font-size: 14px; font-weight: bold; color: #f2137b; margin-top: 3px;">US$ ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                </div>
                                <a href="${product.url}" class="btn" style="text-decoration: none; background-color: #4DEEEA; color: #0c080d; border: 2px solid #0c080d; padding: 6px 12px; font-size: 14px; font-weight: bold; box-shadow: 2px 2px 0px #0c080d; transition: all 0.1s ease;">VER</a>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        });
    }

    // === Hamburger Menu ===
    function initHamburger() {
        const header = document.querySelector('header');
        const navMenu = document.querySelector('.nav-menu');
        if (!header || !navMenu) return;

        const burger = document.createElement('button');
        burger.className = 'menu-burger';
        burger.setAttribute('aria-label', 'Abrir menu');
        burger.innerHTML = '<span></span><span></span><span></span>';
        header.appendChild(burger);

        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('nav-open');
            burger.classList.toggle('open');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('nav-open');
                burger.classList.remove('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && navMenu.classList.contains('nav-open')) {
                navMenu.classList.remove('nav-open');
                burger.classList.remove('open');
            }
        });
    }

    // === Newsletter ===
    function injectNewsletter() {
        if (window.location.pathname.includes('checkout.html')) return;
        const footer = document.querySelector('.footer');
        if (!footer) return;

        const section = document.createElement('section');
        section.className = 'newsletter-section';
        section.innerHTML = `
            <div class="newsletter-text">
                <h3>★ FIQUE POR DENTRO</h3>
                <p>Drops exclusivos e ofertas direto no seu e-mail.</p>
            </div>
            <form class="newsletter-form" onsubmit="return false;">
                <input type="email" class="newsletter-input" placeholder="SEU@EMAIL.COM" id="nl-input">
                <button type="submit" class="newsletter-btn" id="nl-btn">INSCREVER</button>
            </form>
        `;
        footer.parentNode.insertBefore(section, footer);

        document.getElementById('nl-btn').addEventListener('click', () => {
            const input = document.getElementById('nl-input');
            if (input.value.includes('@')) {
                input.value = '';
                input.placeholder = '✓ INSCRITO COM SUCESSO!';
                input.style.color = '#1a7a42';
                setTimeout(() => {
                    input.placeholder = 'SEU@EMAIL.COM';
                    input.style.color = '';
                }, 3500);
            } else {
                input.style.borderBottom = '3px solid #F2137B';
                input.placeholder = 'E-mail inválido!';
                setTimeout(() => {
                    input.style.borderBottom = '';
                    input.placeholder = 'SEU@EMAIL.COM';
                }, 2000);
            }
        });
    }

    // === "Você também pode gostar" ===
    function injectRelatedProducts() {
        const container = document.querySelector('.product-container');
        if (!container) return;

        const pathname = window.location.pathname;
        let currentId = null;
        products.forEach(p => {
            if (pathname.includes(p.url)) currentId = p.id;
        });

        const others = products.filter(p => p.id !== currentId);
        const selected = others.sort(() => Math.random() - 0.5).slice(0, 3);

        const section = document.createElement('section');
        section.className = 'related-products';
        section.innerHTML = `
            <h2 class="related-title">VOCÊ TAMBÉM PODE GOSTAR</h2>
            <div class="related-grid">
                ${selected.map(p => `
                    <div class="product-card">
                        <img src="${p.image}" alt="${p.name}" class="product-card-img" loading="lazy">
                        <div class="product-card-body">
                            <span class="product-card-badge">EM ESTOQUE</span>
                            <h3 class="product-card-name">${p.name}</h3>
                            <p class="product-card-price">US$ ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <a href="${p.url}" class="product-card-btn">VER PRODUTO</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        container.insertAdjacentElement('afterend', section);
    }

    // === Tooltips de Tamanho ===
    function initSizeTooltips() {
        const sizeMap = {
            'S': 'P / 88–96 cm',
            'M': 'M / 96–104 cm',
            'L': 'G / 104–112 cm',
            'XL': 'GG / 112–120 cm',
            '38': 'Cintura: 80 cm',
            '40': 'Cintura: 84 cm',
            '42': 'Cintura: 88 cm',
            '44': 'Cintura: 92 cm',
            'TAMANHO ÚNICO': 'Ajustável'
        };
        document.querySelectorAll('.size-btn').forEach(btn => {
            const tip = sizeMap[btn.textContent.trim()];
            if (tip) btn.setAttribute('data-tip', tip);
        });
    }

    // === Inicialização ===
    renderCart();
    initHamburger();
    injectNewsletter();
    injectRelatedProducts();
    initSizeTooltips();
});
