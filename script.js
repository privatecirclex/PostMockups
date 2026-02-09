// --- 1. Get Elements ---
const nameInput = document.getElementById('nameInput');
const postImageInput = document.getElementById('postImageInput');
const handleInput = document.getElementById('handleInput');
const tweetInput = document.getElementById('tweetInput');
const timeInput = document.getElementById('timeInput'); // New
const dateInput = document.getElementById('dateInput'); // New
const viewsInput = document.getElementById('viewsInput');
const likesInput = document.getElementById('likesInput');
const repostsInput = document.getElementById('repostsInput');
const imageInput = document.getElementById('imageInput');
const verifiedSelect = document.getElementById('verifiedSelect');
const themeToggle = document.getElementById('themeToggle');
const downloadBtn = document.getElementById('downloadBtn');
const commentsInput = document.getElementById('commentsInput'); 

// --- 2. Live Update Function ---
function updateTweet() {
    document.getElementById('displayName').innerText = nameInput.value;
    document.getElementById('displayHandle').innerText = handleInput.value;
    document.getElementById('displayTweet').innerText = tweetInput.value;
    document.getElementById('displayTime').innerText = timeInput.value; // New
    document.getElementById('displayDate').innerText = dateInput.value; // New
    document.getElementById('displayViews').innerText = viewsInput.value;
    document.getElementById('displayLikes').innerText = likesInput.value;
    document.getElementById('displayReposts').innerText = repostsInput.value;
    document.getElementById('displayComments').innerText = commentsInput.value;
    
        // --- UPDATE BADGE LOGIC ---
    const badgeIcon = document.getElementById('verifiedIcon');
    const badgeBg = badgeIcon.querySelector('.badge-bg'); // Selects the colored part
    
    // Official Hex Colors
    const colors = {
        'blue': '#1d9bf0',
        'gold': '#e3b404',  // Official Business Gold
        'grey': '#636d75',  // Official Govt Grey
    };

    const selectedType = verifiedSelect.value;

    if (selectedType === 'none') {
        badgeIcon.style.display = 'none';
    } else {
        badgeIcon.style.display = 'inline-block';
        badgeBg.setAttribute('fill', colors[selectedType]);
    }

}
// Event Listeners for Live Typing
const allInputs = [nameInput, handleInput, tweetInput, timeInput, dateInput, commentsInput, viewsInput, likesInput, repostsInput, verifiedSelect];

allInputs.forEach(input => {
    input.addEventListener('input', updateTweet);
});

// --- 3. Click-to-Edit & Scroll Logic (New Feature) ---

// Map preview element IDs to their Input element IDs
const interactionMap = {
    'displayName': 'nameInput',
    'displayHandle': 'handleInput',
    'displayTweet': 'tweetInput',
    'displayTime': 'timeInput',
    'displayDate': 'dateInput',
    'displayComments': 'commentsInput',
    'displayViews': 'viewsInput',
    'displayReposts': 'repostsInput',
    'displayLikes': 'likesInput',
    'profileDisplay': 'imageInput' // Clicking profile pic opens file upload
};

// Add click listeners to all preview elements
Object.keys(interactionMap).forEach(previewId => {
    const previewEl = document.getElementById(previewId);
    const inputEl = document.getElementById(interactionMap[previewId]);

    if(previewEl && inputEl) {
        // Add pointer cursor via JS if you didn't add the CSS class
        previewEl.style.cursor = "pointer"; 

        previewEl.addEventListener('click', (e) => {
            e.preventDefault(); // Stop default behavior

            // 1. Scroll smooth to the input
            inputEl.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });

            // 2. Focus the input (so they can type immediately)
            inputEl.focus();

            // 3. Add Flash Highlight Effect
            inputEl.classList.add('highlight-box');
            
            // Remove highlight after 1.5 seconds
            setTimeout(() => {
                inputEl.classList.remove('highlight-box');
            }, 1500);
        });
    }
});

// --- ADVANCED CROPPER LOGIC ---

let cropper = null;
let currentTargetImg = null; // Which image are we updating? (Profile or Post)
let currentInput = null;     // Which input triggered it?

const cropperModal = document.getElementById('cropperModal');
const imageToCrop = document.getElementById('imageToCrop');
const applyCropBtn = document.getElementById('applyCropBtn');
const cancelCropBtn = document.getElementById('cancelCropBtn');
const closeCropper = document.getElementById('closeCropper');

// 1. Function to Trigger Cropper

