(async () => {
    console.log("🚀 Starting Reaction & Comment Remover...");
    let totalActionCount = 0;

    const sleep = (s) => new Promise(r => setTimeout(r, s * 1000));

    async function scrollAndExpand() {
        console.log("Expanding page and comments...");
        window.scrollTo(0, document.body.scrollHeight);
        
        // Click "Load more comments" and "Show previous replies"
        const expandButtons = document.querySelectorAll(
            'button.comments-comments-list__show-previous-button, button.show-prev-replies, button.scaffold-finite-scroll__load-button'
        );
        
        expandButtons.forEach(btn => btn.click());
        await sleep(3); // Wait for content to expand
    }

    while (true) {
        // 1. Find all "Pressed" Like buttons (Posts + Comments)
        const activeLikes = document.querySelectorAll('button[aria-pressed="true"]');
        
        // 2. Find "Delete" options for your own comments
        // Note: You usually have to click the three-dots on a comment first to see these
        const commentMenus = document.querySelectorAll('.comments-comment-item__options-trigger');

        if (activeLikes.length === 0 && commentMenus.length === 0) {
            console.log("No reactions visible. Scrolling...");
            await scrollAndExpand();
            
            // Re-check after scrolling
            const reCheck = document.querySelectorAll('button[aria-pressed="true"]');
            if (reCheck.length === 0) {
                console.log("🏁 Clean sweep! No more reactions found.");
                break;
            }
            continue;
        }

        console.log(`Found ${activeLikes.length} reactions to undo...`);

        // Process Likes/Reactions
        for (const likeBtn of activeLikes) {
            likeBtn.scrollIntoView({ block: 'center', behavior: 'smooth' });
            likeBtn.click();
            totalActionCount++;
            console.log(`✅ Un-reacted (${totalActionCount})`);
            
            // Short delay to prevent LinkedIn from flagging rapid-fire clicks
            await sleep(0.5); 
        }

        // Optional: Small pause before next batch
        await sleep(2);
    }
})();
