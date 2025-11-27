scrollToBottom() {

    const element = document.querySelectorAll('.rsc-da-bot_messages')[0];
    if (!element) return;

    const allMsgs = element.querySelectorAll("span");
    const lastMsg = allMsgs[allMsgs.length - 1];
    if (!lastMsg) return;

    // ============================================================
    //                  USER MESSAGE RULE (RESET)
    // ============================================================
    if (lastMsg.classList.contains('rsc-da-user__message')) {

        // Reset BOTH counters
        this.botMsgCount = 0;
        this.agentMsgCount = 0;

        // Force scroll to bottom
        this.forceBottomScroll = true;

        // Bottom-most position
        this.scrollAnimationTarget = element.scrollHeight;

        console.log("USER → force scroll to bottom + reset counters");
    }

    // ============================================================
    //                  BOT MESSAGE RULE
    // ============================================================
    else if (lastMsg.classList.contains('rsc-da-bot__messages')) {

        // Increase ONLY bot counter
        this.botMsgCount++;
        // Reset agent counter
        this.agentMsgCount = 0;

        if (this.botMsgCount <= 2) {
            // scroll normally
            this.scrollAnimationTarget = lastMsg.offsetTop;
            console.log(`BOT #${this.botMsgCount} → scroll normally`);
        } else {
            // lock at second message
            const secondMsg = allMsgs[1];
            if (secondMsg) {
                this.scrollAnimationTarget = secondMsg.offsetTop;
                console.log(`BOT #${this.botMsgCount} → LOCK at 2nd`);
            }
        }
    }

    // ============================================================
    //                AGENT MESSAGE RULE
    // ============================================================
    else if (lastMsg.classList.contains('rsc-da-agent__message')) {

        // Increase ONLY agent counter
        this.agentMsgCount++;
        // Reset bot counter
        this.botMsgCount = 0;

        if (this.agentMsgCount <= 2) {
            this.scrollAnimationTarget = lastMsg.offsetTop;
            console.log(`AGENT #${this.agentMsgCount} → scroll normally`);
        } else {
            const secondMsg = allMsgs[1];
            if (secondMsg) {
                this.scrollAnimationTarget = secondMsg.offsetTop;
                console.log(`AGENT #${this.agentMsgCount} → LOCK at 2nd`);
            }
        }
    }

    // ============================================================
    //              ANIMATION LOGIC (WITH FORCE FIX)
    // ============================================================
    const duration = 600;
    const startTime = Date.now();
    const endTime = startTime + duration;
    const startTop = element.scrollTop;

    const smoothStep = (start, end, point) => {
        if (point <= start) return 0;
        if (point >= end) return 1;
        const x = (point - start) / (end - start);
        return x * x * (3 - 2 * x);
    };

    let previousTop = element.scrollTop;

    const scrollFrame = () => {
        const now = Date.now();
        const point = smoothStep(startTime, endTime, now);
        const frameTop = Math.round(startTop + (this.scrollAnimationTarget - startTop) * point);

        element.scrollTop = frameTop;

        // USER MODE: do NOT allow early stopping
        if (!this.forceBottomScroll) {

            if (now >= endTime) return true;

            // If scroll stopped early → stop animation
            if (element.scrollTop === previousTop && element.scrollTop !== frameTop)
                return true;
        }

        previousTop = element.scrollTop;

        // Finish animation → reset user mode
        if (this.forceBottomScroll && now >= endTime) {
            this.forceBottomScroll = false;
            return true;
        }

        setTimeout(scrollFrame, 1);
    };

    setTimeout(scrollFrame, 50);
}
