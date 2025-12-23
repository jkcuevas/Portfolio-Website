// assets/js/skills.js
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("skillsGrid");
  const tabs = document.querySelectorAll(".skills__tab");

  if (!grid) {
    console.error("Missing #skillsGrid in HTML");
    return;
  }

  // Grouping based on your tab names
  const groups = {
    languages: ["HTML5", "CSS3", "JavaScript", "Java", "Python", "C++", "ReactJS"],
    frameworks: ["REST API", "Django"],
    databases: ["MySQL", "Firebase"],
    tools: [ "NodeJS", "Git VCS", "GitHub", "VScode", "Flutter", "Android"],
  };

  let allSkills = [];

  function buildSkillCard(skill) {
    const card = document.createElement("div");
    card.className = "skill__card";

    const img = document.createElement("img");
    img.className = "skill__icon";
    img.src = skill.icon;
    img.alt = skill.name;

    const label = document.createElement("span");
    label.className = "skill__label";
    label.textContent = skill.name;

    card.appendChild(img);
    card.appendChild(label);

    return card;
  }

  function render(tabKey) {
    grid.innerHTML = "";

    const filtered =
      tabKey === "all"
        ? allSkills
        : allSkills.filter((s) => groups[tabKey]?.includes(s.name));

    filtered.forEach((skill) => grid.appendChild(buildSkillCard(skill)));
  }

  function setActive(tabKey) {
    tabs.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.skillTab === tabKey);
    });
    render(tabKey);
  }

  // IMPORTANT: skills.json path must be correct relative to index.html
  fetch("skills.json")
    .then((res) => {
      if (!res.ok) throw new Error(`skills.json not found (HTTP ${res.status})`);
      return res.json();
    })
    .then((skills) => {
      allSkills = skills;

      tabs.forEach((btn) => {
        btn.addEventListener("click", () => {
          setActive(btn.dataset.skillTab);
        });
      });

      // Default
      setActive("all");
    })
    .catch((err) => {
      console.error("Error loading skills.json:", err);
      grid.innerHTML = "<p style='opacity:.7'>Skills failed to load.</p>";
    });
});
