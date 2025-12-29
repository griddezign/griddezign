
/* =====================================================
COMPLETE PORTFOLIO WEBSITE - ALL FUNCTIONS FIXED
===================================================== */

// ==================== GLOBAL STATE ====================
let currentUser = null;
let selectedRating = 0;
let currentProjectId = null;
let unlockedProjects = [];
let projectStates = {};
let dropdownTimeout = null;

// Tagline rotation
const taglines = [
    'Bringing ideas to life through design',
    'Design that communicates and converts',
    'Brand identities with purpose',
    'Interfaces that feel effortless',
    'Creating memorable experiences'
];
let taglineIndex = 0;

// Lightbox state
let images = [];
let curIdx = 0;
let scale = 1;

// ==================== DOM ELEMENTS ====================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const loginBtn = document.getElementById('loginBtn');
const userProfile = document.getElementById('userProfile');
const userDropdown = document.getElementById('userDropdown');
const userName = document.getElementById('userName');
const navAuth = document.querySelector('.nav-auth');
const navUser = document.querySelector('.nav-user');

// Modals
const contactModal = document.getElementById('contactModal');
const opinionModal = document.getElementById('opinionModal');
const lightbox = document.getElementById('lightbox');

// Modal close buttons
const closeContactModal = document.getElementById('closeContactModal');
const closeOpinionModal = document.getElementById('closeOpinionModal');

// Forms
const contactForm = document.getElementById('contactForm');
const opinionForm = document.getElementById('opinionForm');

// Other elements
const floatingContactBtn = document.getElementById('floatingContactBtn');
const themeToggle = document.getElementById('themeToggle');
const taglineText = document.getElementById('taglineText');
const animatedTagline = document.getElementById('animatedTagline');

// Lightbox elements
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
const zoomReset = document.getElementById('zoomReset');

// Opinion form elements
const opinionName = document.getElementById('opinionName');
const opinionEmail = document.getElementById('opinionEmail');
const opinionText = document.getElementById('opinionText');
const charCount = document.getElementById('charCount');
const stars = document.querySelectorAll('.star');

// Testimonial elements

// Authentication system
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginFormContainer = document.getElementById('loginFormContainer');
const signupFormContainer = document.getElementById('signupFormContainer');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authMessage = document.getElementById('authMessage');


// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initUserSession();
    initModals();
    initForms();
    initPortfolioFeatures();
    initAnimatedTagline();
    initTaglineRotation();
    initTheme();
    initLightbox();
    initStatsCounter();
    initToolsSection();
    initSmoothScroll();
    initAuthModal();
    checkUser();

    
            

    
    console.log('Portfolio initialized successfully');
});

// refresh user status every refresh
let userCheckInProgress = false;
let userRequestController = null;
let isLoggingOut = false;

async function fetchUserData() {
    // --- KEY CHANGE: If a logout is in progress, don't fetch user data. ---
    if (isLoggingOut) {
        console.log('Logout in progress. Skipping user data fetch.');
        return { authenticated: false };
    }

    if (userRequestController) {
        userRequestController.abort();   // Cancel any previous pending request
    }

    userRequestController = new AbortController();

    try {
        const res = await fetch("/user/", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: userRequestController.signal
        });

        // Handle 401 Unauthorized specifically (from our middleware)
        if (res.status === 401) {
            console.log('Session expired or invalid (401)');
            return { authenticated: false, needsReauth: true };
        }
        
        if (!res.ok) {
            console.log(`Request failed with status: ${res.status}`);
            return { authenticated: false };
        }
        
        return await res.json();

    } catch (err) {
        if (err.name === 'AbortError') {
            console.log('Request was aborted');
        } else {
            console.error('Error fetching user data:', err);
        }
        return { authenticated: false };
    }
}

async function checkUser() {
    if (userCheckInProgress) return;
    userCheckInProgress = true;

    const data = await fetchUserData();

    if (!data.authenticated) {
        setTimeout(() => authModal.classList.add("active"), 5000);
    }

    userCheckInProgress = false;
}


window.addEventListener("load", () => {
    checkUser();
});


// ==================== NAVIGATION ====================
function initNavigation() {
    // Mobile hamburger menu
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Add this to open the modal instead
            authModal.classList.add('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (hamburger && navLinks) {
            const isClickInsideNav = navLinks.contains(e.target) || hamburger.contains(e.target);
            if (!isClickInsideNav) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        }
        
        // Close user dropdown when clicking outside
        if (userDropdown && userProfile) {
            if (!userDropdown.contains(e.target) && !userProfile.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        }
    });

    // User profile dropdown
    if (userProfile && userDropdown) {
        userProfile.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
    }

    // Login button
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.classList.add('active');
        });
    }

    // My Opinions button
    const myOpinionsBtn = document.getElementById('myOpinions');
    if (myOpinionsBtn) {
        myOpinionsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showMyOpinions();
        });
    }

    // Floating contact button
    if (floatingContactBtn && contactModal) {
        floatingContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(contactModal);
        });
    }

    // Close nav links when clicking on a link (mobile)
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close for user profile link
                if (link.id !== 'userProfile') {
                    if (hamburger && hamburger.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                    }
                }
            });
        });
    }
}

