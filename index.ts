import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { UserStore, FluxDispatcher, React, Tooltip } from "@webpack/common";
import { addProfileBadge, removeProfileBadge, ProfileBadge } from "@api/Badges";

const settings = definePluginSettings({
    enabled: {
        type: OptionType.BOOLEAN,
        description: "Enable fake username and display name (client-side only)",
        default: true,
        restartNeeded: false,
    },
    fakeUsername: {
        type: OptionType.STRING,
        description: "Fake username (leave blank to keep real one)",
        default: "",
        restartNeeded: false,
    },
    fakeDisplayName: {
        type: OptionType.STRING,
        description: "Fake display name (leave blank to keep real one)",
        default: "",
        restartNeeded: false,
    },

    badge1Image: {
        type: OptionType.STRING,
        description: "Badge 1 image URL (leave blank to disable)",
        default: "",
        restartNeeded: false,
    },
    badge1Description: {
        type: OptionType.STRING,
        description: "Badge 1 tooltip text",
        default: "Badge 1",
        restartNeeded: false,
    },

    badge2Image: {
        type: OptionType.STRING,
        description: "Badge 2 image URL (leave blank to disable)",
        default: "",
        restartNeeded: false,
    },
    badge2Description: {
        type: OptionType.STRING,
        description: "Badge 2 tooltip text",
        default: "Badge 2",
        restartNeeded: false,
    },

    badge3Image: {
        type: OptionType.STRING,
        description: "Badge 3 image URL (leave blank to disable)",
        default: "",
        restartNeeded: false,
    },
    badge3Description: {
        type: OptionType.STRING,
        description: "Badge 3 tooltip text",
        default: "Badge 3",
        restartNeeded: false,
    },

    badge4Image: {
        type: OptionType.STRING,
        description: "Badge 4 image URL (leave blank to disable)",
        default: "",
        restartNeeded: false,
    },
    badge4Description: {
        type: OptionType.STRING,
        description: "Badge 4 tooltip text",
        default: "Badge 4",
        restartNeeded: false,
    },

    badge5Image: {
        type: OptionType.STRING,
        description: "Badge 5 image URL (leave blank to disable)",
        default: "",
        restartNeeded: false,
    },
    badge5Description: {
        type: OptionType.STRING,
        description: "Badge 5 tooltip text",
        default: "Badge 5",
        restartNeeded: false,
    },
});

const realValues = new WeakMap<object, { username?: string; globalName?: string; }>();

function patchUserObject(user: any) {
    if (!user || typeof user !== "object") return;
    if (realValues.has(user)) return;

    const stored: { username?: string; globalName?: string; } = {
        username: user.username,
        globalName: user.globalName,
    };
    realValues.set(user, stored);

    try {
        Object.defineProperty(user, "username", {
            configurable: true,
            enumerable: true,
            get() {
                if (settings.store.enabled && settings.store.fakeUsername)
                    return settings.store.fakeUsername;
                return stored.username;
            },
            set(v) { stored.username = v; },
        });
    } catch { }

    try {
        Object.defineProperty(user, "globalName", {
            configurable: true,
            enumerable: true,
            get() {
                if (settings.store.enabled && settings.store.fakeDisplayName)
                    return settings.store.fakeDisplayName;
                return stored.globalName;
            },
            set(v) { stored.globalName = v; },
        });
    } catch { }
}

function patchCurrentUser() {
    const me = UserStore.getCurrentUser();
    if (me) patchUserObject(me);
}

let interval: any;
function onDispatch() { patchCurrentUser(); }

type BadgeKey = "badge1" | "badge2" | "badge3" | "badge4" | "badge5";

function makeBadge(slot: BadgeKey): ProfileBadge {
    const imageKey = `${slot}Image` as keyof typeof settings.store;
    const descKey = `${slot}Description` as keyof typeof settings.store;

    return {
        key: `plexcord-${slot}`,
        description: "Custom Badge",
        shouldShow({ userId }: { userId: string; }) {
            const me = UserStore.getCurrentUser();
            return !!(
                settings.store[imageKey] &&
                me &&
                userId === me.id
            );
        },
        component(_props: any) {
            const src = settings.store[imageKey] as string;
            const desc = (settings.store[descKey] as string) || "Custom Badge";
            if (!src) return null;
            return React.createElement(
                Tooltip,
                { text: desc },
                (tooltipProps: any) => React.createElement("img", {
                    ...tooltipProps,
                    src,
                    width: 16,
                    height: 16,
                    style: {
                        borderRadius: "4px",
                        objectFit: "cover",
                        cursor: "pointer",
                        marginRight: "4px",
                    },
                })
            );
        },
    } as ProfileBadge;
}

const badges = [
    makeBadge("badge1"),
    makeBadge("badge2"),
    makeBadge("badge3"),
    makeBadge("badge4"),
    makeBadge("badge5"),
];

export default definePlugin({
    name: "Plexcord",
    description: "Locally override your username, display name, and add up to 5 custom badges. Client-side only, nobody else sees it.",
    authors: [{ name: "dcyxn", id: 1368272513070534807 }],
    dependencies: ["BadgesAPI"],
    settings,

    start() {
        patchCurrentUser();

        FluxDispatcher.subscribe("CURRENT_USER_UPDATE", onDispatch);
        FluxDispatcher.subscribe("USER_UPDATE", onDispatch);
        FluxDispatcher.subscribe("CONNECTION_OPEN", onDispatch);
        interval = setInterval(patchCurrentUser, 3000);

        for (const badge of badges) addProfileBadge(badge);
    },

    stop() {
        FluxDispatcher.unsubscribe("CURRENT_USER_UPDATE", onDispatch);
        FluxDispatcher.unsubscribe("USER_UPDATE", onDispatch);
        FluxDispatcher.unsubscribe("CONNECTION_OPEN", onDispatch);
        if (interval) clearInterval(interval);

        for (const badge of badges) removeProfileBadge(badge);
    },
});
