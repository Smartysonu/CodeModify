<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accordéon Exemple</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }

    /* Original red alert style */
    .messagebox {
      border-left: 5px solid red;
      background-color: #f5f5f5;
      padding: 15px;
      color: #000;
      position: relative;
      overflow: visible;
    }

    .messagebox strong {
      color: red;
      display: block;
      margin-bottom: 8px;
    }

    /* Accordion styles */
    .accordion {
      background-color: #eee;
      color: #444;
      cursor: pointer;
      padding: 10px;
      width: 100%;
      border: none;
      outline: none;
      text-align: left;
      font-size: 16px;
      transition: background-color 0.3s ease;
      margin-top: 15px;
    }

    .accordion:hover,
    .accordion.active {
      background-color: #ccc;
    }

    .panel {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      width: 300px;
      background-color: white;
      border: 1px solid #ccc;
      padding: 15px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 10;
    }

    .accordion-container {
      position: relative; /* Needed for absolute panel */
    }
  </style>
</head>
<body>

  <div class="messagebox">
    <strong>Votre installation est en cours de préparation</strong>
    Nous vous contacterons très bientôt avec plus d’informations ou pour vous demander des détails supplémentaires. Veuillez patienter.
  </div>

  <!-- Accordion block below -->
  <div class="accordion-container">
    <button class="accordion">Section 1</button>
    <div class="panel">
      <p>Contenu de la section 1 affiché hors de la boîte.</p>
    </div>

    <button class="accordion">Section 2</button>
    <div class="panel">
      <p>Contenu de la section 2 affiché hors de la boîte.</p>
    </div>
  </div>

  <script>
    const acc = document.getElementsByClassName("accordion");

    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        const allPanels = document.querySelectorAll(".panel");
        allPanels.forEach(p => p.style.display = "none");

        const panel = this.nextElementSibling;
        panel.style.display = (panel.style.display === "block") ? "none" : "block";
      });
    }
  </script>

</body>
</html>
