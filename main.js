// Constants & State
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

document.querySelectorAll('section:not(.sticky-section)').forEach(section => observer.observe(section));

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
    menuToggle.addEventListener('click', () => {
        body.classList.toggle('mobile-active');
    });
}

// Auto-close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        body.classList.remove('mobile-active');
    });
});

// --- Smooth Sticky Cards Reveal (Refined Observer) ---
// High-granularity thresholds for butter-smooth transitions
const cardObserverOptions = {
    threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    rootMargin: "0px 0px -20% 0px"
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const card = entry.target;
        const ratio = entry.intersectionRatio;

        // Smoothly map ratio to visual properties
        // We start visible effects at 0.1 ratio
        if (ratio > 0.05) {
            const easedRatio = Math.min(1, ratio * 1.5); // Accelerate the fade-in slightly
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

// Initial Render
renderCalendar(currentMonth, currentYear);

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
