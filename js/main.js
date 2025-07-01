document.addEventListener('DOMContentLoaded', function() {
    const postsSlider = document.getElementById('posts-slider');
    let currentIndex = 0;
    let slides = [];
    let isTransitioning = false;

    function loadPosts() {
        fetch('posts/xml/posts.xml')
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                displayPosts(xmlDoc);
                setupScrollEvents();
            })
            .catch(error => console.error('Error loading posts:', error));
    }

    function displayPosts(xmlDoc) {
        const posts = xmlDoc.getElementsByTagName('post');
        const postsArray = Array.from(posts);

        postsArray.sort((a, b) => {
            const dateA = new Date(a.getElementsByTagName('date')[0].textContent);
            const dateB = new Date(b.getElementsByTagName('date')[0].textContent);
            return dateB - dateA;
        });

        postsArray.forEach((post, idx) => {
            const title = post.getElementsByTagName('title')[0].textContent;
            const subtitle = post.getElementsByTagName('subtitle')[0].textContent;
            const body = post.getElementsByTagName('body')[0].textContent;
            const bodySecond = post.getElementsByTagName('body-second')[0]?.textContent || '';
            const date = post.getElementsByTagName('date')[0].textContent;
            const image = post.getElementsByTagName('image')[0]?.textContent;

            const slide = document.createElement('div');
            slide.classList.add('post-slide');
            if (idx === 0) slide.classList.add('active');

            slide.innerHTML = `
                ${image ? `<img class="post-image" src="posts/images/${image}" alt="${title} image" />` : ''}
                <div class="post-bottom-left">
                    <div class="post-tracker"></div>
                    <h1>${title}</h1>
                    <h3>${subtitle}</h3>
                    <p>${body}</p>
                </div>
                <div class="post-bottom-right">
                    <p>${bodySecond}</p>
                    <em>${date}</em>
                </div>
            `;
            postsSlider.appendChild(slide);
        });
        slides = Array.from(document.querySelectorAll('.post-slide'));
        updateTracker();
    }

    function updateTracker() {
        slides.forEach((slide, idx) => {
            const tracker = slide.querySelector('.post-tracker');
            if (tracker) {
                tracker.textContent = `Post ${idx + 1} of ${slides.length}`;
            }
        });
    }

    function setupScrollEvents() {
        let lastScroll = 0;
        window.addEventListener('wheel', function(e) {
            if (isTransitioning) return;
            if (e.deltaY > 70) {
                showNextSlide();
            } else if (e.deltaY < -70) {
                showPrevSlide();
            }
        }, { passive: false });
        // For touch devices
        let touchStartY = null;
        window.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) touchStartY = e.touches[0].clientY;
        });
        window.addEventListener('touchend', function(e) {
            if (touchStartY === null) return;
            let touchEndY = e.changedTouches[0].clientY;
            let diff = touchStartY - touchEndY;
            if (Math.abs(diff) > 70) {
                if (diff > 0) showNextSlide();
                else showPrevSlide();
            }
            touchStartY = null;
        });
    }

    function showNextSlide() {
        if (currentIndex < slides.length - 1) {
            transitionToSlide(currentIndex + 1);
        }
    }
    function showPrevSlide() {
        if (currentIndex > 0) {
            transitionToSlide(currentIndex - 1);
        }
    }
    function transitionToSlide(newIndex) {
        if (isTransitioning || newIndex === currentIndex) return;
        isTransitioning = true;
        slides[currentIndex].classList.remove('active');
        slides[newIndex].classList.add('active');
        setTimeout(() => {
            currentIndex = newIndex;
            isTransitioning = false;
            updateTracker();
        }, 700);
        console.log(newIndex, slides.length);
        if (newIndex === slides.length - 1) {
            document.querySelector('#scroll-arrow').style.display = 'none';
        } else {
            document.querySelector('#scroll-arrow').style.display = 'block';
        }
    }

    loadPosts();
});