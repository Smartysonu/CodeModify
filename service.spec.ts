<!-- HTML content -->
<div class="messagebox">
  <strong>Votre installation est en cours de préparation</strong>
  Nous vous contacterons très bientôt avec plus d’informations ou pour vous demander des détails supplémentaires. Veuillez patienter.
</div>

<button class="accordion">Section 1</button>
<div class="panel">
  <p>Contenu de la section 1 affiché correctement.</p>
</div>

<button class="accordion">Section 2</button>
<div class="panel">
  <p>Contenu de la section 2 affiché correctement.</p>
</div>

<!-- CSS -->
<style>
  .messagebox {
    border-left: 5px solid red;
    background-color: #f5f5f5;
    padding: 15px;
    color: #000;
    margin-bottom: 20px;
  }
  .messagebox strong {
    color: red;
    display: block;
    margin-bottom: 8px;
  }
  .accordion {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 10px;
    width: 100%;
    border: none;
    text-align: left;
    font-size: 16px;
    transition: 0.3s;
    margin-top: 10px;
  }
  .accordion.active,
  .accordion:hover {
    background-color: #ccc;
  }
  .panel {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    background-color: white;
    padding: 0 15px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .panel.show {
    padding: 15px;
    max-height: 500px;
  }
</style>

<!-- JavaScript -->
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach(btn => {
      btn.addEventListener("click", function () {
        const panel = this.nextElementSibling;

        document.querySelectorAll(".panel").forEach(p => {
          if (p !== panel) p.classList.remove("show");
        });

        panel.classList.toggle("show");
      });
    });
  });
</script>
