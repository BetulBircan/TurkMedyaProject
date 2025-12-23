import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/mainStyle.scss';
import { initTheme } from './js/theme.js';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import haber1 from './assets/haber1.jpg';
import haber2 from './assets/bir-tasla-uc-kus-yunanistan.jpg';
import haber3 from './assets/turkiyenato.webp';
import haber4 from './assets/korgeneral-osman-erbas.jpg';
import haber5 from './assets/oramiral-davidson.jpg';

// Sayfa yüklendiğinde temayı başlat
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDate();
    initBreakingNews();
    initNewsSnippets();
    adjustBreakingPrevPosition();
    window.addEventListener('resize', adjustBreakingPrevPosition);
});

// Tarih gösterimi
function initDate(overrides) {
    // overrides (optional): { gregorian: '5 Mart 2021 Cuma', hijri: '21 Recep 1442' }
    const dateElement = document.getElementById('currentDate');
    if (!dateElement) return;

    if (overrides && (overrides.gregorian || overrides.hijri)) {
        const g = overrides.gregorian || '';
        const h = overrides.hijri ? ` / ${overrides.hijri}` : '';
        dateElement.textContent = `${g}${h}`.trim();
        return;
    }

    const dataGregorian = dateElement.dataset.gregorian; // full display string
    const dataHijri = dateElement.dataset.hijri; // full display string
    if (dataGregorian || dataHijri) {
        const h = dataHijri ? ` / ${dataHijri}` : '';
        dateElement.textContent = `${dataGregorian || ''}${h}`.trim();
        return;
    }

    const now = new Date();
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    // Basit İslami tarih tahmini (yaklaşık)
    const hijriYear = Math.floor((year - 622) * 1.0307);
    const hijriMonth = Math.floor((now.getMonth() + 1) * 0.97);
    const hijriDate = Math.floor(date * 0.97);

    const hijriMonths = [
        'Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir', 'CemaziyelEvvel',
        'CemaziyelAhir', 'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'
    ];

    dateElement.textContent = `${date} ${month} ${year} ${day} / ${hijriDate} ${hijriMonths[hijriMonth - 1] || 'CemaziyelAhir'} ${hijriYear}`;
}

// Breaking News Carousel
function initBreakingNews() {
    const breakingNewsCarousel = document.querySelector('.breaking-news-carousel');
    if (!breakingNewsCarousel) return;

    const swiper = new Swiper(breakingNewsCarousel, {
        modules: [Navigation, Autoplay],
        slidesPerView: 'auto',
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        speed: 800,
        navigation: {
            nextEl: '.breaking-news-next',
            prevEl: '.breaking-news-prev',
        },
    });

    return swiper;
}

// News Snippets Interactive
function initNewsSnippets() {
    const newsSnippets = document.querySelectorAll('.news-snippet');
    const featuredImage = document.getElementById('featuredImage');
    const featuredHeadline = document.getElementById('featuredHeadline');

    if (!newsSnippets.length || !featuredImage || !featuredHeadline) return;

    // Haber verileri
    const newsData = [
        {
            image: haber1,
            headline: "Şehitlerimize dualarla veda... Başkan Erdoğan: Komutanlığın ötesinde duruşuyla çok değerliydi.",
            alt: "CHP'nin 'Cemevi' provokasyonuna sert tepki"
        },
        {
            image: haber2,
            headline: "Bir taşla üç kuş: Yunanistan, Rumlar ve Fransa panikte! Yeni bir Türkiye cephesi oluşuyor",
            alt: "Hamas açıklaması"
        },
        {
            image: haber3,
            headline: "Nato Avrupa Birliğini uyardı. Türkiye'ye övgü.Bölgedeki rolü vurgulandı",
            alt: "Terörsüz Türkiye"
        },
        {
            image: haber4,
            headline: "Şehit Korgeneral Osman Erbaş'ın FETÖ'cü hain için 'vur' emri verdiği ortaya çıktı",
            alt: "Komşunun etki alanı"
        },
        {
            image: haber5,
            headline: "Oramiral Davidson'uyardı: Hava hareketliliğini artırdılar, gelecek 6 yıl için çok kaygılıyım",
            alt: "Asgari ücret"
        }
    ];

    // Her haber özetine hover olayı ekle
    newsSnippets.forEach((snippet, index) => {
        snippet.addEventListener('mouseenter', () => {
            // Tüm active class'ları kaldır
            newsSnippets.forEach(s => s.classList.remove('active'));

            // Hover yapılan öğeye active class ekle
            snippet.classList.add('active');

            // Ana haberi güncelle
            if (newsData[index]) {
                featuredImage.src = newsData[index].image;
                featuredImage.alt = newsData[index].alt;
                featuredHeadline.textContent = newsData[index].headline;
            }
        });
    });
}


function adjustBreakingPrevPosition() {
    const section = document.querySelector('.breaking-news-section');
    if (!section) return;
    const wrapper = section.querySelector('.breaking-news-wrapper') || section;
    const divider = section.querySelector('.breaking-news-divider');
    if (!wrapper || !divider) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const dividerRect = divider.getBoundingClientRect();

    // distance from wrapper left to the right edge of the divider
    const edge = Math.round(dividerRect.right - wrapperRect.left);
    const value = `${edge}px`;
    section.style.setProperty('--breaking-label-edge', value);
    wrapper.style.setProperty('--breaking-label-edge', value);
}





