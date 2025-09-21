(async function() {
    const container = document.getElementById('also-download');
    if (!container) return;

    const feedURL = 'https://odiabook.in/feeds/posts/default?alt=json&max-results=50';
    
    try {
        const response = await fetch(feedURL);
        const data = await response.json();
        const posts = data.feed.entry || [];

        function shuffleArray(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        const randomPosts = shuffleArray(posts).slice(0, 7);

        const list = document.createElement('ul');
        randomPosts.forEach(post => {
            const title = post.title.$t.toUpperCase(); // Convert to ALL CAPS
            const link = post.link.find(l => l.rel === 'alternate').href;
            const li = document.createElement('li');

            li.innerHTML = `<a href="${link}" target="_blank">${title} | BOOK DOWNLOAD</a>`;
            list.appendChild(li);
        });

        container.appendChild(list);
    } catch (error) {
        console.error('Error fetching posts:', error);
        container.textContent = 'Unable to load posts at this time.';
    }
})();
