

document.addEventListener('DOMContentLoaded', () => {
    // 1. تشغيل التحكم بالوضع المظلم
    initThemeControl();

    // 2. تشغيل زر العودة للأعلى
    initScrollToTop();

    // 3. تشغيل نظام الحجز (النافذة المنبثقة)
    initBookingSystem();
});

// --- إدارة الوضع المظلم ---
function initThemeControl() {
    const themeBtn = document.getElementById('modeToggle');
    if (themeBtn) {
        // التحقق مما إذا كان المستخدم قد اختار الوضع المظلم مسبقاً
        if (localStorage.getItem('morshedTheme') === 'dark') {
            document.body.classList.add('dark-mode-active');
            updateThemeIcon(themeBtn, true);
        }

        themeBtn.addEventListener('click', () => {
            // تبديل الكلاس في الـ body
            document.body.classList.toggle('dark-mode-active');
            const isDark = document.body.classList.contains('dark-mode-active');
            
            // حفظ التفضيلات في المتصفح
            localStorage.setItem('morshedTheme', isDark ? 'dark' : 'light');
            
            // تحديث الأيقونة
            updateThemeIcon(themeBtn, isDark);
        });
    }
}

// وظيفة مساعدة لتغيير شكل الأيقونة
function updateThemeIcon(btn, isDark) {
    const icon = btn.querySelector('i');
    if(icon) {
        icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    }
}

// --- ميزة العودة للأعلى ---
function initScrollToTop() {
    const topBtn = document.getElementById('scrollTop');
    if (topBtn) {
        window.addEventListener('scroll', () => {
            // يظهر الزر عند النزول أكثر من 300 بكسل
            if (window.scrollY > 300) {
                topBtn.style.display = "flex"; // نستخدم flex لضمان توسيط السهم
            } else {
                topBtn.style.display = "none";
            }
        });

        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// --- نظام الحجز (Modal Logic) ---
function initBookingSystem() {
    const bookingForm = document.getElementById('registrationForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // منع الصفحة من إعادة التحميل
            
            // جلب اسم الشخص من النموذج
            const clientName = bookingForm.querySelector('input[type="text"]').value;
            
            // إظهار رسالة نجاح
            alert(`تهانينا! تم تأكيد حجزك يا ${clientName} في مرشدك بنجاح.`);
            
            // إغلاق المودال برمجياً باستخدام Bootstrap
            const modalElement = document.getElementById('bookingModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
            
            bookingForm.reset(); // تفريغ الخانات بعد النجاح
        });
    }
}


// ---  البحث والفلترة ---
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const locationFilter = document.getElementById('locationFilter');
const dateFilter = document.getElementById('dateFilter');

// التأكد من وجود العناصر قبل البدء
if (searchInput && categoryFilter && locationFilter && dateFilter) {
    
    // 1. وظيفة الفلترة الأساسية
    function filterEvents() {
        const searchText = searchInput.value.trim().toLowerCase();
        const selectedCat = categoryFilter.value;
        const selectedLoc = locationFilter.value;
        const selectedDate = dateFilter.value;

        // حفظ القيم الحالية في المتصفح (لحفظ الحالة عند تحديث الصفحة)
        localStorage.setItem('morshed_search', searchText);
        localStorage.setItem('morshed_cat', selectedCat);
        localStorage.setItem('morshed_loc', selectedLoc);
        localStorage.setItem('morshed_date', selectedDate);

        // جلب كل العناصر التي تحمل كلاس event-item
        const items = document.querySelectorAll('.event-item');
        
        items.forEach(item => {
            const title = item.querySelector('.card-title').innerText.toLowerCase();
            const category = item.getAttribute('data-category');
            const location = item.getAttribute('data-location');
            const eventDate = item.getAttribute('data-date');

            // شروط المطابقة
            const matchesSearch = title.includes(searchText);
            const matchesCat = (selectedCat === 'all' || category === selectedCat);
            const matchesLoc = (selectedLoc === 'all' || location === selectedLoc);
            const matchesDate = (!selectedDate || eventDate === selectedDate);

            // إظهار أو إخفاء العنصر
            if (matchesSearch && matchesCat && matchesLoc && matchesDate) {
                item.style.setProperty('display', 'block', 'important');
            } else {
                item.style.setProperty('display', 'none', 'important');
            }
        });
    }

    // 2. تحميل الفلاتر المحفوظة عند فتح الصفحة
    function loadSavedFilters() {
        if (localStorage.getItem('morshed_search')) searchInput.value = localStorage.getItem('morshed_search');
        if (localStorage.getItem('morshed_cat')) categoryFilter.value = localStorage.getItem('morshed_cat');
        if (localStorage.getItem('morshed_loc')) locationFilter.value = localStorage.getItem('morshed_loc');
        if (localStorage.getItem('morshed_date')) dateFilter.value = localStorage.getItem('morshed_date');
        
        filterEvents(); // تشغيل الفلترة فوراً بناءً على القيم المحفوظة
    }

    // 3. مراقبة التغييرات في المدخلات
    window.addEventListener('DOMContentLoaded', loadSavedFilters);
    searchInput.addEventListener('input', filterEvents);
    categoryFilter.addEventListener('change', filterEvents);
    locationFilter.addEventListener('change', filterEvents);
    dateFilter.addEventListener('change', filterEvents);
}

// --- التحقق من نموذج التواصل وعرض التنبيهات ---
const contactForm = document.getElementById('contactForm');
const contactAlert = document.getElementById('contactAlert');

if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault(); // منع الصفحة من التحديث
        
        // استخدام خاصية التفعيل الخاصة بـ Bootstrap للتحقق
        if (!contactForm.checkValidity()) {
            event.stopPropagation();
            contactForm.classList.add('was-validated');
            
            // عرض تنبيه فشل (Alert)
            showAlert('Please fill in all fields correctly!', 'danger');
        } else {
            // في حال كانت البيانات سليمة
            showAlert('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset(); // تصفير الحقول
            contactForm.classList.remove('was-validated');
        }
    });
}

// دالة عرض التنبيهات (Bootstrap Alert)
function showAlert(message, type) {
    contactAlert.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show border-0 shadow-sm" role="alert">
            <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // إخفاء التنبيه تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance(document.querySelector('.alert'));
        if (alert) alert.close();
    }, 5000);
}