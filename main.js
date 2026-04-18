// --- Neural Mesh Animation for Hero ---
const initHeroAnimation = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height, particles;
    const particleCount = 60;
    const maxVelocity = 0.5;
    const lineDist = 150;

    const resize = () => {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * maxVelocity;
            this.vy = (Math.random() - 0.5) * maxVelocity;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(143, 97, 246, 0.5)';
            ctx.fill();
        }
    }

    const createParticles = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach((p, i) => {
            p.update();
            p.draw();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < lineDist) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(143, 97, 246, ${0.1 * (1 - dist / lineDist)})`;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    createParticles();
    animate();
};

// --- Core State & Logic ---
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const today = new Date();

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Elements
const calendarGrid = document.getElementById('calendar-grid');
const monthYearDisplay = document.getElementById('calendar-month-year');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');
const timeSlots = document.querySelectorAll('.time-slot');

// --- Intersection Observer for Fade-in Sections ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

// Target segments with explicit reveal class for reliability
document.querySelectorAll('.fade-reveal').forEach(el => observer.observe(el));

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
}, { passive: true });

// --- Mobile Navigation Toggle ---
const menuToggle = document.getElementById('menu-toggle');
const body = document.body;

if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        body.classList.toggle('mobile-active');
    });
}

// Auto-close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        body.classList.remove('mobile-active');
    });
});

// Close menu if clicking outside
document.addEventListener('click', (e) => {
    if (body.classList.contains('mobile-active') && !e.target.closest('.nav-links') && !e.target.closest('#menu-toggle')) {
        body.classList.remove('mobile-active');
    }
});

// --- Smooth Sticky Cards Reveal ---
const cardObserverOptions = {
    threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    rootMargin: "0px 0px -20% 0px"
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const card = entry.target;
        const ratio = entry.intersectionRatio;

        if (ratio > 0.05) {
            const easedRatio = Math.min(1, ratio * 1.5);
            card.style.opacity = easedRatio;
            const translateY = 40 * (1 - easedRatio);
            const scale = 0.96 + (0.04 * easedRatio);
            card.style.transform = `translateY(${translateY}px) scale(${scale})`;
            
            if (easedRatio > 0.8) {
                card.style.borderColor = 'var(--accent-violet)';
            } else {
                card.style.borderColor = 'var(--border-primary)';
            }
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) scale(0.96)';
        }
    });
}, cardObserverOptions);

document.querySelectorAll('.service-reveal-card').forEach(card => cardObserver.observe(card));

// --- Functional Calendar ---
function renderCalendar(month, year) {
    if (!calendarGrid) return;
    const labels = Array.from(calendarGrid.querySelectorAll('.cal-label'));
    calendarGrid.innerHTML = '';
    labels.forEach(label => calendarGrid.appendChild(label));

    monthYearDisplay.innerText = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < adjustedFirstDay; i++) {
        const d = document.createElement('div');
        d.className = 'cal-date empty';
        calendarGrid.appendChild(d);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const d = document.createElement('div');
        d.className = 'cal-date';
        d.innerText = day;

        const dateObj = new Date(year, month, day);
        if (dateObj.toDateString() === today.toDateString()) d.classList.add('today');
        
        const compareToday = new Date();
        compareToday.setHours(0,0,0,0);
        if (dateObj < compareToday) d.classList.add('disabled');

        d.addEventListener('click', () => {
            if (d.classList.contains('disabled')) return;
            document.querySelectorAll('.cal-date').forEach(el => el.classList.remove('selected'));
            d.classList.add('selected');
        });

        calendarGrid.appendChild(d);
    }
}

if (prevBtn) prevBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentMonth, currentYear);
});

if (nextBtn) nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentMonth, currentYear);
});

timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
        timeSlots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
    });
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimation();
    renderCalendar(currentMonth, currentYear);
});
