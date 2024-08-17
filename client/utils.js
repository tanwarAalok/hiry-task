

export function getFirstName(name) {
    return name.split(' ')[0];
}

export function getTimePassed(time) {
    const now = new Date();
    const then = new Date(time);

    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thenDate = new Date(then.getFullYear(), then.getMonth(), then.getDate());

    const elapsed = nowDate - thenDate;

    const oneDay = 86400000;

    if (elapsed === 0) {
        return then.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Kolkata'
        });
    } else if (elapsed === oneDay) {
        return 'Yesterday';
    } else if (elapsed < oneDay * 7) {
        const days = Math.floor(elapsed / oneDay);
        return `${days} days ago`;
    } else {
        return then.toLocaleDateString('en-US');
    }
}

export function checkOnline (onlineUsers, userId)  {
    return onlineUsers.includes(userId);
}
