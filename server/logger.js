import colors from 'ansi-256-colors';

const spacer = colors.fg.getRgb(1, 1, 1) + '┈' + colors.reset;
const getShade = function (alertLevel) {
    return colors.fg.getRgb(3, Math.max(5 - alertLevel, 0), 0);
};

export default function loggerFactory() {
    const slots = new Array(3);

    setInterval(() => {
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];

            if (slot) {
                slots[i] = slot + 1;
            }
        }
    }, 100);

    return async function logger(context, next) {
        const start = Date.now();

        let slot;
        for (let i = 0; i < slots.length; i++) {
            if (!slots[i]) {
                slot = i;
                break;
            }
        }

        if (slot === undefined) {
            slots.push(0);
            slot = slots.length - 1;
        }

        const openSlot = slots.map(slot => slot ? getShade(slot) + '│' + colors.reset : spacer);
        openSlot[slot] = '┬';
        slots[slot] = 1;

        // eslint-disable-next-line no-console
        console.log(`${new Array(4).join(spacer)} ⇾ ${context.method} ${new Array(6).join(spacer)} ${openSlot.join(spacer)} ${context.originalUrl}`);

        await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
        await next();

        let time = `${Date.now() - start}ms`;

        if (time.length < 5) {
            time = new Array(6 - time.length).join(spacer) + time;
        }

        const closeSlot = slots.map(slot => slot ? getShade(slot) + '│' + colors.reset : spacer);
        closeSlot[slot] = slots[slot] === 1 ? '┴' : getShade(slots[slot]) + '┴' + colors.reset;
        slots[slot] = undefined;

        // eslint-disable-next-line no-console
        console.log(`${context.status} ⇽ ${context.method} ${time} ${closeSlot.join(spacer)} ${context.originalUrl}`);
    };
}