// Authentication System




// AJAX for signup page start
document.getElementById("signupForm").addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData(this);

            const response = await fetch(SIGNUP_URL, {
                method: "POST",
                headers: {
                    "X-CSRFToken": formData.get("csrfmiddlewaretoken")
                },
                body: formData,
            });

            const data = await response.json();
            console.log(data);

            if (data.success) {
                // alert("Signup successful");
                
            } else {
                alert(data.error);
            }
        });

// AJAX signup page end




// AJAX login page start 

// AJAX login page end



// check login status start

async function updateUserUI() {
    const res = await fetch("/user/");
    const data = await res.json();
    console.log(data);

    const userMenu = document.getElementById("userName");
    const loginBtn = document.getElementById("loginBtn");
    const opinionsLink = document.getElementById("myOpinionsContainer");

    if (data.authenticated) {
        // Show welcome text
        userMenu.textContent = data.username;

        // Hide "Login"
        if (loginBtn) loginBtn.style.display = "none";

        // Show "My Opinions" only for superuser
        if (data.is_superuser) {
            opinionsLink.style.display = "block";
        } else {
            opinionsLink.style.display = "none";
        }
    } else {
        // Show "Login"
        if (loginBtn) loginBtn.style.display = "block";

        // Hide superuser link
        if (opinionsLink) opinionsLink.style.display = "none";
    }
}

updateUserUI();


// AJAX logout page start


// Find the logout button and add the listener
const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 1. Set the lock to prevent any new user checks
        isLoggingOut = true;
        console.log('Logout process started. Locking user status checks.');

        // 2. Abort any existing user check that might be in flight
        if (userRequestController) {
            userRequestController.abort();
        }

        try {
            const res = await fetch('/logout/', {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({})
            });

            const data = await res.json();
            console.log(data);

            if (data.success) {
                // Optional: Show a success message before reloading
                showToast('Logged out successfully!');
                logout();
                // Give a moment for the toast to be seen
                setTimeout(() => {
                    window.location.reload(); // Reloading is a simple way to reset state
                }, 1000);

            } else {
                // If logout fails, we must unlock so the app works again
                alert(data.error || 'Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Logout request failed:', error);
            alert('An error occurred during logout.');
        } finally {
            // 3. IMPORTANT: Always clear the lock, even on failure
            // If the page reloads, this doesn't matter, but it's good practice.
            isLoggingOut = false;
            console.log('Logout process finished. Unlocking user status checks.');
        }
    });
}




// AJAX logout page end



// AJAX contact page start

document.getElementById("contactForm").addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData(this);

            const response = await fetch(SEND_CONTACT_URL, {
                method: "POST",
                headers: {
                    "X-CSRFToken": formData.get("csrfmiddlewaretoken")
                },
                body: formData,
            });

            const data = await response.json();
            console.log(data);

            if (data.success) {
                showToast('Message sent successfully!');
                contactForm.reset();
                closeModal(contactModal);
            } else {
                alert(data.error);
            }
        });

