const searchBtn = document.getElementById("search-btn");
const usernameInput = document.getElementById("username-input");
const profileCard = document.getElementById("profile-card");
const errorMsg = document.getElementById("error-msg");
const loadingMsg = document.getElementById("loading-msg");
const reposGrid = document.getElementById("repos-grid");

searchBtn.addEventListener("click", function() {
  const username = usernameInput.value.trim();

  if (username === "") return;

  // reset everything
  profileCard.classList.add("hidden");
  errorMsg.classList.add("hidden");
  reposGrid.innerHTML = "";

  // show loading
  loadingMsg.classList.remove("hidden");

  fetch("https://api.github.com/users/" + username)
    .then(function(response) {
      if (response.status === 404) {
        loadingMsg.classList.add("hidden");
        errorMsg.classList.remove("hidden");
        return;
      }
      return response.json();
    })
    .then(function(data) {
      if (!data) return;

      loadingMsg.classList.add("hidden");

      document.getElementById("avatar").src = data.avatar_url;
      document.getElementById("name").textContent = data.name || data.login;
      document.getElementById("bio").textContent = data.bio || "No bio available";
      document.getElementById("followers").textContent = data.followers;
      document.getElementById("repos-count").textContent = data.public_repos;

      profileCard.classList.remove("hidden");

      // fetch repos
      fetch("https://api.github.com/users/" + username + "/repos?per_page=4")
        .then(function(r) { return r.json(); })
        .then(function(repos) {
          repos.forEach(function(repo) {
            const card = document.createElement("div");
            card.classList.add("repo-card");
            card.innerHTML = `
              <a href="${repo.html_url}" target="_blank">${repo.name}</a>
              <p>${repo.description || "No description"}</p>
            `;
            reposGrid.appendChild(card);
          });
        });
    });
});

// also search on Enter key
usernameInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});