function startCropper(file, targetImgId, isProfile) {
    const reader = new FileReader();
    reader.onload = (e) => {
        imageToCrop.src = e.target.result;
        cropperModal.classList.add('active');
        currentTargetImg = document.getElementById(targetImgId);

        if (cropper) { cropper.destroy(); }

        // Default settings
        let aspectRatio = NaN; // Default to Free for posts
        let viewMode = 1;

        // If Profile, force 1:1 and hide aspect buttons
        const ratioContainer = document.querySelector('.aspect-ratio-container');
        
        if (isProfile) {
            aspectRatio = 1; 
            document.getElementById('cropperTitle').innerText = "Edit Profile Picture";
            if(ratioContainer) ratioContainer.style.display = 'none'; // Hide presets for profile
        } else {
            document.getElementById('cropperTitle').innerText = "Edit Post Image";
            if(ratioContainer) ratioContainer.style.display = 'block'; // Show presets for posts
            
            // Reset buttons to 'Free' by default
            document.querySelectorAll('.ratio-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('.ratio-btn[data-ratio="NaN"]').classList.add('active');
        }

        // Initialize Cropper
        cropper = new Cropper(imageToCrop, {
            aspectRatio: aspectRatio,
            viewMode: viewMode,
            autoCropArea: 1,
            ready() {
                if (isProfile) {
                    document.querySelector('.cropper-view-box').classList.add('circle-crop');
                    document.querySelector('.cropper-face').classList.add('circle-crop');
                } else {
                    document.querySelector('.cropper-view-box').classList.remove('circle-crop');
                    document.querySelector('.cropper-face').classList.remove('circle-crop');
                }
            }
        });
    };
    reader.readAsDataURL(file);
}

// --- NEW: Handle Aspect Ratio Button Clicks ---
document.querySelectorAll('.ratio-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // 1. Remove active class from all
        document.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('active'));
        
        // 2. Add active class to clicked
        e.target.classList.add('active');
        
        // 3. Set the new ratio
        const rawRatio = e.target.getAttribute('data-ratio');
        const newRatio = parseFloat(rawRatio); // Converts "1.77" to number, "NaN" to NaN
        
        if (cropper) {
            cropper.setAspectRatio(newRatio);
        }
    });
});


// 2. Event Listeners for Inputs
// PROFILE PICTURE 
if (imageInput) {
    imageInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            currentInput = imageInput; 
            // Fixed ID: 'profileDisplay' matches your HTML (was displayProfile)
            startCropper(e.target.files[0], 'profileDisplay', true);
        }
    });
}

// POST IMAGE
// Note: For Insta, we also hide the placeholder
const postImageId = 'displayPostImage'; // Assuming this ID exists in both HTMLs
const postPlaceholder = document.getElementById('postPlaceholder'); // Might be null in X

if (postImageInput) {
    postImageInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            currentInput = postImageInput;
            startCropper(e.target.files[0], postImageId, false);
        }
    });
}

// 3. Apply Crop
applyCropBtn.addEventListener('click', () => {
    if (cropper) {
        const canvas = cropper.getCroppedCanvas({
            width: 1080, 
            height: 1080, // You might want to remove height for freeform Twitter crops
        });

        if (currentTargetImg) {
            currentTargetImg.src = canvas.toDataURL('image/png');
            
            // FIX: Make sure the image is visible
            currentTargetImg.style.display = 'block'; 
            
            // FIX: If this is the tweet image, show its container too
            if(currentTargetImg.id === 'displayPostImage') {
                const container = document.getElementById('tweetImageContainer');
                if(container) container.style.display = 'block';
            }
        }
        closeCropperModal();
    }
});


// 4. Cancel / Close Logic
function closeCropperModal() {
    cropperModal.classList.remove('active');
    if (cropper) { cropper.destroy(); cropper = null; }
    if (currentInput) currentInput.value = ''; // Reset input so same file can be selected again
}

cancelCropBtn.addEventListener('click', closeCropperModal);
closeCropper.addEventListener('click', closeCropperModal);

// --- 5. Theme Toggle Logic ---
let isDark = false;
themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    const card = document.getElementById('tweetCard');
    const body = document.body;
    const tweetText = document.getElementById('displayTweet');
    
    if (isDark) {
        // --- SWITCH TO DARK MODE ---
        body.classList.add('dark-mode-vars'); 
        
        // 1. Change Button Text & Color
        themeToggle.innerText = "Toggle Light Mode";
        themeToggle.style.backgroundColor = "#1d9bf0"; // Blue
        
        // 2. Update Card Styles
        card.style.backgroundColor = "black";
        card.style.borderColor = "#2f3336";
        tweetText.style.color = "#e7e9ea";
        document.querySelector('.x-logo').style.fill = "white";
        document.querySelector('.name').style.color = "white";
        document.querySelector('.views').style.color = "white";
        
    } else {
        // --- SWITCH TO LIGHT MODE ---
        body.classList.remove('dark-mode-vars');
        
        // 1. Reset Button Text & Color
        themeToggle.innerText = "Toggle Dark Mode";
        themeToggle.style.backgroundColor = "#0f1419"; // Black
        
        // 2. Reset Card Styles
        card.style.backgroundColor = "white";
        card.style.borderColor = "#eff3f4";
        tweetText.style.color = "#0f1419";
        document.querySelector('.x-logo').style.fill = "black";
        document.querySelector('.name').style.color = "#0f1419";
        document.querySelector('.views').style.color = "#0f1419";
    }
});


