// Sample data
const sampleMatches = [
    {
        id: 1,
        name: 'Sarah M.',
        average: 165,
        location: '2 miles away',
        style: 'Competitive',
        avatar: 'SM'
    },
    {
        id: 2,
        name: 'Mike T.',
        average: 142,
        location: '1.5 miles away',
        style: 'Casual',
        avatar: 'MT'
    },
    {
        id: 3,
        name: 'Alex K.',
        average: 189,
        location: '3 miles away',
        style: 'League Player',
        avatar: 'AK'
    }
];

const sampleSessions = [
    {
        id: 1,
        location: 'Bowlero Downtown',
        time: 'Today, 7:00 PM',
        participants: 3,
        maxParticipants: 6,
        skillLevel: 'All Levels'
    },
    {
        id: 2,
        location: 'AMF Lanes',
        time: 'Tomorrow, 2:00 PM',
        participants: 1,
        maxParticipants: 4,
        skillLevel: 'Intermediate+'
    }
];

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const loginBtn = document.querySelector('.btn-login');
const loginModal = document.getElementById('loginModal');
const sessionModal = document.getElementById('sessionModal');
const createSessionBtn = document.getElementById('createSessionBtn');
const closeButtons = document.querySelectorAll('.close');
const uploadArea = document.getElementById('uploadArea');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeModals();
    loadMatches();
    loadSessions();
    initializeChart();
});

// Navigation functionality
function initializeNavigation() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('href').substring(1);
            
            // Update active states
            navLinks.forEach(nl => nl.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section
            showSection(targetSection);
            
            // Close mobile menu if open
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Login button click
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
}

// Section management
function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Modal functionality
function initializeModals() {
    // Create session button
    createSessionBtn.addEventListener('click', () => {
        sessionModal.style.display = 'block';
    });

    // Close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            sessionModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === sessionModal) {
            sessionModal.style.display = 'none';
        }
    });

    // Auth form switch
    document.getElementById('showSignup').addEventListener('click', (e) => {
        e.preventDefault();
        const form = document.querySelector('.auth-form');
        const switchText = document.querySelector('.auth-switch');
        const modalTitle = document.querySelector('#loginModal h2');
        
        if (modalTitle.textContent.includes('Sign In')) {
            modalTitle.textContent = 'Create Account';
            form.innerHTML = `
                <input type="text" placeholder="Full Name" required>
                <input type="email" placeholder="Email" required>
                <input type="password" placeholder="Password" required>
                <input type="password" placeholder="Confirm Password" required>
                <button type="submit" class="btn-primary">Sign Up</button>
            `;
            switchText.innerHTML = 'Already have an account? <a href="#" id="showSignin">Sign in</a>';
        } else {
            modalTitle.textContent = 'Sign In to StrikeUp';
            form.innerHTML = `
                <input type="email" placeholder="Email" required>
                <input type="password" placeholder="Password" required>
                <button type="submit" class="btn-primary">Sign In</button>
            `;
            switchText.innerHTML = 'Don\'t have an account? <a href="#" id="showSignup">Sign up</a>';
        }
        
        // Re-attach event listener to the new switch link
        document.getElementById('showSignup')?.addEventListener('click', arguments.callee);
        document.getElementById('showSignin')?.addEventListener('click', arguments.callee);
    });
}

// Load matches data
function loadMatches() {
    const matchesGrid = document.querySelector('.matches-grid');
    
    if (!matchesGrid) return;
    
    matchesGrid.innerHTML = sampleMatches.map(match => `
        <div class="match-card">
            <div class="match-header">
                <div class="match-avatar">${match.avatar}</div>
                <div class="match-info">
                    <h3>${match.name}</h3>
                    <div class="match-stats">
                        Avg: ${match.average} • ${match.style}
                    </div>
                    <div class="match-location">${match.location}</div>
                </div>
            </div>
            <button class="btn-primary" style="width: 100%;" onclick="connectWithUser(${match.id})">
                <i class="fas fa-user-plus"></i> Connect
            </button>
        </div>
    `).join('');
}

// Load sessions data
function loadSessions() {
    const sessionsGrid = document.querySelector('.sessions-grid');
    
    if (!sessionsGrid) return;
    
    sessionsGrid.innerHTML = sampleSessions.map(session => `
        <div class="session-card">
            <div class="session-header">
                <div class="session-location">${session.location}</div>
                <div class="session-time">${session.time}</div>
            </div>
            <div class="session-details">
                ${session.participants}/${session.maxParticipants} bowlers • ${session.skillLevel}
            </div>
            <button class="join-btn" onclick="joinSession(${session.id})">
                <i class="fas fa-plus"></i> Join Session
            </button>
        </div>
    `).join('');
}

// Initialize progress chart
function initializeChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    // Sample progress data
    const progressData = {
