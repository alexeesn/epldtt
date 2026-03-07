/* =========================
FADE IN ANIMATION
========================= */
const faders = document.querySelectorAll(".fade-in");
if (faders.length > 0) {
  const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("appear");
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach(fader => appearOnScroll.observe(fader));
}

/* =========================
SMOOTH SCROLL
========================= */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = link.getAttribute("href");
    if (document.querySelector(target)) {
      e.preventDefault();
      document.querySelector(target).scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* =========================
FAQ ACCORDION
========================= */
document.querySelectorAll(".faq-question").forEach(faq => {
  faq.addEventListener("click", () => {
    const open = faq.classList.toggle("active");
    const answer = faq.nextElementSibling;
    if (open) answer.style.maxHeight = answer.scrollHeight + "px";
    else answer.style.maxHeight = null;
  });
});

/* =========================
LOGIN / REGISTER SWITCH
========================= */
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if (loginBtn && registerBtn && loginForm && registerForm) {
  loginBtn.addEventListener("click", () => {
    loginBtn.classList.add("active");
    registerBtn.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
  });

  registerBtn.addEventListener("click", () => {
    registerBtn.classList.add("active");
    loginBtn.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
  });
}

/* =========================
REGISTER SYSTEM
========================= */
if (registerForm) {
  registerForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.email === email)) {
      alert("Email already registered!");
      return;
    }

    users.push({ name, email, password, subscriptions: [] });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created!");
    registerForm.reset();
    loginBtn.click();
  });
}

/* =========================
LOGIN SYSTEM
========================= */
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("Invalid email or password!");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Login successful!");

    const redirectPlan = localStorage.getItem("redirectPlan");
    if (redirectPlan) {
      localStorage.removeItem("redirectPlan");
      window.location.href = `checkout.html?plan=${redirectPlan}`;
    } else {
      window.location.href = "index.html";
    }
  });
}

/* =========================
SHOW PASSWORD
========================= */
const showPassword = (checkbox, input1, input2 = null) => {
  if (!checkbox) return;
  checkbox.addEventListener("change", () => {
    const type = checkbox.checked ? "text" : "password";
    if (input1) input1.type = type;
    if (input2) input2.type = type;
  });
};

showPassword(document.getElementById("showLoginPassword"), document.getElementById("loginPassword"));
showPassword(
  document.getElementById("showRegisterPassword"),
  document.getElementById("registerPassword"),
  document.getElementById("confirmPassword")
);

/* =========================
DYNAMIC NAVBAR PROFILE
========================= */
function loadNavbar() {
  const navUser = document.getElementById("navUser");
  if (!navUser) return;

  const loggedUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!loggedUser) {
    navUser.innerHTML = `<a href="auth.html" class="navbar__button">Get Started</a>`;
  } else {
    let dropdownLinks = `<a href="subscriptions.html">Subscriptions</a>`;
    
    if (loggedUser.role === "admin") {
      dropdownLinks += `<a href="admin.html">Admin Dashboard</a>`;
    }
    
    dropdownLinks += `<a href="#" id="logoutBtn">Logout</a>`;

    navUser.innerHTML = `
      <div class="profile-menu">
        <a href="#" class="navbar__button profile-btn">${loggedUser.name} ▾</a>
        <div class="profile-dropdown">
          ${dropdownLinks}
        </div>
      </div>
    `;

    const profileBtn = navUser.querySelector(".profile-btn");
    const profileDropdown = navUser.querySelector(".profile-dropdown");

    profileBtn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      profileDropdown.classList.toggle("show");
    });

    navUser.querySelector("#logoutBtn").addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });

    window.addEventListener("click", e => {
      if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
        profileDropdown.classList.remove("show");
      }
    });
  }
}
loadNavbar();

/* =========================
PLAN SUBSCRIBE BUTTONS + LOGIN CHECK
========================= */
document.querySelectorAll(".pricing-card__button").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const selectedPlan = btn.dataset.plan;

    if (!currentUser) {
      localStorage.setItem("redirectPlan", selectedPlan);
      alert("Please login first to purchase a plan!");
      window.location.href = "auth.html";
    } else {
      window.location.href = `checkout.html?plan=${selectedPlan}`;
    }
  });
});

/* =========================
CHECKOUT PAGE PLAN DISPLAY
========================= */
const planNameEl = document.getElementById("planName");
const planPriceEl = document.getElementById("planPrice");
if (planNameEl && planPriceEl) {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPlan = urlParams.get("plan") || "Standard";

  planNameEl.textContent = selectedPlan;
  const price =
    selectedPlan === "Basic" ? "€9.99" :
    selectedPlan === "Premium" ? "€29.99" :
    "€19.99";
  planPriceEl.textContent = price;
}