// AJAX contact page end







        function initAuthModal() {
            // Tab switching
            loginTab.addEventListener('click', () => {
                showTab('login');
            });

            signupTab.addEventListener('click', () => {
                showTab('signup');
            });

            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                showTab('signup');
            });

            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                showTab('login');
            });

            // Modal controls
            closeAuthModal.addEventListener('click', () => {
                authModal.classList.remove('active');
            });

            const cancelSignupBtn = document.getElementById('cancelSignupBtn');
    if (cancelSignupBtn) {
        cancelSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.classList.remove('active');
            signupForm.reset();
        });
    }

            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    authModal.classList.remove('active');
                }
            });

            // Form submissions
            signupForm.addEventListener('submit', handleSignup);
            loginForm.addEventListener('submit', handleLogin);

            // Real-time validation
            setupRealtimeValidation();
        }

        function showTab(tabName) {
            // Clear previous messages
            authMessage.style.display = 'none';
            authMessage.className = 'auth-message';

            if (tabName === 'login') {
                loginTab.classList.add('active');
                signupTab.classList.remove('active');
                loginFormContainer.classList.add('active-form');
                signupFormContainer.classList.remove('active-form');
            } else {
                signupTab.classList.add('active');
                loginTab.classList.remove('active');
                signupFormContainer.classList.add('active-form');
                loginFormContainer.classList.remove('active-form');
            }
        }

        function showMessage(message, isError = false) {
            authMessage.textContent = message;
            authMessage.className = isError ? 'auth-message error' : 'auth-message success';
            authMessage.style.display = 'block';
        }

        function showFieldError(inputId, message) {
            const input = document.getElementById(inputId);
            const msgEl = document.getElementById(inputId + 'Msg');
            if (input && msgEl) {
                input.classList.add('error');
                msgEl.textContent = message;
                msgEl.className = 'field-message error';
            }
        }

        function showFieldSuccess(inputId, message) {
            const input = document.getElementById(inputId);
            const msgEl = document.getElementById(inputId + 'Msg');
            if (input && msgEl) {
                input.classList.remove('error');
                msgEl.textContent = message;
                msgEl.className = 'field-message success';
            }
        }

        function clearFieldFeedback(inputId) {
            const input = document.getElementById(inputId);
            const msgEl = document.getElementById(inputId + 'Msg');
            if (input && msgEl) {
                input.classList.remove('error');
                msgEl.textContent = '';
                msgEl.className = 'field-message';
            }
        }

        function setButtonLoading(button, isLoading, text) {
            if (button) {
                button.disabled = isLoading;
                button.textContent = text;
                button.classList.toggle('loading', isLoading);
            }
        }

        function clearAllFieldFeedback(form) {
            const fields = form === 'signup' 
                ? ['signupName', 'signupUsername', 'signupEmail', 'signupPassword', 'signupConfirmPassword']
                : ['loginIdentifier', 'loginPassword'];
            
            fields.forEach(id => clearFieldFeedback(id));
        }

        function setupRealtimeValidation() {
            // Username availability check
            document.getElementById('signupUsername').addEventListener('blur', async () => {
                const username = document.getElementById('signupUsername').value.trim();

                if (username.length < 3) {
                    showFieldError('signupUsername', 'Username must be at least 3 characters.');
                    return;
                }

                const res = await fetch(`/check_username/?username=${username}`);
                const data = await res.json();

                if (data.exists) {
                    showFieldError('signupUsername', 'Username is already taken.');
                } else {
                    showFieldSuccess('signupUsername', 'Username is available!');
                }
            });


            // Email validation
            document.getElementById('signupEmail').addEventListener('blur', async () => {
                const email = document.getElementById('signupEmail').value.trim();

                // Basic format check
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showFieldError('signupEmail', 'Please enter a valid email address.');
                    return;
                }

                // Backend uniqueness check
                const response = await fetch(`/check_email/?email=${email}`);
                const data = await response.json();

                if (data.exists) {
                    showFieldError('signupEmail', 'Email is already in use.');
                } else {
                    showFieldSuccess('signupEmail', 'Email is available!');
                }
            });


            // Password strength indicator
            document.getElementById('signupPassword').addEventListener('input', () => {
                const password = document.getElementById('signupPassword').value;
                const strengthBar = document.getElementById('passwordStrengthBar');
                const strengthText = document.getElementById('passwordStrengthText');
                
                if (password.length === 0) {
                    strengthBar.className = 'password-strength-bar';
                    strengthText.textContent = '';
                    return;
                }
                
                let strength = 0;
                if (password.length >= 8) strength++;
                if (password.match(/[a-z]+/)) strength++;
                if (password.match(/[A-Z]+/)) strength++;
                if (password.match(/[0-9]+/)) strength++;
                if (password.match(/[$@#&!]+/)) strength++;
                
                if (strength <= 2) {
                    strengthBar.className = 'password-strength-bar strength-weak';
                    strengthText.textContent = 'Weak password';
                } else if (strength <= 4) {
                    strengthBar.className = 'password-strength-bar strength-medium';
                    strengthText.textContent = 'Medium strength';
                } else {
                    strengthBar.className = 'password-strength-bar strength-strong';
                    strengthText.textContent = 'Strong password';
                }
            });

            // Password confirmation
            document.getElementById('signupConfirmPassword').addEventListener('input', () => {
                const password = document.getElementById('signupPassword').value;
                const confirmPassword = document.getElementById('signupConfirmPassword').value;
                
                if (confirmPassword && password !== confirmPassword) {
                    showFieldError('signupConfirmPassword', 'Passwords do not match.');
                } else if (confirmPassword && password === confirmPassword) {
                    showFieldSuccess('signupConfirmPassword', 'Passwords match!');
                } else {
                    clearFieldFeedback('signupConfirmPassword');
                }
            });
        }

        function handleSignup(e) {
            e.preventDefault();
            
            // Clear previous messages
            authMessage.style.display = 'none';
            clearAllFieldFeedback('signup');

            const name = document.getElementById('signupName').value.trim();
            const username = document.getElementById('signupUsername').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            // Front-end validation
            let hasError = false;
            
            if (name.length < 2) {
                showFieldError('signupName', 'Please enter your full name.');
                hasError = true;
            }
            
            if (username.length < 3) {
                showFieldError('signupUsername', 'Username must be at least 3 characters.');
                hasError = true;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFieldError('signupEmail', 'Please enter a valid email address.');
                hasError = true;
            }
            
            if (password.length < 6) {
                showFieldError('signupPassword', 'Password must be at least 6 characters long.');
                hasError = true;
            }
            
            if (password !== confirmPassword) {
                showFieldError('signupConfirmPassword', 'Passwords do not match.');
                hasError = true;
            }
            
            if (hasError) return;

            // Show loading state
            setButtonLoading(signupSubmitBtn, true, 'Creating Account...');

            // Simulate server check
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                
                if (users.some(user => user.username === username)) {
                    showFieldError('signupUsername', 'Username is already taken.');
                    setButtonLoading(signupSubmitBtn, false, 'Sign Up');
                    return;
                }
                
                if (users.some(user => user.email === email)) {
                    showFieldError('signupEmail', 'An account with this email already exists.');
                    setButtonLoading(signupSubmitBtn, false, 'Sign Up');
                    return;
                }

                // Create user
                const newUser = { name, username, email, password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                setButtonLoading(signupSubmitBtn, false, 'Sign Up');
                showMessage('Account created successfully! You can now sign in.', false);

                // Switch to login tab and pre-fill the identifier
                setTimeout(() => {
                    showTab('login');
                    document.getElementById('loginIdentifier').value = username;
                    signupForm.reset();
                }, 1500);
            }, 800); // Simulate network delay
        }

async function handleLogin(e) {
    e.preventDefault();

    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;

    let formData = new FormData();
    formData.append('loginIdentifier', identifier);
    formData.append('loginPassword', password);

    setButtonLoading(loginSubmitBtn, true, 'Signing In...');

    const response = await fetch('/login/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: formData
    });

    const data = await response.json();
    setButtonLoading(loginSubmitBtn, false, 'Sign In');

    if (data.success) {
        showMessage('Login successful! Welcome back.', false);

            currentUser = data.name;
            sessionToken = data.token;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            sessionStorage.setItem('sessionToken', sessionToken);

            updateUserUI();

            setTimeout(() => {
                authModal.classList.remove('active');
                loginForm.reset();
                authMessage.style.display = 'none';
            }, 1000);
    } else {
        showMessage(data.error || 'Invalid username/email or password.', true);
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = cookie.substring(name.length + 1);
                break;
            }
        }
    }
    return cookieValue;
}





