<script setup>
import { RouterLink, RouterView } from 'vue-router'
 
</script>

<template  >
  <header>
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="/"> <i class="fas fa-home"></i>
             Marstakiler Forum</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              
              <li class="nav-item">
                <a class="nav-link" href="/about"><i class="fa-solid fa-user-group"></i> Hakkımızda</a>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Pişt
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="/gonderiId">Action</a></li>
                  <li><a class="dropdown-item" href="/kullaniciId"><i class="fa-solid fa-user"></i> Profil</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="./katil"> <i class="fa-solid fa-right-to-bracket"></i> Bize Katıl</a></li>
                </ul>
              </li>
              
            </ul>
            <form class="d-flex" role="search">
              <input class="form-control me-2" type="search" placeholder="Ara" aria-label="Search">
              <button class="btn btn-outline-success" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
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
    <p>
      Her Hakkı Saklıdır 2024 | Marstakiler
    </p>
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
 
