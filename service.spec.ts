scrollToBottom() {

    const element = document.querySelectorAll('.rsc-da-bot_messages')[0];
    if (!element) return;

    // 🔥 GET ALL span messages
    const allMsgs = element.querySelectorAll("span");

    // 🔥 Find latest incoming message
    const lastMsg = allMsgs[allMsgs.length - 1];

    // Default target
    let targetTop = 0;

    // 🔥 CASE 1 → USER MESSAGE → ALWAYS SCROLL TO BOTTOM
    if (lastMsg && lastMsg.classList.contains('rsc-da-user__message')) {
        targetTop = element.scrollHeight;  // scroll to last
    }

    // 🔥 CASE 2 → BOT OR AGENT MESSAGE
    else if (
        lastMsg &&
        (lastMsg.classList.contains('rsc-da-bot__messages') ||
         lastMsg.classList.contains('rsc-da-agent__message'))
    ) {

        // If 1st or 2nd message → scroll normally
        if (allMsgs.length <= 2) {
            targetTop = lastMsg.offsetTop;
        } 
        // After 2 messages → lock scroll on 2nd message
        else {
            const secondMsg = allMsgs[1];  // index = 1 → 2nd message
            if (secondMsg) {
                targetTop = secondMsg.offsetTop;
            }
        }
    }

    // 🔥 SET FINAL TARGET
    this.scrollAnimationTarget = targetTop;

    // -------- Your Existing Animation Code Below -------- //

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