function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href === '#0') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ==================== USER SESSION ====================
function initUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserUI();
    }

    const savedStates = localStorage.getItem('projectStates');
    if (savedStates) {
        projectStates = JSON.parse(savedStates);
    }

    const savedUnlocked = localStorage.getItem('unlockedProjects');
    if (savedUnlocked) {
        unlockedProjects = JSON.parse(savedUnlocked);
        restoreProjectStates();
    }
}

async function updateUserUI() {

    const res = await fetch("/user/");
    const data = await res.json()

    const userMenu = document.getElementById("userName");
    const loginBtn = document.getElementById("loginBtn");
    const opinionsLink = document.getElementById("myOpinions");

    if (data.authenticated) {
        // Show welcome text
        userMenu.textContent = data.username;

        // Hide "Login"
        if (loginBtn) loginBtn.style.display = "none";
        if (navAuth) navAuth.style.display = 'none';
        if (navUser) navUser.style.display = 'block';
        if (userName) userName.textContent = data.username;

        // Show "My Opinions" only for superuser
        if (data.is_superuser) {
            opinionsLink.style.display = "block";
        } else {
            opinionsLink.style.display = "none";
        }
    } else {
        // Show "Login"
        if (loginBtn) loginBtn.style.display = "block";

        // Hide superuser link
        if (opinionsLink) opinionsLink.style.display = "none";
        if (navAuth) navAuth.style.display = 'block';
        if (navUser) navUser.style.display = 'none';
    }
}




function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserUI();
    // Show "Login"
    if (userDropdown) userDropdown.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
    if (navLinks) navLinks.classList.remove('active');
     if (loginBtn) loginBtn.style.display = "block";

        // Hide superuser link
        if (navAuth) navAuth.style.display = 'block';
        if (navUser) navUser.style.display = 'none';
    showToast('Logged out successfully');
}

function showMyOpinions() {
    const opinions = JSON.parse(localStorage.getItem('opinions') || '[]');
    const userOpinions = opinions.filter(op => 
        currentUser && op.email === currentUser.email
    );
    
    if (userOpinions.length === 0) {
        showToast('You haven\'t shared any opinions yet');
        return;
    }
    
    alert(`You have ${userOpinions.length} opinion(s) saved.`);
    if (userDropdown) userDropdown.classList.remove('active');
}

// ==================== MODALS ====================
function initModals() {
    // Contact modal
    if (closeContactModal && contactModal) {
        closeContactModal.addEventListener('click', () => closeModal(contactModal));
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) closeModal(contactModal);
        });
    }

    // Opinion modal
    if (closeOpinionModal && opinionModal) {
        closeOpinionModal.addEventListener('click', () => closeModal(opinionModal));
        opinionModal.addEventListener('click', (e) => {
            if (e.target === opinionModal){ 
                closeModal(opinionModal);
                
            }
            
        });
    } 


    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(contactModal);
            closeModal(opinionModal);
            closeLightbox();
            
        }
    });
}

