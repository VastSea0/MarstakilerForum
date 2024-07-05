<script>

</script>
<template>
  <div class="container text-center">
  <div class="row">
    
    <div class="col-8">
  
      <!-- 
      GÖNDERİLERİN LİSTENECEĞİ YER
      -->
     
      <br>
      <div class="post-list">
        <div class="row">
          <div class="card">
            <div class="card-body">
              <h1>Kullanıcı Adı: </h1>
              <p>
                Kullanıcı biyografisi
              </p>
            </div>
            <div class="button-list">
             
              <div class="btn disabled" >
                Takipçi sayısı | GÖnderi sayısı
              </div>
            </div>
         
          </div>
        </div>
        <!--
        YORUMLAR
        -->
        <div class="row">
            <div class="col-4">
                <h1>
                    
                </h1>
            </div>
            <div class="col-8  ">
                <center>
                    <h1>Gönderilerin</h1>
                    <div class="row">
                        <div >
                            <div class="card ">
                                <div class="card-body">
                                  <h1>Kullanıcı Adı: </h1>
                                  <p>
                                    Gönderi içeriği
                                  </p>
                                </div>
                              </div>
                        </div>
                      </div>
                </center>
              
            </div>
        </div>
        <div class="row">
            <div class="col-4">
                <h1>
                    
                </h1>
            </div>
            <div class="col-8  ">
                <center>
                   
                    <div class="row">
                        <div >
                            <div class="card ">
                                <div class="card-body">
                                  <h1>Kullanıcı Adı: </h1>
                                  <p>
                                    GÖnderi içeriği
                                  </p>
                                </div>
                              </div>
                        </div>
                      </div>
                </center>
              
            </div>
        </div>
     
      </div>
     


    </div>
    <div class="col">
      <sidebar-component></sidebar-component>
    </div>
  </div>
</div>
</template>
<script>
import SidebarComponent from '/src/components/sidebar.vue';

export default {
  components: {
    SidebarComponent
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

.button-list .btn {
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.button-list .btn.disabled {
  background-color: #292929;
  cursor: default;
}
</style>
