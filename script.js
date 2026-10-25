// Lahori Biryani House - script.js

document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupContactForm();
    setupBackToTop();
});

/* ---------- Mobile menu ---------- */
function setupMobileMenu() {
    const header = document.querySelector(".header");
    const nav = header && header.querySelector("nav");
    if (!nav) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "menu-toggle";
    button.textContent = "Menu";
    button.setAttribute("aria-expanded", "false");

    // The nav may sit inside a wrapper div (contact page), so find the direct child
    const navBlock = [...header.children].find((c) => c === nav || c.contains(nav));
    header.insertBefore(button, navBlock);

    button.addEventListener("click", () => {
        const open = header.classList.toggle("nav-open");
        button.setAttribute("aria-expanded", String(open));
        button.textContent = open ? "Close" : "Menu";
    });

    // Close the menu when a link is tapped or Escape is pressed
    nav.addEventListener("click", (e) => {
        if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });

    function closeMenu() {
        header.classList.remove("nav-open");
        button.setAttribute("aria-expanded", "false");
        button.textContent = "Menu";
    }
}

/* ---------- Contact form ---------- */
function setupContactForm() {
    const form = document.querySelector("main > form");
    if (!form) return;

    form.noValidate = true; // show our own error messages

    const rules = {
        name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
        email: (v) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
                ? ""
                : "Please enter a valid email address.",
        message: (v) =>
            v.trim().length >= 10 ? "" : "Please write at least 10 characters.",
    };

    function check(field) {
        const rule = rules[field.name];
        if (!rule) return true;
        const error = rule(field.value);
        let note = field.nextElementSibling;
        if (!note || !note.classList.contains("field-error")) {
            note = document.createElement("small");
            note.className = "field-error";
            note.setAttribute("role", "alert");
            field.insertAdjacentElement("afterend", note);
        }
        note.textContent = error;
        field.setAttribute("aria-invalid", error ? "true" : "false");
        return !error;
    }

    form.querySelectorAll("input, textarea").forEach((field) => {
        field.addEventListener("blur", () => check(field));
        field.addEventListener("input", () => {
            if (field.getAttribute("aria-invalid") === "true") check(field);
        });
    });

    form.addEventListener("submit", (e) => {
        const fields = [...form.querySelectorAll("input, textarea")];
        const results = fields.map(check);
        if (results.includes(false)) {
            e.preventDefault();
            fields[results.indexOf(false)].focus();
            return;
        }
        const submit = form.querySelector("button[type='submit']");
        submit.disabled = true;
        submit.textContent = "Sending...";
    });
}

/* ---------- Back to top ---------- */
function setupBackToTop() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "back-to-top";
    button.textContent = "Top";
    button.setAttribute("aria-label", "Back to top");
    button.hidden = true;
    document.body.appendChild(button);

    window.addEventListener(
        "scroll",
        () => { button.hidden = window.scrollY < 500; },
        { passive: true }
    );

    button.addEventListener("click", () => {
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
    });
}