function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        resetOpinionForm(); 
    }
}

// ==================== FORMS ====================
function initForms() {
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            const message = document.getElementById('message')?.value;
            
            if (name && email && message) {
                showToast('Message sent successfully!');
                contactForm.reset();
                closeModal(contactModal);
            } else {
                showToast('Please fill all fields');
            }
        });
    }


    //opinion 

     document.getElementById("opinionForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const projectId = formData.get("project_id");
    const rating = formData.get("rating");
    const message = formData.get("opinion_message");
    const csrf = formData.get("csrfmiddlewaretoken");

    const response = await fetch(SAVE_OPINION_URL, {
        method: "POST",
        headers: {
            "X-CSRFToken": csrf,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            project_id: projectId,
            rating: rating,
            opinion_message: message,
            csrfmiddlewaretoken: csrf
        })
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
        form.reset();
    } else {
        alert(data.error || "Error submitting opinion");
    }
});



    // Opinion form
    if (opinionForm) {
        opinionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleOpinionSubmit();
        });
    }

    // Character counter
    if (opinionText && charCount) {
        opinionText.addEventListener('input', () => {
            charCount.textContent = opinionText.value.length;
        });
    }

// Star rating
    if (stars) {
        stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        document.getElementById("rating").value = selectedRating;
        updateStars();
    });
});

    }

document.querySelectorAll(".open-opinion").forEach(btn => {
    btn.addEventListener("click", () => {
        const pid = btn.dataset.projectId;
        document.getElementById("project_id").value = pid;

        opinionModal.classList.add("active"); // your modal open logic
    });
});
}

function handleOpinionSubmit() {
    const name = opinionName?.value.trim();
    const email = opinionEmail?.value.trim();
    const text = opinionText?.value.trim();

    if (!text || text.length < 15) {
        showToast('Please fill all fields correctly');
        return;
    }

    if (selectedRating === 0) {
        showToast('Please select a rating');
        return;
    }

    const opinionData = {
        projectId: currentProjectId,
        name,
        email,
        text,
        rating: selectedRating,
        timestamp: new Date().toISOString()
    };

    // Save opinion
    let opinions = JSON.parse(localStorage.getItem('opinions') || '[]');
    opinions.push(opinionData);
    localStorage.setItem('opinions', JSON.stringify(opinions));

    // Unlock project
    if (!unlockedProjects.includes(currentProjectId)) {
        unlockedProjects.push(currentProjectId);
        localStorage.setItem('unlockedProjects', JSON.stringify(unlockedProjects));
    }

    // Update project UI
    const card = document.querySelector(`[data-project-id="${currentProjectId}"]`);
    if (card) {
        const locked = card.querySelector('.project-locked');
        const collapsed = card.querySelector('.project-collapsed');
        
        if (locked) locked.style.display = 'none';
        if (collapsed) collapsed.classList.add('active');
        
        
        projectStates[currentProjectId] = 'collapsed';
        localStorage.setItem('projectStates', JSON.stringify(projectStates));
    }

    showToast('Thank you for your opinion!');
    closeModal(opinionModal);
    resetOpinionForm();
}

