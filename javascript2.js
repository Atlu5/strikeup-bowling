// Application State
let currentUser = null;
let users = [];
let sessions = [];
let matches = [];
let messages = [];
let userProgress = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSampleData();
    checkAuthState();
});

// Initialize all functionality
function initializeApp() {
    initializeNavigation();
    initializeModals();
    initializeEventListeners();
    initializeStorage();
}

// Sample data for demonstration
function loadSampleData() {
    // Load users
    users = JSON.parse(localStorage.getItem('strikeup_users')) || [
        {
            id: 1,
            name: 'Sarah M.',
            email: 'sarah@example.com',
            password: 'password123',
            average: 165,
            highScore: 234,
            location: 'New York, NY',
            skillLevel: 'intermediate',
            bowlingStyle: 'Competitive',
            avatar: 'SM',
            gamesPlayed: 45,
            matches: 12
        },
        {
            id: 2,
            name: 'Mike T.',
            email: 'mike@example.com',
            password: 'password123',
            average: 142,
            highScore: 198,
            location: 'Brooklyn, NY',
            skillLevel: 'intermediate',
            bowlingStyle: 'Casual',
            avatar: 'MT',
            gamesPlayed: 32,
            matches: 8
        },
        {
            id: 3,
            name: 'Alex K.',
            email: 'alex@example.com',
            password: 'password123',
            average: 189,
            highScore: 278,
            location: 'Queens, NY',
            skillLevel: 'advanced',
            bowlingStyle: 'League Player',
            avatar: 'AK',
            gamesPlayed: 67,
            matches: 25
        }
    ];

    // Load sessions
    sessions = JSON.parse(localStorage.getItem('strikeup_sessions')) || [
        {
            id: 1,
            location: 'Bowlero Downtown',
            datetime: '2024-01-15T19:00',
            participants: 3,
            maxParticipants: 6,
            skillLevel: 'all',
            details: 'Casual practice session, all welcome!',
            organizer: 1,
            attendees: [1, 2]
        },
        {
            id: 2,
            location: 'AMF Lanes',
            datetime: '2024-01-16T14:00',
            participants: 1,
            maxParticipants: 4,
            skillLevel: 'intermediate',
            details: 'Looking for serious practice partners',
            organizer: 3,
            attendees: [3]
        }
    ];

    // Load matches
    matches = JSON.parse(localStorage.getItem('strikeup_matches')) || [];

    // Load messages
    messages = JSON.parse(localStorage.getItem('strikeup_messages')) || [];

    // Load user progress
    userProgress = JSON.parse(localStorage.getItem('strikeup_progress')) || {};

    // Save sample data to localStorage
    saveData();
}

// Initialize localStorage
function initializeStorage() {
    if (!localStorage.getItem('strikeup_initialized')) {
        localStorage.setItem('strikeup_initialized', 'true');
        saveData();
    }
}

// Save all data to localStorage
function saveData() {
    localStorage.setItem('strikeup_users', JSON.stringify(users));
    localStorage.setItem('strikeup_sessions', JSON.stringify(sessions));
    localStorage.setItem('strikeup_matches', JSON.stringify(matches));
    localStorage.setItem('strikeup_messages', JSON.stringify(messages));
    localStorage.setItem('strikeup_progress', JSON.stringify(userProgress));
    
    if (currentUser) {
        localStorage.setItem('strikeup_current_user', JSON.stringify(currentUser));
    }
}

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

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
    document.getElementById('loginBtn').addEventListener('click', () => {
        showLoginModal();
    });
}

// Modal functionality
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    // Create session button
    document.getElementById('createSessionBtn').addEventListener('click', () => {
        showSessionModal();
    });

    // Close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Session form submission
    document.getElementById('sessionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createSession();
    });

    // Auth form submission
    document.getElementById('authForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleAuth();
    });

    // Message form submission
    document.getElementById('messageForm').addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage();
    });

    // Video upload
    document.getElementById('videoUpload').addEventListener('change', function(e) {
        handleVideoUpload(e.target.files[0]);
    });

    // Avatar upload
    document.getElementById('avatarUpload').addEventListener('change', function(e) {
        handleAvatarUpload(e.target.files[0]);
    });
}

