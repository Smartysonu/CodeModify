scrollToBottom() {
    const element = document.querySelector('.rsc-da-bot_messages');
    if (!element) {
        console.log("❌ No scroll container found");
        return;
    }

    const allMsgs = element.querySelectorAll("span");
    const lastMsg = allMsgs[allMsgs.length - 1];

    console.log("====================================");
    console.log("🟡 scrollToBottom() triggered");
    console.log("Total messages:", allMsgs.length);
    console.log("Last message:", lastMsg?.innerText);

    // Identify type
    let type = "unknown";
    if (lastMsg?.classList.contains("rsc-da-user__message")) type = "USER";
    if (lastMsg?.classList.contains("rsc-da-bot__messages")) type = "BOT";
    if (lastMsg?.classList.contains("rsc-da-agent__message")) type = "AGENT";

    console.log("Last message TYPE:", type);

    console.log("Current botMsgCount:", this.botMsgCount);
    console.log("Current agentMsgCount:", this.agentMsgCount);

    let target;

    // ------------------ USER MESSAGE ------------------
    if (type === "USER") {
        this.botMsgCount = 0;
        this.agentMsgCount = 0;
        target = element.scrollHeight;

        console.log("➡ USER → RESET counters");
        console.log("➡ USER → Target = BOTTOM:", target);
    }

    // ------------------ BOT MESSAGE ------------------
    else if (type === "BOT") {
        this.botMsgCount++;
        this.agentMsgCount = 0;

        console.log("➡ BOT message #", this.botMsgCount);

        if (this.botMsgCount <= 2) {
            target = lastMsg.offsetTop;
            console.log("➡ BOT → Scroll to bot msg:", target);
        } else {
            const secondMsg = allMsgs[1];
            target = secondMsg?.offsetTop ?? 0;
            console.log("➡ BOT → LOCK at 2nd msg:", target);
        }
    }

    // ------------------ AGENT MESSAGE ------------------
    else if (type === "AGENT") {
        this.agentMsgCount++;
        this.botMsgCount = 0;

        console.log("➡ AGENT message #", this.agentMsgCount);

        if (this.agentMsgCount <= 2) {
            target = lastMsg.offsetTop;
            console.log("➡ AGENT → Scroll to agent msg:", target);
        } else {
            const secondMsg = allMsgs[1];
            target = secondMsg?.offsetTop ?? 0;
            console.log("➡ AGENT → LOCK at 2nd msg:", target);
        }
    }

    // ------------------ APPLY SCROLL ------------------
    if (target !== undefined) {
        console.log("📌 Setting scrollTop =", target);
        element.scrollTop = target;

        // Log actual DOM result
        setTimeout(() => {
            console.log("📌 Actual scrollTop =", element.scrollTop);
            console.log("====================================");
        }, 20);
    } else {
        console.log("❌ No target calculated");
        console.log("====================================");
    }
}
