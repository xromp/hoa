<template>
  <div class="vx-col md:w-1/4 w-full">
    <div class="vx-row"  v-for="(building, index) in buildings" :key="index">
      <div class="vx-col w-4/5" style="padding-right: 0;">
        <vs-input
          class="w-full mt-4"
          :label="`Building ${index+1}`"
          v-model="building.name" 
          v-validate="'required'" 
          name="name" 
          type="text"/>
      <span class="text-danger text-sm"  v-show="errors.has('name')">{{ errors.first('name') }}</span>
      </div>
      <div class="vx-col w-1/5" style="margin-top: 3em;">
        <feather-icon 
          icon="XCircleIcon" 
          svgClasses="h-5 w-5 mr-4 hover:text-danger cursor-pointer"
          class="cursor-pointer"
          @click="removeBuilding(index)"
          v-if="index+1 === buildings.length && index !== 0"/>
      </div>
      <div class="mt-4"
        style="margin-left: 8em;"
        v-if="index+1 === buildings.length">
        <vs-button
          color="primary"
          type="border" 
          class="mr-4"
          @click="addBuilding">
          Add Building</vs-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { 
    buildings: Array,
    property_id: Number,
  },
  methods: {
    removeBuilding(i) {
      this.buildings.splice(i, 1);
      this.$emit('update:buildings', this.buildings);
    },
    addBuilding() {
      this.buildings.push({
        name: '',
        property_id: this.property_id,
        createdAt: new Date()
      });
      this.$emit('update:buildings', this.buildings);
    },
  },
  mounted() {
    if (!this.buildings.length) {
      this.buildings.push({ name: '', property_id: this.property_id, createdAt: new Date() });
    }
  }
}
</script>

<style>

</style>