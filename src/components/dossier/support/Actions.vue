<template>
  <div class="btn-group action-more">
    <button
        type="button"
        @click.prevent="showActionsDropdown = !showActionsDropdown"
        class="btn-more dropdown-toggle"
        :class="{show:showActionsDropdown}"
        aria-haspopup="true" aria-expanded="false">
      <i class="icon icon-dots-three-vertical"></i>
    </button>
    <ul
        class="dropdown-menu py-2"
        :class="{show:showActionsDropdown}"
    >
      <li
          v-for="(action,index) in actions" :key="index"
          :class="['mb-1', { warning: action === 'delete' }]"
      >
        <a
            v-if="action === 'edit'"
            class="border-0"
            href="#"
            @click.prevent="goTo(item.edit_url)"
        >Edit</a
        >
        <a
            v-if="action === 'delete'"
            class="border-0"
            href="#"
            @click.prevent="showDeleteModal"
        >Delete</a
        >
        <a
            v-if="action === 'update_password'"
            class="border-0"
            href="#"
            @click.prevent="goTo(item.edit_password_url)"
        >Change password</a
        >
        <a
            v-if="item.custom_action_text"
            href="#"
            @click.prevent="goTo(item.custom_action_link)"
        >{{ item.custom_action_text }}</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
import {createToaster, Events, copy} from "../../../index";
import {ref} from "vue";

export default {
  name: "Actions",
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    actions: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const showActionsDropdown = ref(false)
    const deleteModal = ref(false);
    const goTo = (url) => {
      Events.$emit("goTo", url);
      showActionsDropdown.value = false
    };
    const showDeleteModal = () => {
      Events.$emit("showModal", {
        type: "delete",
        item: props.item,
      });
      showActionsDropdown.value = false
    };
    const copyJoinUrl = (url) => {
      copy(url);
      showActionsDropdown.value = false
      createToaster().success("Url copied to clipboard");
    };

    return {
      goTo,
      showDeleteModal,
      copyJoinUrl,
      deleteModal,
      showActionsDropdown,
    };
  },
};
</script>