function updateStars() {
    if (stars) {
        stars.forEach((star, index) => {
            if (parseInt(star.dataset.value) <= selectedRating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
}

function resetOpinionForm() {
    if (opinionForm) opinionForm.reset();
    selectedRating = 0;
    updateStars();
    if (charCount) charCount.textContent = '0';
}

// ==================== PORTFOLIO FEATURES ====================
// let isViewAllActive = false;
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', initPortfolioFeatures);

function initPortfolioFeatures() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const viewAllBtn = document.getElementById('viewAllBtn');
    const closeAllBtn = document.getElementById('closeAllBtn');

    function applyFilter(filter) {
        currentFilter = filter;
        let visibleCount = 0;

        projectCards.forEach(card => {
            const category = card.dataset.category;
            const matches = filter === 'all' || category === filter;

            if (!matches) {
                card.classList.add('hidden');
                return;
            }

            visibleCount++;

            if (!isViewAllActive && visibleCount > 6) {
                card.classList.add('hidden');
            } else {
                card.classList.remove('hidden');
            }
        });
    }

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyFilter(btn.dataset.filter);
        });
    });

    // View All (category-scoped)
    viewAllBtn.addEventListener('click', () => {
        isViewAllActive = true;
        viewAllBtn.classList.add('hidden');
        closeAllBtn.classList.remove('hidden');

        applyFilter(currentFilter);
    });

    // Close All (back to 6 of current category)
    closeAllBtn.addEventListener('click', () => {
        isViewAllActive = false;
        closeAllBtn.classList.add('hidden');
        viewAllBtn.classList.remove('hidden');

        applyFilter(currentFilter);
    });

    // Initial state on page load
    applyFilter('all');




    // Share opinion buttons
    document.querySelectorAll('.share-opinion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.project-card');
            currentProjectId = card?.dataset.projectId;
            
            if (currentUser && opinionName && opinionEmail) {
                opinionName.value = currentUser.name;
                opinionEmail.value = currentUser.email;
            }
            
            openModal(opinionModal);
        });
    });

    // Collapse buttons

    document.querySelectorAll('.collapse-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.project-card');
            const id = card?.dataset.projectId;
            const expanded = card?.querySelector('.project-expanded');
            const collapsed = card?.querySelector('.project-collapsed');

            if (expanded) expanded.classList.remove('active');
            if (collapsed) collapsed.classList.add('active');

            if (id) {
                projectStates[id] = 'collapsed';
                localStorage.setItem('projectStates', JSON.stringify(projectStates));
            }
        });
    });

    // function initPortfolioFeatures() {
            document.querySelectorAll('.expand-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const card = btn.closest('.project-card');
                    const id = card?.dataset.projectId;

                    // Simple check for demo purposes
                    if (unlockedProjects.includes(id)) {
                        openProjectModal(card);
                    } else {
                        alert('Project is locked!');
                    }
                });
            });

            const projectModal = document.getElementById('projectModal');
            const closeProjectModalBtn = document.getElementById('closeProjectModal');

            if (closeProjectModalBtn) {
                closeProjectModalBtn.addEventListener('click', closeProjectModal);
            }

            if (projectModal) {
                projectModal.addEventListener('click', (e) => {
                    if (e.target === projectModal) closeProjectModal();
                });
            }
        }

        function openProjectModal(card) {
            const modal = document.getElementById('projectModal');
            if (!modal) return;

            const title = card.querySelector('h3')?.textContent || 'Project';
            const category = card.dataset.category || 'Design';
            const mainImgSrc = card.querySelector('.project-image img')?.src;
            const shortDesc = card.querySelector('.project-collapsed p')?.textContent || '';

            const expandedContent = card.querySelector('.project-expanded');
            const finalQuote = card.dataset.finalQuote || '';
            let fullDescHTML = '';
            let tagsHTML = '';
            const galleryImages = [];

            if (mainImgSrc) galleryImages.push(mainImgSrc);

            if (expandedContent) {
                const clone = expandedContent.cloneNode(true);
                const ul = clone.querySelector('ul');
                if (ul) {
                    ul.querySelectorAll('li').forEach(li => {
                        tagsHTML += `<span class="pm-tag">${li.textContent}</span>`;
                    });
                    ul.remove();
                }

                // Extract gallery images from hidden content
                clone.querySelectorAll('.project-gallery img').forEach(img => {
                    galleryImages.push(img.src);
                });
                const galleryDiv = clone.querySelector('.project-gallery');
                if (galleryDiv) galleryDiv.remove();

                const h3 = clone.querySelector('h3');
                if (h3) h3.remove();

                fullDescHTML = clone.innerHTML;
            }

            document.getElementById('pmTitle').textContent = title;
            document.getElementById('pmCategory').textContent = category;
            document.getElementById('pmShortDesc').textContent = shortDesc;
            document.getElementById('pmFullDesc').innerHTML = fullDescHTML;
            document.getElementById('pmTags').innerHTML = tagsHTML;
            document.getElementById('pmFinalQuote').innerText = finalQuote;

            const mainImgEl = document.getElementById('pmMainImage');
            if (mainImgEl) mainImgEl.src = mainImgSrc;
            
            const galleryEl = document.getElementById('pmGallery');
            if (galleryEl) {
                galleryEl.innerHTML = galleryImages.map((src, index) =>
                    `<img src="${src}" alt="Gallery ${index}" onclick="openLightboxFromModal(${index})">`
                ).join('');
            }

            window.currentModalImages = galleryImages;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeProjectModal() {
            const modal = document.getElementById('projectModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        function openLightboxFromModal(index) {
            const images = window.currentModalImages || [];
            if (images.length === 0) return;

            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightboxImg');

            if (lightbox && lightboxImg) {
                lightbox.classList.add('active');
                lightboxImg.src = images[index];
                document.body.style.overflow = 'hidden';

                window.lightboxState = {
                    images: images,
                    index: index,
                    zoom: 1
                };
                updateLightboxNav();
            }
        }
    // }


function restoreProjectStates() {
    unlockedProjects.forEach(id => {
        const card = document.querySelector(`[data-project-id="${id}"]`);
        if (!card) return;

        const locked = card.querySelector('.project-locked');
        const expanded = card.querySelector('.project-expanded');
        const collapsed = card.querySelector('.project-collapsed');

        if (locked) locked.style.display = 'none';

        const state = projectStates[id] || 'collapsed';
        if (state === 'collapsed') {
            if (expanded) expanded.classList.remove('active');
            if (collapsed) collapsed.classList.add('active');
        } else {
            if (expanded) expanded.classList.add('active');
            if (collapsed) collapsed.classList.remove('active');
        }
    });
}


/* const viewAllBtn = document.getElementById("viewAllBtn");
const closeAllBtn = document.getElementById("closeAllBtn");

const hiddenProjects = document.querySelectorAll(".hidden-project");

viewAllBtn.addEventListener("click", () => {
    hiddenProjects.forEach(p => p.style.display = "none");
    viewAllBtn.classList.add("hidden");
    closeAllBtn.classList.remove("hidden");
});

closeAllBtn.addEventListener("click", () => {
    hiddenProjects.forEach(p => p.style.display = "none");
    closeAllBtn.classList.add("hidden");
    viewAllBtn.classList.remove("hidden");
}); */

const viewAllBtn = document.getElementById("viewAllBtn");
const closeAllBtn = document.getElementById("closeAllBtn");

const projectCards = document.querySelectorAll(".project-card");
const hiddenProjects = document.querySelectorAll(".hidden-project");

let isViewAllActive = false;

/* VIEW ALL */
viewAllBtn.addEventListener("click", () => {
    isViewAllActive = true;

    projectCards.forEach(card => {
        card.classList.remove("hidden");
    });

    viewAllBtn.classList.add("hidden");
    closeAllBtn.classList.remove("hidden");
});

/* CLOSE ALL */
closeAllBtn.addEventListener("click", () => {
    isViewAllActive = false;

    hiddenProjects.forEach(card => {
        card.classList.add("hidden");
    });

    closeAllBtn.classList.add("hidden");
    viewAllBtn.classList.remove("hidden");
});



// ==================== ANIMATED TAGLINE ====================
function initAnimatedTagline() {
    if (!animatedTagline) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animatedTagline.classList.add('visible');
            } else {
                animatedTagline.classList.remove('visible');
            }
        });
    }, { threshold: 0.3 });

    observer.observe(animatedTagline);

    setTimeout(() => {
        animatedTagline.classList.add('visible');
    }, 1500);
}

