// ===== CONFIGURAÇÕES GLOBAIS =====
// SUBSTITUIR: numero WhatsApp em formato internacional: +55XXXXXXXXXXX
const WHATSAPP_NUMBER = '5571999865878';

// ===== HEADER INTELIGENTE =====
class HeaderManager {
constructor() {
this.header = document.getElementById('header');
this.lastScrollY = window.scrollY;
this.scrollingDown = false;
this.init();
}

init() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
}

handleScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
        // Rolando para baixo
        if (!this.scrollingDown) {
            this.header.classList.add('hidden');
            this.scrollingDown = true;
        }
    } else {
        // Rolando para cima
        if (this.scrollingDown || currentScrollY <= 100) {
            this.header.classList.remove('hidden');
            this.scrollingDown = false;
        }
    }

    this.lastScrollY = currentScrollY;
}
}

// ===== SCROLL SUAVE =====
class SmoothScroll {
constructor() {
this.init();
}

init() {
    document.addEventListener('click', this.handleClick.bind(this));
}

handleClick(e) {
    const link = e.target.closest('a[href^="#"]');
    
    if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}
}

// ===== SCROLL REVEAL =====
class ScrollReveal {
constructor() {
this.elements = document.querySelectorAll('.reveal');
this.init();
}

init() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    this.elements.forEach(element => {
        observer.observe(element);
    });
}
}

// ===== CARROSSEL ANTES/DEPOIS =====
class Carousel {
constructor(container) {
this.container = container;
this.track = container.querySelector('.carousel-track');
this.slides = container.querySelectorAll('.carousel-slide');
this.prevBtn = container.querySelector('.carousel-prev');
this.nextBtn = container.querySelector('.carousel-next');
this.indicatorsContainer = container.querySelector('.carousel-indicators');
this.currentIndex = 0;
this.touchStartX = 0;
this.touchEndX = 0;

    this.init();
}

init() {
    this.createIndicators();
    this.addEventListeners();
    this.updateCarousel();
}

createIndicators() {
    this.slides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.classList.add('carousel-indicator');
        indicator.setAttribute('aria-label', `Ir para slide ${index + 1}`);
        
        if (index === 0) {
            indicator.classList.add('active');
        }
        
        indicator.addEventListener('click', () => {
            this.goToSlide(index);
        });
        
        this.indicatorsContainer.appendChild(indicator);
    });
}

addEventListeners() {
    this.prevBtn.addEventListener('click', () => {
        this.prevSlide();
    });

    this.nextBtn.addEventListener('click', () => {
        this.nextSlide();
    });

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (document.activeElement.closest('.carousel')) {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        }
    });

    // Suporte a touch
    this.track.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
    });

    this.track.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    });
}

handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            this.nextSlide();
        } else {
            this.prevSlide();
        }
    }
}

nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateCarousel();
}

prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
}

goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
}

updateCarousel() {
    const translateX = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${translateX}%)`;

    // Atualizar indicadores
    this.indicatorsContainer.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === this.currentIndex);
    });
}
}

// ===== FORMULÁRIO WHATSAPP =====
class WhatsAppForm {
constructor() {
this.form = document.getElementById('whatsappForm');
this.modal = document.getElementById('formModal');
this.init();
}

init() {
    // Abrir modal
    document.querySelectorAll('.open-form').forEach(button => {
        button.addEventListener('click', () => {
            this.openModal();
        });
    });

    // Fechar modal
    this.modal.querySelector('.modal-close').addEventListener('click', () => {
        this.closeModal();
    });

    // Fechar modal clicando fora
    this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
            this.closeModal();
        }
    });

    // Enviar formulário
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
}

openModal() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.form.reset();
}

handleSubmit(e) {
    e.preventDefault();
    
    if (this.validateForm()) {
        this.sendToWhatsApp();
    }
}

validateForm() {
    const requiredFields = this.form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            this.showError(field, 'Este campo é obrigatório');
            isValid = false;
        } else {
            this.clearError(field);
        }
    });

    return isValid;
}

showError(field, message) {
    this.clearError(field);
    
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ff4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'block';
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = '#ff4444';
}

clearError(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

sendToWhatsApp() {
    const formData = new FormData(this.form);
    const data = {
        nome: formData.get('nome'),
        cidade: formData.get('cidade'),
        bairro: formData.get('bairro'),
        tipo_demanda: formData.get('tipo_demanda'),
        mensagem: formData.get('mensagem') || ''
    };

    const message = `Olá, sou ${data.nome}. Preciso de orçamento para ${data.tipo_demanda}. Local: ${data.cidade} - ${data.bairro}. ${data.mensagem ? `Observações: ${data.mensagem}` : ''}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    this.closeModal();
    window.open(whatsappUrl, '_blank');
}
}

