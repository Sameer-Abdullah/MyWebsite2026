      const modal = document.getElementById("projectModal");
      const pmImg = document.getElementById("pmImg");
      const pmBadge = document.getElementById("pmBadge");
      const pmTitle = document.getElementById("pmTitle");
      const pmDesc = document.getElementById("pmDesc");
      const pmStack = document.getElementById("pmStack");
      const pmRole = document.getElementById("pmRole");
      const pmFeatures = document.getElementById("pmFeatures");
      const pmChallenges = document.getElementById("pmChallenges");
      const pmOutcome = document.getElementById("pmOutcome");
      const pmGithub = document.getElementById("pmGithub");

      function chip(text) {
        const s = document.createElement("span");
        s.className = "pm-chip";
        s.textContent = text;
        return s;
      }

      function openModal(card) {
        const img = card.querySelector(".thumb img");
        pmImg.src = img ? img.src : "";
        pmImg.alt = img ? img.alt : "";

        pmBadge.textContent = card.dataset.badge || "";
        pmTitle.textContent = card.dataset.title || "";
        pmDesc.textContent = card.dataset.desc || "";

        pmStack.innerHTML = "";
        const stack = (card.dataset.stack || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        stack.slice(0, 8).forEach((t) => pmStack.appendChild(chip(t)));

        pmRole.textContent = card.dataset.role || "";
        pmChallenges.textContent = card.dataset.challenges || "";
        pmOutcome.textContent = card.dataset.outcome || "";

        pmFeatures.innerHTML = "";
        const features = (card.dataset.features || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        features.slice(0, 8).forEach((f) => {
          const li = document.createElement("li");
          li.textContent = f;
          pmFeatures.appendChild(li);
        });

        pmGithub.href = card.dataset.github || "#";

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }

      function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }

      document.querySelectorAll(".grid .card").forEach((card) => {
        card.addEventListener("click", () => openModal(card));
      });

      document.querySelectorAll(".card a").forEach((a) => {
        a.addEventListener("click", (e) => e.stopPropagation());
      });

      modal.addEventListener("click", (e) => {
        if (e.target.matches("[data-close]")) closeModal();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open"))
          closeModal();
      });