// ==================== TAGLINE ROTATION ====================
function initTaglineRotation() {
    if (!taglineText) return;

    setInterval(() => {
        taglineIndex = (taglineIndex + 1) % taglines.length;
        taglineText.style.opacity = '0';

        setTimeout(() => {
            taglineText.textContent = taglines[taglineIndex];
            taglineText.style.opacity = '1';
        }, 300);
    }, 3000);
}

// ==================== THEME TOGGLE SYSTEM ====================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const keyboardHint = document.getElementById('keyboardHint');

    // Function to apply theme
    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Function to toggle theme
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }

    // Initialize theme on load
    function initThemeSettings() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        applyTheme(initialTheme);
    }

    // Event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Keyboard shortcut (T key)
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'T' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            toggleTheme();
            // Show hint on first use
            if (keyboardHint && !localStorage.getItem('hintShown')) {
                keyboardHint.style.display = 'block';
                localStorage.setItem('hintShown', 'true');
            }
        }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Initialize
    initThemeSettings();
}




document.addEventListener('DOMContentLoaded', function() {
        const testimonials = document.querySelectorAll('.testimonial-item');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentIndex = 0;
        
        function showTestimonial(index) {
            // Hide all testimonials
            testimonials.forEach(testimonial => {
                testimonial.classList.remove('active');
            });
            
            // Remove active class from all dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show the selected testimonial
            testimonials[index].classList.add('active');
            dots[index].classList.add('active');
            currentIndex = index;
        }
        
        // Event listeners for navigation buttons
        prevBtn.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) {
                newIndex = testimonials.length - 1;
            }
            showTestimonial(newIndex);
        });
        
        nextBtn.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= testimonials.length) {
                newIndex = 0;
            }
            showTestimonial(newIndex);
        });
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
            });
        });
        
        // Auto-rotate testimonials every 5 seconds
        setInterval(() => {
            let newIndex = currentIndex + 1;
            if (newIndex >= testimonials.length) {
                newIndex = 0;
            }
            showTestimonial(newIndex);
        }, 5000);
    });



