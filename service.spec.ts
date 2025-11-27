scrollToBottom() {

    const element = document.querySelectorAll('.rsc-da-bot_messages')[0];
    if (!element) return;

    const allMsgs = element.querySelectorAll("span");
    const lastMsg = allMsgs[allMsgs.length - 1];

    if (!lastMsg) return;

    // ============================================================
    //                   USER MESSAGE RULE (RESET)
    // ============================================================
    if (lastMsg.classList.contains('rsc-da-user__message')) {

        // Reset BOTH counters
        this.botMsgCount = 0;
        this.agentMsgCount = 0;

        // Always scroll to bottom
        this.scrollAnimationTarget = element.scrollHeight;

        console.log("USER → scroll to bottom + RESET BOT & AGENT counters");
    }

    // ============================================================
    //                   BOT MESSAGE RULE
    // ============================================================
    else if (lastMsg.classList.contains('rsc-da-bot__messages')) {

        // Increase only BOT counter
        this.botMsgCount++;
        // Reset Agent count because it's a new bot sequence
        this.agentMsgCount = 0;

        if (this.botMsgCount <= 2) {
            this.scrollAnimationTarget = lastMsg.offsetTop;
            console.log(`BOT #${this.botMsgCount} → scroll normally`);
        } else {
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

        // Increase only AGENT counter
        this.agentMsgCount++;
        // Reset Bot count because it's a new agent sequence
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
    //                 EXISTING ANIMATION LOGIC
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

        if (now >= endTime) return true;

        if (element.scrollTop === previousTop && element.scrollTop !== frameTop)
            return true;

        previousTop = element.scrollTop;
        setTimeout(scrollFrame, 1);
    };

    setTimeout(scrollFrame, 50);
}
