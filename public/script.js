const form = document.getElementById("guestForm");
const messagesDiv = document.getElementById("messages");

async function loadMessages() {
  const res = await fetch("/api/messages");
  const messages = await res.json();

  messagesDiv.innerHTML = messages.map(m => `
    <div class="message">
      <p>${m.message}</p>
      <small>
        ${m.name ? m.name : "Anonymous"} · 
        ${new Date(m.created_at).toLocaleString()}
      </small>
    </div>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  form.reset();
  loadMessages();
});

loadMessages();