// ==================== LIGHTBOX ====================
function initLightbox() {
            window.lightboxState = window.lightboxState || { images: [], index: 0, zoom: 1 };

            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightboxImg');
            const lightboxClose = document.getElementById('lightboxClose');
            const lightboxPrev = document.getElementById('lightboxPrev');
            const lightboxNext = document.getElementById('lightboxNext');
            const zoomInBtn = document.getElementById('zoomIn');
            const zoomOutBtn = document.getElementById('zoomOut');
            const zoomResetBtn = document.getElementById('zoomReset');

            if (!lightbox || !lightboxImg) return;

            window.updateLightboxNav = updateNavButtons;

                document.querySelectorAll('.project-card').forEach(card => {
        const projectImages = card.querySelectorAll('.project-image img, .project-gallery img');
        projectImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                currentProjectImages = Array.from(projectImages).map(i => i.src);
                currentImageIndex = index;
                openLightbox();
            });
        });
    });

    function openLightbox() {
        if (!lightbox || !lightboxImg) return;
        lightbox.classList.add('active');
        lightboxImg.src = currentProjectImages[currentImageIndex];
        zoomScale = 1;
        lightboxImg.style.transform = 'scale(1)';
        document.body.style.overflow = 'hidden';
        updateNavButtons();
    }



            function closeLightbox() {
                lightbox.classList.remove('active');
                // If modal is active, keep body overflow hidden
                if (!document.getElementById('projectModal')?.classList.contains('active')) {
                    document.body.style.overflow = '';
                }
            }

            function updateImage() {
                lightboxImg.src = window.lightboxState.images[window.lightboxState.index];
                window.lightboxState.zoom = 1;
                lightboxImg.style.transform = 'scale(1)';
                updateNavButtons();
            }

            function updateNavButtons() {
                if (lightboxPrev) {
                    lightboxPrev.style.opacity = window.lightboxState.images.length > 1 ? '1' : '0.3';
                    lightboxPrev.style.pointerEvents = window.lightboxState.images.length > 1 ? 'auto' : 'none';
                }
                if (lightboxNext) {
                    lightboxNext.style.opacity = window.lightboxState.images.length > 1 ? '1' : '0.3';
                    lightboxNext.style.pointerEvents = window.lightboxState.images.length > 1 ? 'auto' : 'none';
                }
            }

            if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

            if (lightboxPrev) {
                lightboxPrev.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (window.lightboxState.images.length > 1) {
                        window.lightboxState.index = (window.lightboxState.index - 1 + window.lightboxState.images.length) % window.lightboxState.images.length;
                        updateImage();
                    }
                });
            }

            if (lightboxNext) {
                lightboxNext.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (window.lightboxState.images.length > 1) {
                        window.lightboxState.index = (window.lightboxState.index + 1) % window.lightboxState.images.length;
                        updateImage();
                    }
                });
            }

            if (zoomInBtn) {
                zoomInBtn.addEventListener('click', () => {
                    window.lightboxState.zoom += 0.25;
                    lightboxImg.style.transform = `scale(${window.lightboxState.zoom})`;
                });
            }

            if (zoomOutBtn) {
                zoomOutBtn.addEventListener('click', () => {
                    if (window.lightboxState.zoom > 0.5) {
                        window.lightboxState.zoom -= 0.25;
                        lightboxImg.style.transform = `scale(${window.lightboxState.zoom})`;
                    }
                });
            }

            if (zoomResetBtn) {
                zoomResetBtn.addEventListener('click', () => {
                    window.lightboxState.zoom = 1;
                    lightboxImg.style.transform = 'scale(1)';
                });
            }

            if (lightbox) {
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) closeLightbox();
                });
            }

            document.addEventListener('keydown', (e) => {
                if (!lightbox || !lightbox.classList.contains('active')) return;
                
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight' && currentProjectImages.length > 1) {
                    currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
                    updateImage();
                }
                if (e.key === 'ArrowLeft' && currentProjectImages.length > 1) {
                    currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
                    updateImage();
                }
                if (e.key === '+' || e.key === '=') {
                    zoomScale = Math.min(zoomScale + 0.25, 3);
                    if (lightboxImg) lightboxImg.style.transform = `scale(${zoomScale})`;
                }
                if (e.key === '-' || e.key === '_') {
                    zoomScale = Math.max(zoomScale - 0.25, 0.5);
                    if (lightboxImg) lightboxImg.style.transform = `scale(${zoomScale})`;
                }
            });

        }



// ==================== STATS COUNTER ====================
function initStatsCounter() {
    const statsNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats');

    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statsNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    let count = 0;
                    const increment = target / 100;

                    const updateCount = () => {
                        if (count < target) {
                            count += increment;
                            stat.textContent = Math.ceil(count);
                            setTimeout(updateCount, 20);
                        } else {
                            stat.textContent = target;
                        }
                    };

                    updateCount();
                });
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(statsSection);
}

// ==================== TOOLS SECTION ====================
function initToolsSection() {
    const toolsTrack = document.getElementById('toolsTrack');
    if (!toolsTrack) return;

    const toolLogos = toolsTrack.querySelectorAll('.tool-logo');
    
    toolLogos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            toolsTrack.classList.add('paused');
            logo.classList.add('hovered');
        });

        logo.addEventListener('mouseleave', () => {
            toolsTrack.classList.remove('paused');
            logo.classList.remove('hovered');
        });
    });
}

// ==================== UTILITIES ====================
function showToast(message) {
    const toastEl = document.createElement('div');
    toastEl.className = 'toast active';
    toastEl.textContent = message;
    toastEl.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:var(--gradient-primary);color:#fff;padding:1rem 2rem;border-radius:8px;box-shadow:0 5px 15px rgba(0,0,0,0.2);z-index:3000;animation:fadeIn 0.3s';
    
    document.body.appendChild(toastEl);
    
    setTimeout(() => {
        toastEl.remove();
    }, 3000);
}

// Log initialization
console.log('Portfolio JavaScript loaded and initialized successfully!');
    