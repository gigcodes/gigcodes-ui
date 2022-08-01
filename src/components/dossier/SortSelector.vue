<template>
    <div class="dossier-sort-options">
        <btn>
            <base-icon name="list"/>
            {{ sortLabel }}
        </btn>
        <ul class="dropdown-menu">
            <li v-for="(column,key) in columns" :key="key">
                <a href="" @click.prevent="changeSortColumn(column.field)">
                    {{ column.header }}
                    <span
                        v-if="sort === column.field"
                        class="icon icon-check pull-right mr-0"
                    ></span>
                </a>
            </li>
            <li class="divider"></li>
            <li>
                <a href="" @click.prevent="changeSortOrder('asc')">
                    Ascending
                    <span
                        v-if="order === 'asc'"
                        class="icon icon-check pull-right mr-0"
                    ></span>
                </a>
            </li>
            <li>
                <a href="" @click.prevent="changeSortOrder('desc')">
                    Descending
                    <span
                        v-if="order === 'desc'"
                        class="icon icon-check pull-right mr-0"
                    ></span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import _ from "underscore";
import BaseIcon from "../../components/BaseIcon.vue";
import {Btn} from "../../index";
import {computed, ref} from "vue";

export default {
    name: "DossierSortSelector",
    components: {
        BaseIcon,
        Btn,
    },
    emits: ["sortBy", "sort"],
    props: {
        sortOrder: {
            type: String,
            default: null,
        },
        sortData: {
            type: String,
            default: null,
        },
        columns: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props, {emit}) {
        const order = ref(props.sortOrder);
        const sort = computed(() => {
            return props.sortData;
        });

        const sortLabel = computed(() => {
            let data = _.where(props.columns, {value: sort.value})[0];
            if (data) return data.header;
            else return undefined;
        });

        const changeSortColumn = (sort) => {
            emit("sort", {
                sort,
                order: order.value,
            });
        };
        const changeSortOrder = (order) => {
            emit("sortBy", {
                sort: sort.value,
                order,
            });
        };

        return {
            order,
            sort,
            sortLabel,
            changeSortColumn,
            changeSortOrder,
        };
    },
};
</script>