// ===== MENU MOBILE =====
class MobileMenu {
constructor() {
this.menuToggle = document.querySelector('.menu-toggle');
this.sidebar = document.querySelector('.sidebar');
this.nav = document.querySelector('.nav'); // <-- nova referência
this.header = document.getElementById('header'); // <-- nova referência ao header
this.init();
}

init() {
    if (!this.menuToggle || !this.sidebar) return;
    this.menuToggle.addEventListener('click', () => {
      this.toggleMenu();
    });

    // Fechar menu ao clicar em um link
    this.sidebar.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        this.closeMenu();
      }
    });
  }

toggleMenu() {
    this.sidebar.classList.toggle('active');
    this.menuToggle.classList.toggle('active');
    // esconder a barra de navegação quando o menu abre
    if (this.nav) this.nav.classList.toggle('nav-hidden-by-menu');

    // esconder o header enquanto o menu estiver aberto para não tapar o conteúdo
    if (this.header) {
      if (this.sidebar.classList.contains('active')) {
        // menu abriu -> garantir header oculto
        this.header.classList.add('hidden');
      } else {
        // menu fechou -> apenas reexibir se estivermos perto do topo
        if (window.scrollY <= 100) {
          this.header.classList.remove('hidden');
        }
      }
    }

    // Animar ícone do menu
    const spans = this.menuToggle.querySelectorAll('span');
    if (this.sidebar.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      this.menuToggle.setAttribute('aria-expanded', 'true');
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
      this.menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

closeMenu() {
    this.sidebar.classList.remove('active');
    this.menuToggle.classList.remove('active');

    if (this.nav) this.nav.classList.remove('nav-hidden-by-menu');

    // garantir que o header volte apenas se não estiver escondido por scroll
    if (this.header && window.scrollY <= 100) {
      this.header.classList.remove('hidden');
    }

    const spans = this.menuToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
    this.menuToggle.setAttribute('aria-expanded', 'false');
  }
}

// ===== LAZY LOADING =====
class LazyLoader {
constructor() {
this.images = document.querySelectorAll('img[loading="lazy"]');
this.init();
}

init() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    observer.unobserve(img);
                }
            });
        });

        this.images.forEach(img => {
            observer.observe(img);
        });
    }
}
}

// ===== DEBOUNCE =====
function debounce(func, wait) {
let timeout;
return function executedFunction(...args) {
const later = () => {
clearTimeout(timeout);
func(...args);
};
clearTimeout(timeout);
timeout = setTimeout(later, wait);
};
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
// Inicializar componentes
new HeaderManager();
new SmoothScroll();
new ScrollReveal();
new WhatsAppForm();
new MobileMenu();
new LazyLoader();

// Inicializar carrosséis
document.querySelectorAll('.carousel').forEach(carousel => {
    new Carousel(carousel);
});

  // Debounce para eventos de scroll
  const debouncedScroll = debounce(() => {
      // Eventos que precisam de debounce
  }, 10);

  window.addEventListener('scroll', debouncedScroll);
});

// ===== PONTOS PARA FUTURA INTEGRAÇÃO =====
// PARA SWIPER: Substituir o carrossel customizado por Swiper.js quando necessário
// PARA GSAP: Adicionar animações GSAP nos elementos quando a lib for incluída

// --- assets/ (lista de arquivos placeholder) ---
// logo-placeholder.svg (Logo da empresa - substituir pelo arquivo SVG real)
// placeholder-hero.jpg (Imagem principal do hero - substituir por imagem/vídeo real)
// placeholder-before.jpg (Imagem "antes" do carrossel - substituir por fotos reais)
// placeholder-after.jpg (Imagem "depois" do carrossel - substituir por fotos reais)
// placeholder-thumb.jpg (Miniatura para depoimentos e portfólio - substituir por imagens reais)
// Gustavo-Rocha-Engenharia.pdf (PDF institucional - substituir pelo arquivo PDF real)

// --- README.md ---