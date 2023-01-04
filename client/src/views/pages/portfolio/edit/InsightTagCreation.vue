<template>
  <div class="vx-col w-full">
    <div class="vx-row"  v-for="(building, index) in billTypes" :key="index">
      <div class="vx-col w-2/6">
        <div class="mt-4">
          <vs-input
            class="w-full mt-4"
            label="Bill Type"
            v-model="building.name" 
            v-validate="'required'" 
            name="name" 
            type="text"/>
          <span class="text-danger text-sm"  v-show="errors.has(`name${key+1}`)">{{ errors.first(`name${key+1}`) }}</span>
        </div>
      </div>
      <div class="vx-col w-1/6">
        <div class="mt-4">
          <vs-input
            class="w-full mt-4"
            label="Code"
            v-model="building.code" 
            v-validate="'required'" 
            name="code" 
            type="text"/>
          <span class="text-danger text-sm"  v-show="errors.has(`code${key+1}`)">{{ errors.first(`code${key+1}`) }}</span>
        </div>
      </div>
      <div class="vx-col w-2/6">
        <div class="mt-4">
          <vs-input
            class="w-full mt-4"
            label="Insight Tag"
            v-model="building.insight_tag" 
            v-validate="'required'" 
            name="name" 
            type="text"/>
          <span class="text-danger text-sm"  v-show="errors.has(`approver${key+1}`)">{{ errors.first(`approver${key+1}`) }}</span>
        </div>
      </div>
      <div style="margin-top: 3em;">
        <feather-icon 
          icon="XCircleIcon" 
          svgClasses="text-danger cursor-pointer"
          class="cursor-pointer"
          v-if="billTypes.length !== 1"
          @click="removeBuilding(index)"/>
        <feather-icon 
          icon="PlusCircleIcon" 
          svgClasses="text-success cursor-pointer"
          class="cursor-pointer"
          v-if="index+1 === billTypes.length"
          @click="addBuilding"/>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select';
export default {
  props: { 
    billTypes: Array,
  },
  components: {
    vSelect,
  },
  data() {
    return {
      forceRender: 0,
      tags: [{ id: 1, name: 'Security' }, { id: 2, name: 'Faculty Fees' }],
    }
  },
  methods: {
    removeBuilding(i) {
      this.billTypes.splice(i, 1);
      this.$emit('update:billTypes', this.billTypes);
    },
    addBuilding() {
      this.billTypes.push({
        name: '',
        code: '',
        insight_tag: '',
      });
      this.$emit('update:billTypes', this.billTypes);
    },
  }
}
</script>

<style>

</style>