/* =========================
CHECKOUT PAYMENT METHOD SWITCH
========================= */
const paymentSelect = document.getElementById("paymentMethod");
if (paymentSelect) {
  const forms = {
    paypal: document.getElementById("paypalForm"),
    creditcard: document.getElementById("creditForm"),
    slovenska: document.getElementById("slovenskaForm")
  };

  paymentSelect.addEventListener("change", () => {
    Object.values(forms).forEach(f => f && f.classList.remove("active"));
    const selected = paymentSelect.value;
    if (forms[selected]) forms[selected].classList.add("active");
  });
}

/* =========================
PAYMENT FORMS SUBMIT - WITH BILLING DATA AND SUBSCRIPTION ADD
========================= */
const paymentForms = {
  paypal: document.getElementById("paypalForm"),
  creditcard: document.getElementById("creditForm"),
  slovenska: document.getElementById("slovenskaForm")
};

Object.entries(paymentForms).forEach(([method, form]) => {
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const plan = new URLSearchParams(window.location.search).get("plan") || "Standard";
    const txnId = `EP${Math.floor(100000000 + Math.random() * 900000000)}`;

    let billingData = {};

    if (method === "creditcard") {
      billingData = {
        name: form.querySelector('input[placeholder="Cardholder Name"]')?.value || "N/A",
        address: form.querySelector('input[placeholder="Billing Address"]')?.value || "N/A",
        city: form.querySelector('input[placeholder="City / Postal Code"]')?.value || "N/A"
      };
    } else if (method === "slovenska") {
      billingData = {
        name: form.querySelector('input[placeholder="Full Name"]')?.value || "N/A",
        address: form.querySelector('input[placeholder="Bank Name"]')?.value || "N/A",
        city: form.querySelector('input[placeholder="IBAN"]')?.value || "N/A"
      };
    } else if (method === "paypal") {
      const emailInput = form.querySelector('input[type="email"]');
      billingData = { 
        name: emailInput?.value || "PayPal User", 
        address: "N/A", 
        city: "N/A" 
      };
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
      const planEntry = {
        plan: plan,
        status: "Active",
        date: new Date().toLocaleDateString(),
        txnId: txnId
      };

      if (!currentUser.subscriptions) currentUser.subscriptions = [];
      currentUser.subscriptions.push(planEntry);

      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      const idx = users.findIndex(u => u.email === currentUser.email);
      if (idx !== -1) users[idx] = currentUser;
      localStorage.setItem("users", JSON.stringify(users));
    }

    localStorage.setItem("receiptData", JSON.stringify({
      plan,
      paymentMethod: method === "creditcard" ? "Credit Card" : method === "slovenska" ? "Slovenská Bank Transfer" : "PayPal",
      txnId,
      billingName: billingData.name,
      billingAddress: `${billingData.address}, ${billingData.city}`
    }));

    alert(`Payment for ${plan} successful!`);
    window.location.href = "receipt.html";
  });
});

/* =========================
LOAD RECEIPT DATA (with billing info)
========================= */
if (document.getElementById("txnId") || document.getElementById("billingInfo")) {
  const receiptData = JSON.parse(localStorage.getItem("receiptData"));

  if (receiptData) {
    const planName = document.getElementById("planName");
    const planPrice = document.getElementById("planPrice");
    
    if (planName) planName.textContent = receiptData.plan;
    if (planPrice) {
      planPrice.textContent = 
        receiptData.plan === "Basic" ? "€9.99" :
        receiptData.plan === "Premium" ? "€29.99" : "€19.99";
    }

    const paymentMethodEl = document.getElementById("paymentMethod");
    const txnIdEl = document.getElementById("txnId");
    
    if (paymentMethodEl) paymentMethodEl.textContent = receiptData.paymentMethod;
    if (txnIdEl) txnIdEl.textContent = receiptData.txnId;

    const billingInfo = document.getElementById("billingInfo");
    if (billingInfo) {
      billingInfo.innerHTML = `
        <p><strong>Cardholder / Account Name:</strong> ${receiptData.billingName || "N/A"}</p>
        <p><strong>Billing / Bank Info:</strong> ${receiptData.billingAddress || "N/A"}</p>
      `;
    }

    localStorage.removeItem("receiptData");
  }
}

