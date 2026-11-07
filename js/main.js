(() => {
  const csvUrl = "data/works.csv";

  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i], next = text[i + 1];
      if (quoted) {
        if (ch === '"' && next === '"') { field += '"'; i++; }
        else if (ch === '"') quoted = false;
        else field += ch;
      } else {
        if (ch === '"') quoted = true;
        else if (ch === ",") { row.push(field); field = ""; }
        else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
        else if (ch !== "\r") field += ch;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    const headers = rows.shift() || [];
    return rows.filter(r => r.some(v => v.trim() !== "")).map(r =>
      Object.fromEntries(headers.map((h, i) => [h.trim(), (r[i] || "").trim()]))
    );
  }

  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));

  async function showWorks() {
    const params = new URLSearchParams(location.search);
    const era = params.get("era") || "";
    const title = document.getElementById("period-title");
    const subtitle = document.getElementById("period-subtitle");
    const status = document.getElementById("works-status");
    const list = document.getElementById("works-list");

    if (!era) {
      title.textContent = "時代が選択されていません";
      subtitle.textContent = "時代選択ページから見たい時代を選んでください。";
      status.innerHTML = '<a href="eras.html">時代選択ページへ</a>';
      return;
    }

    title.textContent = era;
    subtitle.textContent = "画像を選ぶと、拡大して見ることができます。";

    try {
      const response = await fetch(csvUrl);
      if (!response.ok) throw new Error("CSVを読み込めませんでした");
      const text = await response.text();
      const works = parseCSV(text).filter(item => item.era === era);

      if (!works.length) {
        status.textContent = "この時代の作品はまだ登録されていません。";
        return;
      }

      status.textContent = `${works.length}点の作品`;
      list.innerHTML = works.map(item => `
        <article class="work-card">
          <button class="work-card__image-button" type="button"
            data-image="images/${escapeHTML(item.image)}"
            data-alt="${escapeHTML(item.title)}"
            data-caption="${escapeHTML(item.year)}｜${escapeHTML(item.title)}">
            <img class="work-card__image" src="images/${escapeHTML(item.image)}"
              alt="${escapeHTML(item.title)}" loading="lazy">
            <span class="image-hint">画像を拡大</span>
          </button>
          <div class="work-card__body">
            <p class="work-card__year">${escapeHTML(item.year)}</p>
            <h2>${escapeHTML(item.title)}</h2>
            <p>${escapeHTML(item.description_1)}</p>
            ${item.description_2 ? `<p class="work-card__detail">${escapeHTML(item.description_2)}</p>` : ""}
          </div>
        </article>
      `).join("");

      list.querySelectorAll(".work-card__image-button").forEach(button => {
        button.addEventListener("click", () => {
          const dialog = document.getElementById("image-dialog");
          const image = document.getElementById("lightbox-image");
          image.src = button.dataset.image;
          image.alt = button.dataset.alt;
          document.getElementById("lightbox-caption").textContent = button.dataset.caption;
          if (typeof dialog.showModal === "function") dialog.showModal();
          else window.open(button.dataset.image, "_blank");
        });
      });
    } catch (error) {
      status.textContent = "作品データを読み込めませんでした。ファイル一式を同じフォルダ構成で配置してください。";
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", showWorks);
})();
