(async () => {
    console.log("🚀 Starting Consistent Un-Liker...");
    let totalCount = 0;
    const sleep = (s) => new Promise(r => setTimeout(r, s * 1000));

    while (true) {
        // Find ONLY buttons that are currently 'pressed' (liked)
        let activeLikes = Array.from(document.querySelectorAll('button'))
            .filter(b => b.getAttribute('aria-pressed') === 'true');

        if (activeLikes.length === 0) {
            console.log("Empty batch. Scrolling for more...");
            window.scrollTo(0, document.body.scrollHeight);
            await sleep(3); // Wait for new content
            
            // Check again - if still 0, we are done
            activeLikes = Array.from(document.querySelectorAll('button'))
                .filter(b => b.getAttribute('aria-pressed') === 'true');
            if (activeLikes.length === 0) break;
        }

        for (const btn of activeLikes) {
            try {
                // Ensure button is still 'pressed' before clicking
                if (btn.getAttribute('aria-pressed') !== 'true') continue;

                btn.scrollIntoView({ block: 'center' });
                await sleep(0.5);

                // Use a standard click
                btn.click();
                totalCount++;
                console.log(`✅ Un-liked item #${totalCount}`);

                // CRITICAL: Wait for LinkedIn to update the state
                // This prevents "Double-clicking" the same button
                await sleep(1.2); 

                // If a hover menu (Like/Celebrate/Love) appeared, close it
                document.body.click(); 
            } catch (err) {
                console.error("Skipping a glitchy button...");
            }
        }
    }
    console.log(`🏁 Finished. Total items processed: ${totalCount}`);
})();
