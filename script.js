const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const contactForm = document.getElementById("contactForm");
const serviceSelect = document.getElementById("serviceSelect");
const formNote = document.getElementById("formNote");

// غيّر YOUR_USERNAME إلى اسم حسابك الحقيقي بالإنستغرام
const INSTAGRAM_URL = "https://www.instagram.com/_h5_d/";

// قائمة الموبايل
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "إغلاق القائمة" : "فتح القائمة"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "فتح القائمة");
      menuToggle.textContent = "☰";
    });
  });
}

// تحديث السنة في أسفل الموقع
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// إنشاء نافذة اختيار الخدمة تلقائياً
// ما تحتاج تضيف HTML جديد
let instagramPopup = document.getElementById("instagramPopup");

if (!instagramPopup) {
  instagramPopup = document.createElement("div");
  instagramPopup.id = "instagramPopup";
  instagramPopup.className = "instagram-popup";
  instagramPopup.hidden = true;

  instagramPopup.innerHTML = `
    <p>اخترت خدمة: <strong id="selectedService"></strong></p>
    <p>اضغط على الزر أدناه للانتقال إلى حسابنا.</p>
    <a id="instagramLink"
       href="${INSTAGRAM_URL}"
       target="_blank"
       rel="noopener noreferrer">
       تواصل عبر إنستغرام ↗
    </a>
    <button type="button" id="closePopup">إغلاق</button>
  `;

  document.body.appendChild(instagramPopup);
}

const selectedService = document.getElementById("selectedService");
const instagramLink = document.getElementById("instagramLink");
const closePopup = document.getElementById("closePopup");

// الضغط على اطلب الخدمة
document.querySelectorAll(".service-link[data-service]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    const service = link.dataset.service || "خدمة رقمية";

    if (selectedService) {
      selectedService.textContent = service;
    }

    if (instagramLink) {
      instagramLink.href = INSTAGRAM_URL;
    }

    instagramPopup.hidden = false;
  });
});

// إغلاق النافذة
if (closePopup) {
  closePopup.addEventListener("click", () => {
    instagramPopup.hidden = true;
  });
}

// إغلاق النافذة عند الضغط خارجها
document.addEventListener("click", event => {
  if (
    instagramPopup &&
    !instagramPopup.hidden &&
    event.target === instagramPopup
  ) {
    instagramPopup.hidden = true;
  }
});

// تجهيز الطلب من نموذج التواصل إذا بقي موجوداً
if (contactForm) {
  contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    const name =
      document.getElementById("customerName")?.value.trim() || "";
    const service = serviceSelect?.value || "";
    const details =
      document.getElementById("details")?.value.trim() || "";

    if (!name || !service || !details) {
      if (formNote) {
        formNote.textContent = "يرجى ملء جميع الحقول أولاً.";
      }
      return;
    }

    const request =
      `طلب جديد - JARVIS DIGITAL SERVICES\n` +
      `الاسم: ${name}\n` +
      `الخدمة: ${service}\n` +
      `التفاصيل: ${details}`;

    try {
      await navigator.clipboard.writeText(request);

      if (formNote) {
        formNote.textContent =
          "تم نسخ تفاصيل الطلب. الصقها بعد فتح حساب إنستغرام.";
      }
    } catch {
      if (formNote) {
        formNote.textContent =
          "افتح إنستغرام وأرسل تفاصيل طلبك برسالة.";
      }
    }

    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  });
}

// اختيار الخدمة تلقائياً عند توفر رابط يحمل data-service
document.querySelectorAll("[data-service]").forEach(link => {
  link.addEventListener("click", () => {
    if (serviceSelect) {
      const service = link.dataset.service;
      const option = Array.from(serviceSelect.options).find(
        item => item.value === service || item.textContent.trim() === service
      );

      if (option) {
        serviceSelect.value = option.value;
      }
    }
  });
});