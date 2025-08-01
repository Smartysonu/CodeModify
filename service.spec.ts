<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Accordion Without Button Tag</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }

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

    .accordion-header {
      background-color: #eee;
      color: #444;
      cursor: pointer;
      padding: 10px;
      width: 100%;
      text-align: left;
      font-size: 16px;
      transition: background-color 0.3s;
      margin-top: 10px;
      border: 1px solid #ccc;
    }

    .accordion-header:hover,
    .accordion-header.active {
      background-color: #ccc;
    }

    .panel {
      display: none;
      padding: 15px;
      background-color: white;
      border: 1px solid #ccc;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      margin-bottom: 10px;
    }
  </style>
</head>
<body>

  <!-- Red Message Box -->
  <div class="messagebox">
    <strong>Votre installation est en cours de préparation</strong>
    Nous vous contacterons très bientôt avec plus d’informations ou pour vous demander des détails supplémentaires. Veuillez patienter.
  </div>

  <!-- Accordion Sections -->
  <div class="accordion-header">Section 1</div>
  <div class="panel">
    <p>Contenu de la section 1 affiché correctement.</p>
  </div>

  <div class="accordion-header">Section 2</div>
  <div class="panel">
    <p>Contenu de la section 2 affiché correctement.</p>
  </div>

  <!-- Script -->
  <script>
    document.addEventListener("DOMContentLoaded", function () {
      const headers = document.querySelectorAll(".accordion-header");

      headers.forEach(header => {
        header.addEventListener("click", function () {
          // Close all other panels
          document.querySelectorAll(".panel").forEach(p => {
            if (p !== this.nextElementSibling) p.style.display = "none";
          });

          // Toggle this panel
          const panel = this.nextElementSibling;
          panel.style.display = (panel.style.display === "block") ? "none" : "block";
        });
      });
    });
  </script>

</body>
</html>
