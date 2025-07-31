<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Accordion Below Box</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }

    .messagebox {
      border: 1px solid #ccc;
      padding: 20px;
      position: relative;
      overflow: visible; /* Allow accordion to escape */
    }

    .messagebox-content {
      background-color: #f5f5f5;
      padding: 20px;
      font-size: 16px;
    }

    .accordion {
      background-color: #eee;
      cursor: pointer;
      padding: 10px;
      width: 100%;
      text-align: left;
      border: none;
      outline: none;
      font-size: 16px;
      transition: 0.3s;
      margin-top: 10px;
    }

    .accordion:hover,
    .active {
      background-color: #ccc;
    }

    .panel {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 999;
      width: 300px;
      background-color: white;
      border: 1px solid #ccc;
      padding: 15px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>

  <div class="messagebox">
    <div class="messagebox-content">
      <strong>Votre installation est en cours de préparation</strong><br />
      Nous vous contacterons très bientôt avec plus d’informations.
    </div>

    <!-- Accordion placed below the box -->
    <button class="accordion">Section 1</button>
    <div class="panel">
      <p>This is Section 1 content shown outside the box.</p>
    </div>

    <button class="accordion">Section 2</button>
    <div class="panel">
      <p>This is Section 2 content shown outside the box.</p>
    </div>
  </div>

  <script>
    const acc = document.getElementsByClassName("accordion");

    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        // Close all other panels
        const allPanels = document.querySelectorAll(".panel");
        allPanels.forEach(p => p.style.display = "none");

        // Toggle current panel
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
