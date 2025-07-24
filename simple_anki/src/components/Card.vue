<template>
  
</template>

<!-- <template>
  <div class="user-profile">
    <h2>{{ user.name }}'s Profile</h2> -->

    <!-- Component-specific tools with @call event handlers -->
    <!-- <tool
      :name="`update_${userId}_profile`"
      description="Update this user's profile"
      @call="handleUpdateProfile"
    >
      <prop name="field" type="string" required description="name, email, or bio"></prop>
      <prop name="value" type="string" required></prop>
    </tool>

    <tool
      :name="`toggle_${userId}_notifications`"
      description="Toggle email notifications"
      @call="handleToggleNotifications"
    >
    </tool> -->

    <!-- Context automatically reflects reactive state -->
    <!-- <context :name="`user_${userId}_state`">
      Name: {{ user.name }}
      Email: {{ user.email }}
      Bio: {{ user.bio }}
      Notifications: {{ user.notifications ? 'Enabled' : 'Disabled' }}
    </context> -->

    <!-- Regular UI -->
    <!-- <div class="profile-details">
      <p>Email: {{ user.email }}</p>
      <p>Bio: {{ user.bio }}</p>
      <p>Notifications: {{ user.notifications ? 'On' : 'Off' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
}) -->

<!-- const user = ref({
  name: 'John Doe',
  email: 'john@example.com',
  bio: 'Software developer',
  notifications: true
}) -->

<!-- // Tool handlers -->
<!-- function handleUpdateProfile(event) {
  const { field, value } = event.detail

  if (field in user.value) {
    user.value[field] = value
    event.detail.success = true
    event.detail.message = `Updated ${field} to ${value}`
  } else {
    event.detail.success = false
    event.detail.error = `Invalid field: ${field}`
  }
}

function handleToggleNotifications(event) {
  user.value.notifications = !user.value.notifications
  event.detail.success = true
  event.detail.message = `Notifications ${user.value.notifications ? 'enabled' : 'disabled'}`
}
</script> -->