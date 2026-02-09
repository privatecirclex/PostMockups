// --- INSTAGRAM GENERATOR SCRIPT ---

// 1. Get Elements
const usernameInput = document.getElementById('usernameInput');
const locationInput = document.getElementById('locationInput');
const likesInput = document.getElementById('likesInput');
const captionInput = document.getElementById('captionInput');
const timeInput = document.getElementById('timeInput'); // Used for Comment Text
const profileInput = document.getElementById('profileInput');
const postImageInput = document.getElementById('postImageInput');
const verifiedCheck = document.getElementById('verifiedCheck');
const themeToggle = document.getElementById('themeToggle');
const downloadBtn = document.getElementById('downloadBtn');

// Placeholders & Images
const postPlaceholder = document.getElementById('postPlaceholder');
const displayPostImage = document.getElementById('displayPostImage');

// 2. Live Update Function
function updatePost() {
    // Update Username
    document.getElementById('displayUsername').innerText = usernameInput.value;
    document.getElementById('displayUsernameCaption').innerText = usernameInput.value;
    
    // Update Location (Hide if empty)
    const loc = document.getElementById('displayLocation');
    if (locationInput.value.trim() === "") {
        loc.style.display = "none"; 
    } else {
        loc.style.display = "block";
        loc.innerText = locationInput.value;
    }
    
    // Update Likes & Comments
    document.getElementById('displayLikes').innerText = likesInput.value;
    document.getElementById('displayTime').innerText = timeInput.value;

    // --- HASHTAG LOGIC ---
    // We regex replace any word starting with # to be wrapped in a span
    const originalText = captionInput.value;
    const formattedText = originalText.replace(/(#\w+)/g, '<span class="hashtag">$1</span>');
    document.getElementById('displayCaption').innerHTML = formattedText;

    // --- VERIFIED BADGE LOGIC ---
    const badge1 = document.getElementById('verifiedBadge1');
    const badge2 = document.getElementById('verifiedBadge2');
    if (verifiedCheck.checked) {
        badge1.style.display = "inline-block";
        badge2.style.display = "inline-block";
    } else {
        badge1.style.display = "none";
        badge2.style.display = "none";
    }
}

// 3. Add Event Listeners
const allInputs = [usernameInput, locationInput, likesInput, captionInput, timeInput, verifiedCheck];
allInputs.forEach(input => input.addEventListener('input', updatePost));


postPlaceholder.addEventListener('click', () => postImageInput.click());

// 5. Click-to-Scroll Logic
const interactionMap = {
    'displayUsername': 'usernameInput',
    'displayLocation': 'locationInput',
    'displayLikes': 'likesInput',
    'displayCaption': 'captionInput',
    'displayTime': 'timeInput',
    'displayProfile': 'profileInput'
};
Object.keys(interactionMap).forEach(previewId => {
    const previewEl = document.getElementById(previewId);
    const inputEl = document.getElementById(interactionMap[previewId]);
    if(previewEl && inputEl) {
        previewEl.style.cursor = "pointer"; 
        previewEl.addEventListener('click', (e) => {
            e.preventDefault();
            inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            inputEl.focus();
            inputEl.classList.add('highlight-box');
            setTimeout(() => inputEl.classList.remove('highlight-box'), 1500);
        });
    }
});

// 6. Theme Toggle
let isDark = false;
themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    const card = document.getElementById('instaCard');
    const icons = document.querySelectorAll('.insta-icon');
    
    if (isDark) {
        document.body.classList.add('dark-mode-vars');
        themeToggle.innerText = "Toggle Light Mode";
        themeToggle.style.backgroundColor = "#e1306c"; 
    } else {
        document.body.classList.remove('dark-mode-vars');
        themeToggle.innerText = "Toggle Dark Mode";
        themeToggle.style.backgroundColor = "#0f1419";
    }
});

// 7. Download Logic (Existing logic kept same)
// ... (Keep the previous Download Logic block here as it works fine) ...
const modal = document.getElementById('downloadModal');
const closeModal = document.getElementById('closeModal');
const modalPreview = document.getElementById('modalPreviewImage');
const fileNameInput = document.getElementById('fileNameInput');
const finalDownloadBtn = document.getElementById('finalDownloadBtn');
const progressArea = document.getElementById('progressArea');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

downloadBtn.addEventListener('click', () => {
    modal.classList.add('active');
    fileNameInput.value = `insta-${usernameInput.value}`;
    html2canvas(document.getElementById('instaCard'), { scale: 2 }).then(canvas => {
        modalPreview.src = canvas.toDataURL('image/png');
    });
});

closeModal.addEventListener('click', () => { modal.classList.remove('active'); progressArea.style.display = "none"; });