// --- 6. ADVANCED DOWNLOAD & MODAL LOGIC ---

const modal = document.getElementById('downloadModal');
const closeModal = document.getElementById('closeModal');
const modalPreview = document.getElementById('modalPreviewImage');
const fileNameInput = document.getElementById('fileNameInput');
const finalDownloadBtn = document.getElementById('finalDownloadBtn');
const shareBtn = document.getElementById('shareBtn');
const progressArea = document.getElementById('progressArea');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

// 1. Open Modal and Generate Preview
downloadBtn.addEventListener('click', () => {
    // Show Modal
    modal.classList.add('active');
    
    // Auto-Generate Smart Filename
    // Format: tweet-handle-first5words
    const safeHandle = handleInput.value.replace(/[^a-zA-Z0-9]/g, '');
    const safeText = tweetInput.value.split(' ').slice(0, 5).join('-').replace(/[^a-zA-Z0-9-]/g, '');
    fileNameInput.value = `tweet-${safeHandle}-${safeText}`;

    // Generate Preview
    const tweetCard = document.getElementById('tweetCard');
    html2canvas(tweetCard, {
        scale: 2, // 2x for preview is enough
        useCORS: true,
        backgroundColor: isDark ? "#000000" : "#ffffff"
    }).then(canvas => {
        modalPreview.src = canvas.toDataURL('image/png');
    });
});

// 2. Close Modal Logic
closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    // Reset buttons
    finalDownloadBtn.innerText = "Download Image";
    finalDownloadBtn.style.backgroundColor = "#1d9bf0";
    progressArea.style.display = "none";
});

// 3. Final Download with Progress Bar Simulation
finalDownloadBtn.addEventListener('click', () => {
    const format = document.querySelector('input[name="format"]:checked').value; // 'png' or 'jpg'
    const filename = fileNameInput.value || 'fake-tweet';
    
    // UI Updates
    progressArea.style.display = "block";
    finalDownloadBtn.disabled = true;
    
    // Simulate Download Progress (0% to 100%)
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5; // Random increment
        if (progress > 100) progress = 100;
        
        progressBar.style.width = `${progress}%`;
        progressText.innerText = `Downloading... ${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            executeDownload(filename, format);
        }
    }, 150); // Updates every 150ms
});

function executeDownload(filename, format) {
    const tweetCard = document.getElementById('tweetCard');
    const isTransparent = format === 'transparent';
    
    // 1. Determine Background Color
    let bgConfig = isDark ? "#000000" : "#ffffff";
    if (isTransparent) {
        bgConfig = null; // null tells html2canvas to use transparent background
    }

    // 2. Generate Image
    html2canvas(tweetCard, {
        scale: 3, 
        useCORS: true,
        backgroundColor: bgConfig 
    }).then(canvas => {
        const link = document.createElement('a');
        
        // 3. Handle Formats
        if (format === 'jpg') {
            link.download = `${filename}.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.9);
        } else {
            // Both 'png' and 'transparent' save as .png
            link.download = `${filename}.png`;
            link.href = canvas.toDataURL('image/png');
        }
        
        link.click();
        
        // 4. Success State
        progressText.innerText = "Complete!";
        finalDownloadBtn.innerText = "Redownload"; 
        finalDownloadBtn.style.backgroundColor = "#00ba7c"; 
        finalDownloadBtn.disabled = false;
    });
}


// 4. Share Logic
shareBtn.addEventListener('click', async () => {
    // Check if sharing is supported
    if (navigator.share) {
        shareBtn.innerText = "Sharing...";
        
        const tweetCard = document.getElementById('tweetCard');
        const canvas = await html2canvas(tweetCard, { scale: 2, backgroundColor: isDark ? "#000000" : "#ffffff" });
        
        canvas.toBlob(async (blob) => {
            const file = new File([blob], "tweet.png", { type: "image/png" });
            try {
                await navigator.share({
                    files: [file],
                    title: 'Check out this tweet',
                    text: 'Created with Fake X Post Generator'
                });
                shareBtn.innerText = "Shared!";
            } catch (err) {
                console.log("Share canceled");
                shareBtn.innerText = "Share";
            }
        });
    } else {
        // Fallback: Copy to Clipboard
        alert("Sharing not supported on this browser. Image copied to clipboard!");
        // (Clipboard logic can be added here if needed)
    }
});
