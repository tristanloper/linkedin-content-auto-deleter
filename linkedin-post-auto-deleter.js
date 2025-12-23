(async () => {
    console.log("🚀 Script started (Handling Posts & Reposts)...");

    const sleep = (s) => new Promise(r => setTimeout(r, s * 1000));

    async function scrollAndLoad() {
        console.log("Searching for more results...");
        const showMoreBtn = Array.from(document.querySelectorAll('button'))
            .find(b => b.textContent.trim().includes('Show more results'));

        if (showMoreBtn) {
            showMoreBtn.scrollIntoView();
            showMoreBtn.click();
            await sleep(4); // Longer sleep to let the feed populate
            return true;
        } else {
            window.scrollTo(0, document.body.scrollHeight);
            await sleep(2);
            return false; 
        }
    }

    while (true) {
        let menus = document.querySelectorAll(".feed-shared-control-menu__trigger");
        
        if (menus.length === 0) {
            const loaded = await scrollAndLoad();
            menus = document.querySelectorAll(".feed-shared-control-menu__trigger");
            if (menus.length === 0) {
                console.log("🏁 No more items found.");
                break;
            }
        }

        for (const menuBtn of menus) {
            try {
                menuBtn.scrollIntoView({ block: 'center' });
                await sleep(0.5);
                menuBtn.click();
                await sleep(1.2); // Wait for the dropdown menu to open

                // FIND DELETE OPTION (General match for 'Delete')
                const deleteOption = Array.from(document.querySelectorAll('.feed-shared-control-menu__headline'))
                    .find(el => el.textContent.trim().includes('Delete'));

                if (deleteOption) {
                    console.log(`Found: "${deleteOption.textContent.trim()}" - Clicking...`);
                    deleteOption.click();
                    await sleep(1.5);

                    // FIND CONFIRMATION BUTTON
                    // Looks for a primary button that says "Delete"
                    const confirmBtn = Array.from(document.querySelectorAll('button'))
                        .find(b => b.classList.contains('artdeco-button--primary') && b.textContent.trim().includes('Delete'));

                    if (confirmBtn) {
                        confirmBtn.click();
                        console.log("✅ Deleted successfully.");
                        await sleep(2.5); 
                    }
                } else {
                    console.log("⏭️ Not a deletable item (e.g. Mute/Follow). Skipping...");
                    document.body.click(); // Close the menu
                    await sleep(0.5);
                }
            } catch (err) {
                console.log("⚠️ Processing error, skipping to next.");
                document.body.click();
                await sleep(1);
            }
        }
    }
})();
