scrollToBottom() {
    console.log("===============================================");
    console.log("🟡 scrollToBottom() TRIGGERED");

    const element = document.querySelector('.rsc-da-bot_messages');
    console.log("element =", element);

    if (!element) {
        console.log("❌ element NOT FOUND (.rsc-da-bot_messages)");
        return;
    }

    // ---------------------------------------------------
    // GET ALL MESSAGES (SPANS)
    // ---------------------------------------------------
    const spans = element.querySelectorAll("span");
    const last = spans[spans.length - 1];

    console.log("Total spans found:", spans.length);
    console.log("Last span class:", last?.className);
    console.log("Last span text:", last?.innerText);

    // ---------------------------------------------------
    // DETECT TYPE
    // ---------------------------------------------------
    let type = "";
    if (last?.classList.contains("rsc-da-user__message")) type = "USER";
    if (last?.classList.contains("rsc-bot-message_group-bot")) type = "BOT";
    if (last?.classList.contains("rsc-da-agent__message")) type = "AGENT";

    console.log("🟢 Message TYPE detected =", type);

    // ---------------------------------------------------
    // INIT COUNTERS
    // ---------------------------------------------------
    if (this.botCount === undefined) this.botCount = 0;
    if (this.agentCount === undefined) this.agentCount = 0;

    // ---------------------------------------------------
    // DECIDE TARGET
    // ---------------------------------------------------
    let target = element.scrollHeight; // default bottom

    if (type === "USER") {
        console.log("👤 USER → Reset bot & agent counters + scroll bottom");

        this.botCount = 0;
        this.agentCount = 0;

        target = element.scrollHeight;
    }

    if (type === "BOT") {
        this.botCount++;
        this.agentCount = 0; // reset agent

        console.log("🤖 BOT Message #", this.botCount);

        if (this.botCount <= 2) {
            target = last.offsetTop;
            console.log("➡ BOT → Normal scroll to offsetTop:", target);
        } else {
            const second = spans[1];
            target = second ? second.offsetTop : 0;
            console.log("➡ BOT → LOCK at 2nd message. Target:", target);
        }
    }

    if (type === "AGENT") {
        this.agentCount++;
        this.botCount = 0; // reset bot

        console.log("👨‍💼 AGENT Message #", this.agentCount);

        if (this.agentCount <= 2) {
            target = last.offsetTop;
            console.log("➡ AGENT → Normal scroll:", target);
        } else {
            const second = spans[1];
            target = second ? second.offsetTop : 0;
            console.log("➡ AGENT → LOCK at 2nd message. Target:", target);
        }
    }

    // ---------------------------------------------------
    // APPLY TARGET BEFORE ANIMATION
    // ---------------------------------------------------
    console.log("📌 FINAL scrollAnimationTarget set to:", target);
    this.scrollAnimationTarget = target;

    // ---------------------------------------------------
    // ORIGINAL ANIMATION (UNCHANGED)
    // ---------------------------------------------------
    const duration = 600;
    const startTime = Date.now();
    const endTime = startTime + duration;
    const startTop = element.scrollTop;

    console.log("StartTop:", startTop, "Duration:", duration);

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

        console.log("--------------------------------------");
        console.log("🌀 scrollFrame → now:", now);
        console.log("PreviousTop:", previousTop);
        console.log("Calculated frameTop:", frameTop);

        // If stuck
        if (element.scrollTop === previousTop && element.scrollTop !== frameTop) {
            console.log("⚠ scroll stuck → stopping");
            return true;
        }

        element.scrollTop = frameTop;
        console.log("scrollTop set to:", element.scrollTop);

        if (now >= endTime) {
            console.log("⏹ Animation completed");
            return true;
        }

        previousTop = element.scrollTop;
        setTimeout(scrollFrame, 1);
    };

    console.log("⏳ Scheduling animation...");
    setTimeout(scrollFrame, 50);
}
