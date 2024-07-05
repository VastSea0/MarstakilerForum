<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="/"> <i class="fas fa-home"></i> Marstakiler Forum</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <RouterLink class="nav-link" to="/about"
                  ><i class="fa-solid fa-user-group"></i> Hakkımızda</RouterLink
                >
              </li>

              <li class="nav-item dropdown">
                <button
                  class="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="fa-solid fa-user"></i>
                </button>
                <ul class="dropdown-menu">
                  <li><RouterLink class="dropdown-item" to="/gonderiId">Action</RouterLink></li>
                  <li>
                    <RouterLink class="dropdown-item" to="/kullaniciId"
                      ><i class="fa-solid fa-user"></i> Profil</RouterLink
                    >
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <RouterLink class="dropdown-item" to="/katil">
                      <i class="fa-solid fa-right-to-bracket"></i> Bize Katıl</RouterLink
                    >
                  </li>
                </ul>
              </li>
            </ul>
            <form class="d-flex" role="search">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Ara"
                aria-label="Search"
              />
              <button class="btn btn-outline-success" type="submit">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  </header>
  <div class="container" style="padding: 30px">
    <RouterView />
  </div>
  <footer class="footer">
    <p>Her Hakkı Saklıdır 2024 | Marstakiler</p>
  </footer>
</template>
<style>
.footer {
  background-color: #333;
  color: #fff;
  padding: 20px;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
</style>