// Event listeners
function initializeEventListeners() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Auth switch
    document.getElementById('switchAuth').addEventListener('click', function(e) {
        e.preventDefault();
        toggleAuthMode();
    });

    // Search and filter
    document.getElementById('locationSearch').addEventListener('input', filterMatches);
    document.getElementById('skillFilter').addEventListener('change', filterMatches);
    document.getElementById('distanceFilter').addEventListener('change', filterMatches);
}

// Check authentication state
function checkAuthState() {
    const savedUser = localStorage.getItem('strikeup_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForAuth();
    } else {
        showSection('home');
    }
}

// Show login modal
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    const title = document.getElementById('authModalTitle');
    const form = document.getElementById('authForm');
    const switchText = document.getElementById('authSwitch');

    title.textContent = 'Sign In to StrikeUp';
    form.innerHTML = `
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Password" required>
        <button type="submit" class="btn-primary">Sign In</button>
    `;
    switchText.innerHTML = 'Don\'t have an account? <a href="#" id="switchAuth">Sign up</a>';

    modal.style.display = 'block';
    
    // Re-attach event listener
    document.getElementById('switchAuth').addEventListener('click', function(e) {
        e.preventDefault();
        toggleAuthMode();
    });
}

// Toggle between login and signup
function toggleAuthMode() {
    const title = document.getElementById('authModalTitle');
    const form = document.getElementById('authForm');
    const switchText = document.getElementById('authSwitch');

    if (title.textContent.includes('Sign In')) {
        title.textContent = 'Create Account';
        form.innerHTML = `
            <input type="text" placeholder="Full Name" required>
            <input type="email" placeholder="Email" required>
            <input type="password" placeholder="Password" required>
            <input type="password" placeholder="Confirm Password" required>
            <input type="text" placeholder="Location" required>
            <select required>
                <option value="">Select skill level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
            </select>
            <button type="submit" class="btn-primary">Sign Up</button>
        `;
        switchText.innerHTML = 'Already have an account? <a href="#" id="switchAuth">Sign in</a>';
    } else {
        title.textContent = 'Sign In to StrikeUp';
        form.innerHTML = `
            <input type="email" placeholder="Email" required>
            <input type="password" placeholder="Password" required>
            <button type="submit" class="btn-primary">Sign In</button>
        `;
        switchText.innerHTML = 'Don\'t have an account? <a href="#" id="switchAuth">Sign up</a>';
    }

    // Re-attach event listener
    document.getElementById('switchAuth').addEventListener('click', function(e) {
        e.preventDefault();
        toggleAuthMode();
    });
}

// Handle authentication
function handleAuth() {
    const form = document.getElementById('authForm');
    const inputs = form.querySelectorAll('input, select');
    const isLogin = document.getElementById('authModalTitle').textContent.includes('Sign In');

    if (isLogin) {
        // Login logic
        const email = inputs[0].value;
        const password = inputs[1].value;

        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = { ...user };
            delete currentUser.password; // Don't store password in currentUser
            localStorage.setItem('strikeup_current_user', JSON.stringify(currentUser));
            updateUIForAuth();
            document.getElementById('loginModal').style.display = 'none';
            showNotification('Welcome back!', 'success');
        } else {
            showNotification('Invalid email or password', 'error');
        }
    } else {
        // Signup logic
        const [name, email, password, confirmPassword, location, skillLevel] = Array.from(inputs).map(input => input.value);

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        if (users.find(u => u.email === email)) {
            showNotification('Email already registered', 'error');
            return;
        }

        const newUser = {
            id: users.length + 1,
            name,
            email,
            password,
            average: 0,
            highScore: 0,
            location,
            skillLevel: skillLevel.value || skillLevel,
            bowlingStyle: 'Casual',
            avatar: name.split(' ').map(n => n[0]).join(''),
            gamesPlayed: 0,
            matches: 0
        };

        users.push(newUser);
        currentUser = { ...newUser };
        delete currentUser.password;
        
        localStorage.setItem('strikeup_current_user', JSON.stringify(currentUser));
        saveData();
        
        updateUIForAuth();
        document.getElementById('loginModal').style.display = 'none';
        showNotification('Account created successfully!', 'success');
    }
}

