<template>
    <component :is="iconComponent" :active="active" />
</template>

<script>
import AnalyticsIcon from "./icons/AnalyticsIcon.vue";
import DashboardIcon from "./icons/DashboardIcon.vue";
import ListIcon from "./icons/ListIcon.vue";
import CommerceIcon from "./icons/CommerceIcon.vue";
import AuthenticationIcon from "./icons/AuthenticationIcon.vue";
import CampaignIcon from "./icons/CampaignIcon.vue";
import InboxIcon from "./icons/InboxIcon.vue";
import LoadingIcon from "./icons/LoadingIcon.vue";
import MessageIcon from "./icons/MessageIcon.vue";
import TaskIcon from "./icons/TaskIcon.vue";
import TeamIcon from "./icons/TeamIcon.vue";
import UtilityIcon from "./icons/UtilityIcon.vue";
import SettingIcon from "./icons/SettingIcon.vue";
import OnboardIcon from "./icons/OnboardIcon.vue";
import CalendarIcon from "./icons/CalendarIcon.vue";
import ComponentIcon from "./icons/ComponentIcon.vue";

const icons = {
    analytics: AnalyticsIcon,
    dashboard: DashboardIcon,
    list: ListIcon,
    commerce: CommerceIcon,
    authentication: AuthenticationIcon,
    campaign: CampaignIcon,
    inbox: InboxIcon,
    loading: LoadingIcon,
    message: MessageIcon,
    task: TaskIcon,
    team: TeamIcon,
    utility: UtilityIcon,
    setting: SettingIcon,
    onboard: OnboardIcon,
    calendar: CalendarIcon,
    component: ComponentIcon,
};

export default {
    name: "BaseIcon",
    props: {
        active: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            required: true,
            validator(value) {
                return Object.prototype.hasOwnProperty.call(icons, value);
            },
        },
    },

    computed: {
        iconComponent() {
            return icons[this.name];
        },
    },
};
</script>
