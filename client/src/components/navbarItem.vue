<script setup>
import { RouterLink } from 'vue-router'
import NavbarMenuItems from '@/components/navbarMenuItem.vue'
</script>

<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown dropdown-hover">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <NavbarMenuItems></NavbarMenuItems>
        </ul>
      </div>
      <div class="flex">
        <RouterLink class="btn btn-ghost text-xl" to="/">👽 Marstakiler</RouterLink>
      </div>
    </div>
    <div class="navbar-center hidden lg:flex"></div>
    <div class="navbar-end">
      <div class="hidden lg:flex">
        <ul class="menu menu-horizontal gap-2">
          <NavbarMenuItems></NavbarMenuItems>
        </ul>
      </div>
    </div>
  </div>
</template>
