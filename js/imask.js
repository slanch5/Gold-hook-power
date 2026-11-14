const form = document.getElementById("contact-form");

// --- Маска телефону ---


// --- Валідація форми ---
const validator = new window.JustValidate("#contact-form", {
  errorFieldCssClass: "is-invalid",
  errorLabelCssClass: "field-error",
  successFieldCssClass: "is-valid",
});

validator
  .addField(
    "#firstName",
    [
      { rule: "required", errorMessage: "Введіть ім'я" },
      { rule: "minLength", value: 2, errorMessage: "Мінімум 2 символи" },
    ],
    { errorsContainer: "#firstName-errors-container" },
  )
  .addField(
    "#lastName",
    [
      { rule: "required", errorMessage: "Введіть прізвище" },
      { rule: "minLength", value: 2, errorMessage: "Мінімум 2 символи" },
    ],
    { errorsContainer: "#lastName-errors-container" },
  )
  .addField(
    "#middleName",
    [
      { rule: "required", errorMessage: "Введіть по батькові" },
      { rule: "minLength", value: 2, errorMessage: "Мінімум 2 символи" },
    ],
    { errorsContainer: "#middleName-errors-container" },
  )
  .addField(
    "#serviceInput",
    [{ rule: "required", errorMessage: "Оберіть тип проекту" }],
    { errorsContainer: "#service-errors-container" },
  )
  
  .addField(
    "#tg_user",
    [
      { rule: "required", errorMessage: "Введіть юзернейм" },
       { rule: "minLength", value: 2, errorMessage: "Мінімум 2 символи" },
     
    ],
    { errorsContainer: "#tg_user-errors-container" },
  )
  .onSuccess(async (event) => {
    event.preventDefault();

    const formData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      middleName: document.getElementById("middleName").value,
      service: document.getElementById("serviceInput").value,
      tgName: document.getElementById('tg_user').value
    };

    await sendToTelegram(formData);
  });

// --- Відправка заявки в Telegram ---

const submitBtn = document.querySelector(".contact__us__submit");

async function sendToTelegram(formData) {
  const serviceLabels = {
    landing: "Лендінг",
    shop: "Інтернет-магазин",
    webapp: "Веб-додаток",
    other: "Інше",
  };
  

  const text = [
  "🆕 Нова заявка на проект",
  "",
  `👤 Ім'я: ${formData.firstName}`,
  `👤 Прізвище: ${formData.lastName}`,
  `👤 По батькові: ${formData.middleName}`,
  `📁 Тип проекту: ${serviceLabels[formData.service] || formData.service}`,
  `✈️ Telegram: ${formData.tgName}`,
].join("\n");

  submitBtn.disabled = true;
  submitBtn.textContent = "Надсилаємо...";

  try {
    const response = await fetch("/.netlify/functions/send-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Telegram API error");
    }

    showSuccessMessage();
  } catch (error) {
    console.error("Помилка відправки заявки:", error.message);
    const error_el = document.createElement("div");
    error_el.className = "contact__us__error is-visible";
    error_el.innerHTML = `
      <svg class="contact__us__error__icon" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.6" />
        <path d="M12 7v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <circle cx="12" cy="16.2" r="1" fill="currentColor" />
      </svg>
      <span class="contact__us__error__text">
        Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте напряму.
      </span>
    `;

    submitBtn.insertAdjacentElement("afterend", error_el);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Надіслати заявку";
  }
}

// --- Блок "заявку надіслано" ---
const successMessage = document.getElementById("successMessage");
const sendAnotherBtn = document.getElementById("sendAnotherBtn");

function showSuccessMessage() {
  form.style.display = "none";
  successMessage.classList.add("is-visible");
}

function hideSuccessMessage() {
  successMessage.classList.remove("is-visible");
  form.style.display = "";
  form.reset();

  // скидаємо кастомний select і маску телефону до початкового стану
  const serviceSelectEl = document.getElementById("serviceSelect");
  serviceSelectEl.querySelector(".select__value").textContent =
    "оберіть послугу";
  serviceSelectEl
    .querySelector(".select__value")
    .classList.add("is-placeholder");
  document.getElementById("serviceInput").value = "";
  serviceSelectEl
    .querySelectorAll(".select__option")
    .forEach((o) => o.classList.remove("is-selected"));

 
}

if (sendAnotherBtn) {
  sendAnotherBtn.addEventListener("click", hideSuccessMessage);
}