// Update UI for authenticated user
function updateUIForAuth() {
    // Update navigation
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-menu').style.display = 'block';
    
    // Update user info in dropdown
    document.getElementById('userNameSm').textContent = currentUser.name;
    document.getElementById('userAvatarSm').textContent = currentUser.avatar;
    
    // Load user-specific data
    loadUserData();
    loadMatches();
    loadSessions();
    loadVideos();
    updateProfile();
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('strikeup_current_user');
    
    // Update navigation
    document.getElementById('auth-buttons').style.display = 'block';
    document.getElementById('user-menu').style.display = 'none';
    
    // Clear user-specific data
    clearUserData();
    showSection('home');
    showNotification('Logged out successfully', 'success');
}

// Section management
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Load section-specific data
    switch(sectionId) {
        case 'home':
            loadHomeData();
            break;
        case 'connect':
            loadMatches();
            loadSessions();
            break;
        case 'learn':
            loadVideos();
            break;
        case 'profile':
            updateProfile();
            break;
    }
    
    window.scrollTo(0, 0);
}

// Load home data
function loadHomeData() {
    if (!currentUser) return;

    // Update user stats
    document.getElementById('userStats').innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${currentUser.average || 0}</div>
            <div class="stat-label">Average Score</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${currentUser.highScore || 0}</div>
            <div class="stat-label">High Score</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${currentUser.matches || 0}</div>
            <div class="stat-label">Matches</div>
        </div>
    `;

    // Load recent activity
    loadRecentActivity();
}

// Load recent activity
function loadRecentActivity() {
    const recentMessages = messages.filter(m => 
        m.toUserId === currentUser.id || m.fromUserId === currentUser.id
    ).slice(0, 5);

    const activityList = document.getElementById('activityList');
    
    if (recentMessages.length === 0) {
        activityList.innerHTML = '<p class="no-activity">No recent activity</p>';
        return;
    }

    activityList.innerHTML = recentMessages.map(message => {
        const user = users.find(u => u.id === message.fromUserId);
        const timeAgo = getTimeAgo(message.timestamp);
        
        return `
            <div class="activity-item">
                <div class="activity-avatar">${user.avatar}</div>
                <div class="activity-content">
                    <p><strong>${user.name}</strong> sent you a message</p>
                    <span class="activity-time">${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Load matches
function loadMatches() {
    const matchesGrid = document.getElementById('matchesGrid');
    const availableUsers = users.filter(user => user.id !== currentUser?.id);

    if (availableUsers.length === 0) {
        matchesGrid.innerHTML = '<p class="no-matches">No users found</p>';
        return;
    }

    matchesGrid.innerHTML = availableUsers.map(user => `
        <div class="match-card">
            <div class="match-header">
                <div class="match-avatar">${user.avatar}</div>
                <div class="match-info">
                    <h3>${user.name}</h3>
                    <div class="match-stats">
                        Avg: ${user.average} • ${user.bowlingStyle}
                    </div>
                    <div class="match-location">${user.location}</div>
                </div>
            </div>
            <div class="match-actions">
                <button class="btn-primary" onclick="connectWithUser(${user.id})">
                    <i class="fas fa-user-plus"></i> Connect
                </button>
                <button class="btn-outline" onclick="sendMessageToUser(${user.id})">
                    <i class="fas fa-envelope"></i> Message
                </button>
            </div>
        </div>
    `).join('');
}

// Filter matches
function filterMatches() {
    const locationSearch = document.getElementById('locationSearch').value.toLowerCase();
    const skillFilter = document.getElementById('skillFilter').value;
    const distanceFilter = document.getElementById('distanceFilter').value;

    const filteredUsers = users.filter(user => {
        if (user.id === currentUser?.id) return false;
        
        const matchesLocation = user.location.toLowerCase().includes(locationSearch);
        const matchesSkill = skillFilter === 'all' || user.skillLevel === skillFilter;
        const matchesDistance = distanceFilter === 'any' || true; // Distance logic would go here

        return matchesLocation && matchesSkill && matchesDistance;
    });

    const matchesGrid = document.getElementById('matchesGrid');
    matchesGrid.innerHTML = filteredUsers.map(user => `
        <div class="match-card">
            <div class="match-header">
                <div class="match-avatar">${user.avatar}</div>
                <div class="match-info">
                    <h3>${user.name}</h3>
                    <div class="match-stats">
                        Avg: ${user.average} • ${user.bowlingStyle}
                    </div>
                    <div class="match-location">${user.location}</div>
                </div>
            </div>
            <div class="match-actions">
                <button class="btn-primary" onclick="connectWithUser(${user.id})">
                    <i class="fas fa-user-plus"></i> Connect
                </button>
                <button class="btn-outline" onclick="sendMessageToUser(${user.id})">
                    <i class="fas fa-envelope"></i> Message
                </button>
            </div>
        </div>
    `).join('');
}

// Load sessions
function loadSessions() {
    const sessionsGrid = document.getElementById('sessionsGrid');
    
    if (sessions.length === 0) {
        sessionsGrid.innerHTML = '<p class="no-sessions">No open sessions found</p>';
        return;
    }

    sessionsGrid.innerHTML = sessions.map(session => {
        const organizer = users.find(u => u.id === session.organizer);
        const isAttending = session.attendees.includes(currentUser?.id);
        const isFull = session.participants >= session.maxParticipants;
        const formattedDate = formatSessionDate(session.datetime);

        return `
            <div class="session-card">
                <div class="session-header">
                    <div class="session-location">${session.location}</div>
                    <div class="session-time">${formattedDate}</div>
                </div>
                <div class="session-organizer">
                    <div class="organizer-avatar">${organizer.avatar}</div>
                    <span>Organized by ${organizer.name}</span>
                </div>
                <div class="session-meta">
                    <span>${session.participants}/${session.maxParticipants} bowlers</span>
                    <span>${session.skillLevel} level</span>
                </div>
                <div class="session-details">${session.details}</div>
                <button class="join-btn ${isAttending ? 'attending' : ''} ${isFull ? 'full' : ''}" 
                        onclick="${isAttending ? 'leaveSession' : 'joinSession'}(${session.id})"
                        ${isFull && !isAttending ? 'disabled' : ''}>
                    <i class="fas ${isAttending ? 'fa-check' : 'fa-plus'}"></i>
                    ${isAttending ? 'Attending' : isFull ? 'Session Full' : 'Join Session'}
                </button>
            </div>
        `;
    }).join('');
}

// Show session creation modal
function showSessionModal() {
    if (!currentUser) {
        showNotification('Please sign in to create a session', 'error');
        return;
    }

    const modal = document.getElementById('sessionModal');
    const form = document.getElementById('sessionForm');
    
    // Set minimum datetime to current time
    const now = new Date();
    const localDateTime = now.toISOString().slice(0, 16);
    document.getElementById('sessionDateTime').min = localDateTime;
    
    form.reset();
    modal.style.display = 'block';
}

// Create new session
function createSession() {
    const location = document.getElementById('sessionLocation').value;
    const datetime = document.getElementById('sessionDateTime').value;
    const skillLevel = document.getElementById('sessionSkillLevel').value;
    const maxParticipants = parseInt(document.getElementById('sessionMaxParticipants').value);
    const details = document.getElementById('sessionDetails').value;

    const newSession = {
        id: sessions.length + 1,
        location,
        datetime,
        participants: 1,
        maxParticipants,
        skillLevel,
        details: details || 'No additional details',
        organizer: currentUser.id,
        attendees: [currentUser.id]
    };

    sessions.push(newSession);
    saveData();
    
    document.getElementById('sessionModal').style.display = 'none';
    loadSessions();
    showNotification('Session created successfully!', 'success');
}

// Join session
function joinSession(sessionId) {
    if (!currentUser) {
        showNotification('Please sign in to join a session', 'error');
        return;
    }

    const session = sessions.find(s => s.id === sessionId);
    if (session && !session.attendees.includes(currentUser.id)) {
        session.attendees.push(currentUser.id);
        session.participants = session.attendees.length;
        saveData();
        loadSessions();
        showNotification('Joined session successfully!', 'success');
    }
}

// Leave session
function leaveSession(sessionId) {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
        session.attendees = session.attendees.filter(id => id !== currentUser.id);
        session.participants = session.attendees.length;
        saveData();
        loadSessions();
        showNotification('Left session', 'success');
    }
}

// Connect with user
function connectWithUser(userId) {
    if (!currentUser) {
        showNotification('Please sign in to connect with users', 'error');
        return;
    }

    const existingMatch = matches.find(m => 
        (m.user1 === currentUser.id && m.user2 === userId) ||
        (m.user1 === userId && m.user2 === currentUser.id)
    );

    if (!existingMatch) {
        matches.push({
            id: matches.length + 1,
            user1: currentUser.id,
            user2: userId,
            timestamp: new Date().toISOString(),
            status: 'connected'
        });
        saveData();
        showNotification('Connection request sent!', 'success');
    } else {
        showNotification('Already connected with this user', 'info');
    }
}

// Send message to user
function sendMessageToUser(userId) {
    if (!currentUser) {
        showNotification('Please sign in to send messages', 'error');
        return;
    }

    const user = users.find(u => u.id === userId);
    const modal = document.getElementById('messageModal');
    document.getElementById('recipientName').textContent = user.name;
    
    // Store recipient ID in a data attribute
    modal.dataset.recipientId = userId;
    
    modal.style.display = 'block';
}

// Send message
function sendMessage() {
    const modal = document.getElementById('messageModal');
    const recipientId = parseInt(modal.dataset.recipientId);
    const content = document.getElementById('messageContent').value;

    const newMessage = {
        id: messages.length + 1,
        fromUserId: currentUser.id,
        toUserId: recipientId,
        content,
        timestamp: new Date().toISOString(),
        read: false
    };

    messages.push(newMessage);
    saveData();
    
    modal.style.display = 'none';
    document.getElementById('messageContent').value = '';
    showNotification('Message sent!', 'success');
}

// Load videos
function loadVideos() {
    const videosGrid = document.getElementById('videosGrid');
    
    const videoTutorials = [
        {
            id: 1,
            title: 'Perfecting Your Release',
            description: 'Learn proper hand position and follow-through',
            duration: '12:34',
            level: 'intermediate'
        },
        {
            id: 2,
            title: 'Spare Shooting System',
            description: 'Master the 3-6-9 spare system',
            duration: '18:22',
            level: 'beginner'
        },
        {
            id: 3,
            title: 'Advanced Hook Techniques',
            description: 'Increase your rev rate and hook potential',
            duration: '15:45',
            level: 'advanced'
        },
        {
            id: 4,
            title: 'Mental Game Strategies',
            description: 'Develop focus and overcome pressure',
            duration: '20:10',
            level: 'intermediate'
        }
    ];

    videosGrid.innerHTML = videoTutorials.map(video => `
        <div class="video-card">
            <div class="video-thumbnail">
                <i class="fas fa-play-circle"></i>
            </div>
            <div class="video-info">
                <h4>${video.title}</h4>
                <p>${video.description}</p>
                <div class="video-meta">
                    <span class="video-level ${video.level}">${video.level}</span>
                    <span class="video-duration">${video.duration}</span>
                </div>
                <button class="btn-outline" onclick="watchVideo(${video.id})">
                    <i class="fas fa-play"></i> Watch
                </button>
            </div>
        </div>
    `).join('');
}

// Start learning path
function startLearningPath(level) {
    if (!currentUser) {
        showNotification('Please sign in to access learning paths', 'error');
        return;
    }

    showNotification(`Starting ${level} learning path...`, 'success');
    // In a real app, this would navigate to the learning path
}

// Watch video
function watchVideo(videoId) {
    if (!currentUser) {
        showNotification('Please sign in to watch videos', 'error');
        return;
    }

    showNotification('Opening video tutorial...', 'success');
    // In a real app, this would open the video player
}

// Handle video upload
function handleVideoUpload(file) {
    if (!file) return;

    if (!file.type.startsWith('video/')) {
        showNotification('Please select a video file', 'error');
        return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
        showNotification('Video file too large (max 100MB)', 'error');
        return;
    }

    // Simulate upload progress
    simulateUploadProgress(file);
}

// Simulate upload progress
function simulateUploadProgress(file) {
    const progressBar = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const uploadProgress = document.getElementById('uploadProgress');
    
    uploadProgress.style.display = 'block';
    progressBar.style.width = '0%';
    progressText.textContent = '0%';

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                showNotification('Video uploaded successfully! Analysis in progress...', 'success');
                uploadProgress.style.display = 'none';
                
                // Simulate analysis completion
                setTimeout(() => {
                    showNotification('Video analysis complete! Check your results.', 'success');
                }, 3000);
            }, 500);
        }
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }, 200);
}

