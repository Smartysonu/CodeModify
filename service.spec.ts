<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accordion Fix</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }

    /* Message box with red left border */
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

    /* Accordion button style */
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
      margin-top: 10px;
    }

    .accordion:hover,
    .accordion.active {
      background-color: #ccc;
    }

    /* Panel to show/hide */
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

  <!-- Red message box -->
  <div class="messagebox">
    <strong>Votre installation est en cours de préparation</strong>
    Nous vous contacterons très bientôt avec plus d’informations ou pour vous demander des détails supplémentaires. Veuillez patienter.
  </div>

  <!-- Accordion section -->
  <button class="accordion">Section 1</button>
  <div class="panel">
    <p>Contenu de la section 1 affiché sous le bouton.</p>
  </div>

  <button class="accordion">Section 2</button>
  <div class="panel">
    <p>Contenu de la section 2 affiché sous le bouton.</p>
  </div>

  <!-- Script to toggle accordion -->
  <script>
    const acc = document.getElementsByClassName("accordion");

    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        const panel = this.nextElementSibling;

        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    }
  </script>

</body>
</html>
