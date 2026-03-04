
const form = document.getElementById("guestForm");
const messagesDiv = document.getElementById("messages");

async function loadMessages() {
  const res = await fetch("/api/messages");
  const messages = await res.json();

  messagesDiv.innerHTML = messages.map(m => `
    <div class="message">
      <p>${escapeHTML(m.message)}</p>
      <small>
        ${m.name || "Anonymous"} ·
        ${new Date(m.created_at).toLocaleDateString()}
      </small>
    </div>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  // honeypot
  if (data.website) return;

  await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  form.reset();
  loadMessages();
});

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, s =>
    ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[s])
  );
}

loadMessages();