// Handle avatar upload
function handleAvatarUpload(file) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        // In a real app, you would upload to a server
        // For now, we'll just update the avatar display
        const avatar = document.getElementById('profileAvatar');
        avatar.style.backgroundImage = `url(${e.target.result})`;
        avatar.textContent = '';
        
        showNotification('Profile picture updated!', 'success');
    };
    reader.readAsDataURL(file);
}

// Update profile
function updateProfile() {
    if (!currentUser) return;

    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileLocation').textContent = currentUser.location;
    document.getElementById('profileAvatar').textContent = currentUser.avatar;

    // Update stats
    document.getElementById('profileStats').innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${currentUser.gamesPlayed || 0}</div>
            <div class="stat-label">Games Played</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${currentUser.average || 0}</div>
            <div class="stat-label">Average</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${currentUser.highScore || 0}</div>
            <div class="stat-label">High Score</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${currentUser.matches || 0}</div>
            <div class="stat-label">Partners</div>
        </div>
    `;

    // Update badges
    updateBadges();
    
    // Update chart
    updateProgressChart();
    
    // Load recent matches
    loadRecentMatches();
}

// Update badges
function updateBadges() {
    const badges = [];
    
    if (currentUser.highScore >= 200) {
        badges.push('<span class="badge"><i class="fas fa-trophy"></i> First 200 Game</span>');
    }
    if (currentUser.matches >= 5) {
        badges.push('<span class="badge"><i class="fas fa-users"></i> Social Butterfly</span>');
    }
    if (currentUser.average >= 150) {
        badges.push('<span class="badge"><i class="fas fa-star"></i> Consistent Bowler</span>');
    }

    document.getElementById('profileBadges').innerHTML = 
        badges.length > 0 ? badges.join('') : '<p>No badges yet. Keep bowling!</p>';
}

// Update progress chart
function updateProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;

    // Sample progress data - in real app, this would come from user history
    const progressData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Average Score',
            data: [120, 135, 142, 155, 148, 165],
            borderColor: '#FF6B35',
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: progressData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 100
                }
            }
        }
    });
}

// Load recent matches
function loadRecentMatches() {
    const userMatches = matches.filter(m => 
        m.user1 === currentUser.id || m.user2 === currentUser.id
    ).slice(0, 5);

    const recentMatchesDiv = document.getElementById('recentMatches');
    
    if (userMatches.length === 0) {
        recentMatchesDiv.innerHTML = '<p class="no-matches">No recent matches</p>';
        return;
    }

    recentMatchesDiv.innerHTML = userMatches.map(match => {
        const otherUserId = match.user1 === currentUser.id ? match.user2 : match.user1;
        const user = users.find(u => u.id === otherUserId);
        const matchDate = new Date(match.timestamp).toLocaleDateString();

        return `
            <div class="match-item">
                <div class="match-avatar">${user.avatar}</div>
                <div class="match-info">
                    <strong>${user.name}</strong>
                    <span>Connected on ${matchDate}</span>
                </div>
                <button class="btn-outline" onclick="sendMessageToUser(${user.id})">
                    Message
                </button>
            </div>
        `;
    }).join('');
}

// Edit location
function editLocation() {
    const newLocation = prompt('Enter your location:', currentUser.location);
    if (newLocation && newLocation.trim() !== '') {
        currentUser.location = newLocation.trim();
        
        // Update in users array
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].location = newLocation.trim();
        }
        
        saveData();
        updateProfile();
        showNotification('Location updated!', 'success');
    }
}

// Refresh sessions
function refreshSessions() {
    loadSessions();
    showNotification('Sessions refreshed!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            container.removeChild(notification);
        }, 300);
    }, 5000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

// Utility functions
function getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function formatSessionDate(datetime) {
    const date = new Date(datetime);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function clearUserData() {
    // Clear user-specific UI elements
    document.getElementById('userStats').innerHTML = '';
    document.getElementById('activityList').innerHTML = '';
    document.getElementById('matchesGrid').innerHTML = '';
    document.getElementById('sessionsGrid').innerHTML = '';
    document.getElementById('videosGrid').innerHTML = '';
}

function loadUserData() {
    if (currentUser) {
        loadHomeData();
    }
}

// Refresh sessions (for the button)
function refreshSessions() {
    loadSessions();
    showNotification('Sessions refreshed!', 'success');
}
