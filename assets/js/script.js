const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const scrollTop = document.querySelector(".scroll-top");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector(".form-note");
const slides = [...document.querySelectorAll(".hero-slide")];
const nextSlideButton = document.querySelector("[data-slide-next]");
const prevSlideButton = document.querySelector("[data-slide-prev]");
const dotsWrap = document.querySelector("[data-slide-dots]");
let activeSlide = 0;
let slideTimer;

function refreshIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function updateHeader() {
    if (!header) {
        return;
    }

    header.classList.toggle("scrolled", window.scrollY > 18);

    if (scrollTop) {
        scrollTop.classList.toggle("show", window.scrollY > 520);
    }
}

function setActiveNav() {
    const page = document.body.dataset.page;

    document.querySelectorAll("[data-nav]").forEach((link) => {
        link.classList.toggle("active", link.dataset.nav === page);
    });
}

function closeMenu() {
    if (!mainNav || !menuToggle || !header) {
        return;
    }

    mainNav.classList.remove("show");
    header.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    refreshIcons();
}

if (menuToggle && mainNav && header) {
    menuToggle.addEventListener("click", () => {
        const open = mainNav.classList.toggle("show");

        header.classList.toggle("menu-open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
        refreshIcons();
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });
}

document.querySelectorAll("[data-faq]").forEach((button) => {
    button.addEventListener("click", () => {
        const item = button.closest(".faq-item");

        if (!item) {
            return;
        }

        item.classList.toggle("open");
        button.setAttribute("aria-expanded", String(item.classList.contains("open")));
    });
});

if (scrollTop) {
    scrollTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

if (contactForm && formNote) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        formNote.classList.add("show");
        formNote.textContent = "Pesan sudah disiapkan. Untuk versi online, tombol ini bisa dihubungkan ke email, WhatsApp, atau Google Form FKMK.";
        contactForm.reset();
    });
}

function showSlide(index) {
    if (!slides.length) {
        return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === activeSlide);
    });

    document.querySelectorAll("[data-slide-dot]").forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === activeSlide);
        dot.setAttribute("aria-current", String(dotIndex === activeSlide));
    });
}

function startSlideTimer() {
    if (slides.length < 2) {
        return;
    }

    window.clearInterval(slideTimer);
    slideTimer = window.setInterval(() => showSlide(activeSlide + 1), 6500);
}

if (slides.length && dotsWrap) {
    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.dataset.slideDot = String(index);
        dot.setAttribute("aria-label", `Lihat slide ${index + 1}`);
        dot.addEventListener("click", () => {
            showSlide(index);
            startSlideTimer();
        });
        dotsWrap.append(dot);
    });

    showSlide(0);
    startSlideTimer();
}

if (nextSlideButton) {
    nextSlideButton.addEventListener("click", () => {
        showSlide(activeSlide + 1);
        startSlideTimer();
    });
}

if (prevSlideButton) {
    prevSlideButton.addEventListener("click", () => {
        showSlide(activeSlide - 1);
        startSlideTimer();
    });
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
    if (window.innerWidth > 1040) {
        closeMenu();
    }
});

updateHeader();
setActiveNav();
refreshIcons();
