document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');

    function loadPosts() {
        fetch('posts/xml/posts.xml')
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                displayPosts(xmlDoc);
            })
            .catch(error => console.error('Error loading posts:', error));
    }

    function displayPosts(xmlDoc) {
        const posts = xmlDoc.getElementsByTagName('post');
        const postsArray = Array.from(posts);

        postsArray.sort((a, b) => {
            const dateA = new Date(a.getElementsByTagName('date')[0].textContent);
            const dateB = new Date(b.getElementsByTagName('date')[0].textContent);
            return dateB - dateA; // Sort in descending order
        });

        postsArray.forEach(post => {
            const title = post.getElementsByTagName('title')[0].textContent;
            const subtitle = post.getElementsByTagName('subtitle')[0].textContent;
            const body = post.getElementsByTagName('body')[0].textContent;
            const date = post.getElementsByTagName('date')[0].textContent;
            const image = post.getElementsByTagName('image')[0]?.textContent;

            const postElement = document.createElement('div');
            postElement.classList.add('post');

            postElement.innerHTML = `
                <h2>${title}</h2>
                <h3>${subtitle}</h3>
                <p>${body}</p>
                <p><em>${date}</em></p>
                ${image ? `<img src="posts/images/${image}" alt="${title} image" />` : ''}
            `;

            postsContainer.appendChild(postElement);
        });
    }

    loadPosts();
});