/* =========================
LOAD SUBSCRIPTIONS
========================= */
const subscriptionsContainer = document.getElementById("subscriptionsContainer");
if (subscriptionsContainer) {
  const loggedUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!loggedUser || !loggedUser.subscriptions || loggedUser.subscriptions.length === 0) {
    subscriptionsContainer.innerHTML = `<p class="no-subscriptions">You have no active subscriptions.</p>`;
  } else {
    loggedUser.subscriptions.forEach((sub, index) => {
      const card = document.createElement("div");
      card.classList.add("subscription-card");
      card.innerHTML = `
        <div class="subscription-info">
          <span class="subscription-plan">${sub.plan}</span>
          <span class="subscription-status">Status: ${sub.status}</span>
          <span class="subscription-date">Started: ${sub.date}</span>
        </div>
        <button class="btn-cancel" data-index="${index}">Cancel</button>
      `;
      subscriptionsContainer.appendChild(card);
    });

    subscriptionsContainer.querySelectorAll(".btn-cancel").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = btn.dataset.index;
        if (confirm("Are you sure you want to cancel this subscription?")) {
          const currentUser = JSON.parse(localStorage.getItem("currentUser"));
          currentUser.subscriptions.splice(idx, 1);
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          
          let users = JSON.parse(localStorage.getItem("users")) || [];
          const userIdx = users.findIndex(u => u.email === currentUser.email);
          if (userIdx !== -1) {
            users[userIdx] = currentUser;
            localStorage.setItem("users", JSON.stringify(users));
          }
          
          btn.closest(".subscription-card").remove();
          
          if (currentUser.subscriptions.length === 0) {
            subscriptionsContainer.innerHTML = `<p class="no-subscriptions">You have no active subscriptions.</p>`;
          }
        }
      });
    });
  }
}

/* =========================
ENSURE ADMIN EXISTS
========================= */
let users = JSON.parse(localStorage.getItem("users")) || [];
if (!users.some(u => u.role === "admin")) {
  users.push({
    name: "Admin",
    email: "admin@grc.com",
    password: "admin123",
    role: "admin",
    subscriptions: []
  });
  localStorage.setItem("users", JSON.stringify(users));
  console.log("Default admin created: admin@grc.com / admin123");
}

/* =========================
ADMIN PAGE - ONLY RUN ON ADMIN PAGE
========================= */
if (window.location.pathname.includes("admin.html") || document.getElementById("adminContainer")) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  if (!currentUser || currentUser.role !== "admin") {
    alert("Access denied! Admins only.");
    window.location.href = "index.html";
  } else {
    const container = document.getElementById("adminContainer");
    
    if (container) {
      let users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.length === 0) {
        container.innerHTML = `<p class="no-users">No users found.</p>`;
      } else {
        container.innerHTML = "";
        users.forEach((user, uIndex) => {
          const userCard = document.createElement("div");
          userCard.classList.add("user-card");

          let subsHTML = "<ul>";
          if (user.subscriptions && user.subscriptions.length > 0) {
            user.subscriptions.forEach((sub, i) => {
              subsHTML += `
                <li>
                  ${sub.plan} - ${sub.status} - ${sub.date} - TXN: ${sub.txnId}
                  <button class="admin-cancel-btn" data-user="${user.email}" data-index="${i}">Cancel</button>
                </li>
              `;
            });
          } else {
            subsHTML += `<li>No subscriptions</li>`;
          }
          subsHTML += "</ul>";

          userCard.innerHTML = `
            <h3>${user.name} (${user.email}) ${user.role === 'admin' ? '👑' : ''}</h3>
            ${subsHTML}
          `;

          container.appendChild(userCard);
        });

        document.querySelectorAll(".admin-cancel-btn").forEach(btn => {
          btn.addEventListener("click", e => {
            e.preventDefault();
            const userEmail = btn.dataset.user;
            const subIndex = parseInt(btn.dataset.index);
            let users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.email === userEmail);

            if (user && confirm("Cancel this subscription?")) {
              user.subscriptions.splice(subIndex, 1);
              localStorage.setItem("users", JSON.stringify(users));
              
              const currentUser = JSON.parse(localStorage.getItem("currentUser"));
              if (currentUser && currentUser.email === userEmail) {
                currentUser.subscriptions = user.subscriptions;
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
              }
              
              btn.closest("li").remove();
            }
          });
        });
      }
    }
  }
}

/* =========================
LOGOUT BUTTON (for pages with direct logout button)
========================= */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  const newLogoutBtn = logoutBtn.cloneNode(true);
  logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
  
  newLogoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
}