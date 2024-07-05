<script>

</script>
<template>
  <div class="container text-center">
  <div class="row">
    <div class="col">
     
    </div>
    <div class="col-6">
      <div class="card">
        <div class="card-boy">
          <h3>Gönderi oluştur</h3>
         
          <div class="mb-3">
            <label for="gonderiFormText" class="form-label">Gönderi içeriği</label>
            <textarea class="form-control" id="gonderiFormText" rows="3"></textarea>
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-primary mb-3" id="gonderiBtn">Gönder</button>
          </div>
        </div>
      </div>
      <!-- 
      GÖNDERİLERİN LİSTENECEĞİ YER
      -->
      <br>
      <post-component></post-component>
      <br>
    
      


    </div>
    <div class="col">
      <sidebar-component></sidebar-component>
    </div>
  </div>
</div>
</template>
<script>
import SidebarComponent from '/src/components/sidebar.vue';
import PostComponent from '/src/components/post.vue';
export default {
  components: {
    SidebarComponent,
    PostComponent
  },
  // Diğer component properties
};
</script>

<style>
 

.card {
   
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin-bottom: 10px;
 
}

.form-label {
  font-weight: bold;
}

#gonderiBtn {
  width: 100%;
}

.post-list {
  margin-top: 20px;
}

.card-body {
  padding: 15px;
  border-radius: 8px;
 
  margin-bottom: 15px;
}

.card-body h1 {
  margin-bottom: 5px;
  
}

 

.button-list {
  display: flex;
  justify-content: space-between;
}

 

.button-list .btn.disabled {
  background-color: #292929;
  cursor: default;
}
</style>