finalDownloadBtn.addEventListener('click', () => {
    progressArea.style.display = "block";
    finalDownloadBtn.disabled = true;
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        progressBar.style.width = progress + "%";
        progressText.innerText = "Saving...";
        
        if(progress >= 100) {
            clearInterval(interval);
            const format = document.querySelector('input[name="format"]:checked').value;
            const isTransparent = format === 'transparent';
            let bgConfig = isDark ? "#000000" : "#ffffff";
            if (isTransparent) bgConfig = null;

            html2canvas(document.getElementById('instaCard'), { 
                scale: 3,
                backgroundColor: bgConfig,
                useCORS: true 
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `${fileNameInput.value}.${format === 'transparent' ? 'png' : format}`;
                link.href = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`);
                link.click();
                finalDownloadBtn.innerText = "Saved!";
                finalDownloadBtn.style.backgroundColor = "#00ba7c";
                finalDownloadBtn.disabled = false;
            });
        }
    }, 200);
});
// --- 8. LIKE BUTTON LOGIC ---
const likeBtn = document.getElementById('likeBtn');
let isLiked = true; // Starts red by default

// FIX: Added fill="currentColor" to the outline path so it turns white in Dark Mode
const filledHeartPath = '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>';
const outlineHeartPath = '<path fill="currentColor" d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.956-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>';

likeBtn.addEventListener('click', () => {
    isLiked = !isLiked;
    
    // Add bounce animation
    likeBtn.classList.add('bounce');
    setTimeout(() => likeBtn.classList.remove('bounce'), 300);

    if (isLiked) {
        likeBtn.innerHTML = filledHeartPath;
        likeBtn.classList.add('red-heart'); // Red color
    } else {
        likeBtn.innerHTML = outlineHeartPath;
        likeBtn.classList.remove('red-heart'); // Defaults to text color (Black or White)
    }
});
// --- 9. ADVANCED CROPPER LOGIC (Added Fix) ---

let cropper = null;
let currentTargetImg = null; 
let currentInput = null;     

const cropperModal = document.getElementById('cropperModal');
const imageToCrop = document.getElementById('imageToCrop');
const applyCropBtn = document.getElementById('applyCropBtn');
const cancelCropBtn = document.getElementById('cancelCropBtn');
const closeCropper = document.getElementById('closeCropper');

// A. Function to Initialize Cropper
function startCropper(file, targetImgId, isProfile) {
    const reader = new FileReader();
    reader.onload = (e) => {
        // Load image into modal
        imageToCrop.src = e.target.result;
        cropperModal.classList.add('active');
        currentTargetImg = document.getElementById(targetImgId);

        // Destroy previous cropper instance if it exists
        if (cropper) { cropper.destroy(); }

        // Setup Aspect Ratio: 
        // 1 = Square (Good for Insta Profile & Posts)
        // NaN = Free form (if you want to allow tall posts, change to NaN)
        let aspectRatio = 1; 

        cropper = new Cropper(imageToCrop, {
            aspectRatio: aspectRatio,
            viewMode: 1,
            autoCropArea: 1,
            ready() {
                // Visual tweak: Make the crop box round for profiles
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

// B. Event Listeners for File Inputs

// 1. Profile Picture Input
if (profileInput) {
    profileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            currentInput = profileInput; 
            startCropper(e.target.files[0], 'displayProfile', true);
        }
    });
}

// 2. Post Image Input
// We need to define the target ID for the post image
const postImageId = 'displayPostImage'; 

if (postImageInput) {
    postImageInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            currentInput = postImageInput;
            startCropper(e.target.files[0], postImageId, false);
        }
    });
}

// C. Apply Crop Button Click
applyCropBtn.addEventListener('click', () => {
    if (cropper) {
        // Generate high-res canvas
        const canvas = cropper.getCroppedCanvas({
            width: 1080,
            height: 1080,
        });

        // Update the real image on the card
        if (currentTargetImg) {
            currentTargetImg.src = canvas.toDataURL('image/png');
            currentTargetImg.style.display = 'block'; 
            
            // Special Fix: Hide the "Upload Placeholder" icon
            if (postPlaceholder) postPlaceholder.style.display = 'none';
        }

        closeCropperModal();
    }
});

// D. Cancel / Close Functions
function closeCropperModal() {
    cropperModal.classList.remove('active');
    if (cropper) { cropper.destroy(); cropper = null; }
    // Reset input so you can select the same file again if needed
    if (currentInput) currentInput.value = ''; 
}

cancelCropBtn.addEventListener('click', closeCropperModal);
closeCropper.addEventListener('click', closeCropperModal);
