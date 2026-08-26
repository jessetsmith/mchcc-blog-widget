/* MCHCC blog widget — load after blog-data.js */
(function () {
  var DATA_SRC = "https://jessetsmith.github.io/mchcc-blog-widget/blog-data.js";
  var MOUNT_ID = "mchcc-blog-root";

  function ensureMount() {
    var mount = document.getElementById(MOUNT_ID);
    if (!mount) {
      mount = document.createElement("div");
      mount.id = MOUNT_ID;
      document.currentScript && document.currentScript.parentNode
        ? document.currentScript.parentNode.insertBefore(mount, document.currentScript)
        : document.body.appendChild(mount);
    }
    return mount;
  }

  function injectStyles() {
    if (document.getElementById("mchcc-blog-styles")) return;
    var style = document.createElement("style");
    style.id = "mchcc-blog-styles";
    style.textContent = "    :root {\n      --mchcc-blue: #055ca6;\n      --mchcc-blue-mid: #3d92db;\n      --mchcc-blue-deep: #004e90;\n      --mchcc-blue-line: #3c76a7;\n      --mchcc-green: #00a547;\n      --mchcc-green-dark: #097537;\n      --mchcc-green-hover: #0a9445;\n      --mchcc-text: #545454;\n      --mchcc-muted: #818181;\n      --mchcc-bg: #f5f5f5;\n      --mchcc-white: #ffffff;\n      --mchcc-shadow: 0 0 60px 0 rgba(0, 0, 0, 0.06);\n      --font: Calibre, \"DM Sans\", Helvetica, sans-serif;\n      --container: min(1040px, calc(100% - 40px));\n      --space: clamp(40px, 6vw, 80px);\n      --radius: 0;\n      --transition: 0.25s ease;\n    }\n\n    *, *::before, *::after { box-sizing: border-box; }\n\n    #mchcc-blog-root {\n      margin: 0;\n      padding: 0;\n      background: var(--mchcc-bg);\n      color: var(--mchcc-text);\n      font-family: var(--font);\n      font-size: 18px;\n      line-height: 1.45;\n      -webkit-font-smoothing: antialiased;\n    }\n\n    button, input {\n      font: inherit;\n    }\n\n    .mchcc-blog {\n      width: 100%;\n      min-height: 0;\n    }\n\n    .mchcc-blog[hidden] { display: none !important; }\n\n    /* \u2014\u2014 Intro / featured \u2014\u2014 */\n    .blog-intro {\n      position: relative;\n      display: flex;\n      align-items: center;\n      min-height: 360px;\n      padding: var(--space) 0;\n      background: var(--mchcc-blue);\n      color: var(--mchcc-white);\n      overflow: hidden;\n    }\n\n    .blog-intro::before {\n      content: \"\";\n      position: absolute;\n      inset: 0 auto 0 0;\n      width: min(42vw, 480px);\n      background: linear-gradient(135deg, rgba(0, 78, 144, 0.55), transparent 70%);\n      pointer-events: none;\n    }\n\n    .blog-intro__inner {\n      position: relative;\n      z-index: 1;\n      width: var(--container);\n      margin: 0 auto;\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 40px;\n      align-items: center;\n    }\n\n    .blog-intro__lead {\n      color: rgba(255, 255, 255, 0.88);\n      font-size: 1.125rem;\n      font-weight: 500;\n      line-height: 1.35;\n      max-width: 28ch;\n    }\n\n    .blog-intro__title {\n      margin: 18px 0 0;\n      color: var(--mchcc-white);\n      font-size: clamp(1.75rem, 3.5vw, 2.5rem);\n      font-weight: 600;\n      line-height: 1.1;\n    }\n\n    .blog-intro__feat {\n      border-left: 1px solid rgba(61, 146, 219, 0.7);\n      padding-left: 36px;\n      min-height: 160px;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n    }\n\n    .blog-intro__feat-btn {\n      display: block;\n      width: 100%;\n      padding: 0;\n      border: 0;\n      background: transparent;\n      color: inherit;\n      text-align: left;\n      cursor: pointer;\n    }\n\n    .blog-intro__feat-btn:focus-visible {\n      outline: 2px solid #fff;\n      outline-offset: 6px;\n    }\n\n    .blog-date {\n      font-size: 0.9375rem;\n      font-weight: 400;\n      line-height: 1.2;\n      color: rgba(255, 255, 255, 0.85);\n    }\n\n    .blog-intro .blog-date { color: rgba(255, 255, 255, 0.85); }\n\n    .blog-intro__story-title {\n      margin: 10px 0 18px;\n      color: var(--mchcc-white);\n      font-size: clamp(1.35rem, 2.4vw, 1.75rem);\n      font-weight: 600;\n      line-height: 1.2;\n    }\n\n    .arrow-link {\n      display: inline-flex;\n      align-items: center;\n      gap: 6px;\n      color: inherit;\n      font-weight: 500;\n      line-height: 20px;\n      text-decoration: none;\n    }\n\n    .blog-intro .arrow-link { color: var(--mchcc-white); }\n\n    .arrow-link__icon {\n      display: inline-flex;\n      width: 20px;\n      height: 20px;\n      border-radius: 50%;\n      background: var(--mchcc-green);\n      color: #fff;\n      align-items: center;\n      justify-content: center;\n      transition: transform var(--transition);\n      flex-shrink: 0;\n    }\n\n    .arrow-link__icon svg {\n      width: 10px;\n      height: 10px;\n      fill: currentColor;\n    }\n\n    .blog-intro__feat-btn:hover .arrow-link__icon,\n    .post-card:hover .arrow-link__icon,\n    .post-card:focus-visible .arrow-link__icon {\n      transform: translateX(2px);\n    }\n\n    /* \u2014\u2014 Toolbar \u2014\u2014 */\n    .blog-toolbar {\n      width: var(--container);\n      margin: 28px auto 0;\n      display: flex;\n      flex-wrap: wrap;\n      gap: 12px;\n      align-items: center;\n      justify-content: space-between;\n    }\n\n    .blog-search {\n      flex: 1 1 260px;\n      max-width: 420px;\n      display: flex;\n      align-items: stretch;\n      background: var(--mchcc-white);\n      box-shadow: var(--mchcc-shadow);\n      border-top: 3px solid var(--mchcc-green);\n    }\n\n    .blog-search input {\n      flex: 1;\n      border: 0;\n      padding: 14px 16px;\n      color: var(--mchcc-text);\n      background: transparent;\n      outline: none;\n    }\n\n    .blog-search input::placeholder { color: var(--mchcc-muted); }\n\n    .blog-count {\n      color: var(--mchcc-muted);\n      font-size: 0.9375rem;\n    }\n\n    /* \u2014\u2014 Post grid \u2014\u2014 */\n    .blog-posts {\n      width: var(--container);\n      margin: 28px auto var(--space);\n      display: grid;\n      grid-template-columns: repeat(2, 1fr);\n      gap: 24px;\n    }\n\n    .post-card {\n      display: flex;\n      flex-direction: column;\n      align-items: flex-start;\n      gap: 10px;\n      width: 100%;\n      min-height: 180px;\n      padding: 30px;\n      border: 0;\n      border-top: 5px solid var(--mchcc-green);\n      background: var(--mchcc-white);\n      box-shadow: var(--mchcc-shadow);\n      color: inherit;\n      text-align: left;\n      cursor: pointer;\n      transition: transform var(--transition), box-shadow var(--transition);\n    }\n\n    .post-card:hover,\n    .post-card:focus-visible {\n      transform: translateY(-2px);\n      box-shadow: 0 8px 40px rgba(5, 92, 166, 0.12);\n      outline: none;\n    }\n\n    .post-card .blog-date {\n      color: var(--mchcc-green);\n    }\n\n    .post-card__title {\n      margin: 0;\n      color: var(--mchcc-blue);\n      font-size: 1.35rem;\n      font-weight: 600;\n      line-height: 1.25;\n    }\n\n    .post-card__excerpt {\n      margin: 0;\n      color: var(--mchcc-text);\n      font-size: 1rem;\n      line-height: 1.4;\n      display: -webkit-box;\n      -webkit-line-clamp: 3;\n      -webkit-box-orient: vertical;\n      overflow: hidden;\n    }\n\n    .post-card .arrow-link {\n      margin-top: auto;\n      padding-top: 12px;\n      color: var(--mchcc-green);\n    }\n\n    .post-card:hover .arrow-link {\n      color: var(--mchcc-blue);\n    }\n\n    .blog-empty,\n    .blog-error,\n    .blog-loading {\n      width: var(--container);\n      margin: 40px auto;\n      padding: 30px;\n      background: var(--mchcc-white);\n      box-shadow: var(--mchcc-shadow);\n      border-top: 5px solid var(--mchcc-blue-mid);\n      color: var(--mchcc-text);\n    }\n\n    .blog-error { border-top-color: #e85e5e; }\n\n    /* \u2014\u2014 Detail view \u2014\u2014 */\n    .blog-detail {\n      min-height: 100vh;\n      background: var(--mchcc-white);\n    }\n\n    .blog-detail__hero {\n      background: var(--mchcc-blue);\n      color: var(--mchcc-white);\n      padding: clamp(28px, 5vw, 56px) 0;\n    }\n\n    .blog-detail__inner {\n      width: var(--container);\n      margin: 0 auto;\n    }\n\n    .blog-back {\n      display: inline-flex;\n      align-items: center;\n      gap: 8px;\n      margin-bottom: 24px;\n      padding: 0;\n      border: 0;\n      background: transparent;\n      color: rgba(255, 255, 255, 0.9);\n      font-weight: 500;\n      cursor: pointer;\n    }\n\n    .blog-back:hover { color: #fff; }\n\n    .blog-back__icon {\n      display: inline-flex;\n      width: 20px;\n      height: 20px;\n      border-radius: 50%;\n      background: var(--mchcc-green);\n      align-items: center;\n      justify-content: center;\n      transition: transform var(--transition);\n    }\n\n    .blog-back:hover .blog-back__icon { transform: translateX(-2px); }\n\n    .blog-back__icon svg {\n      width: 10px;\n      height: 10px;\n      fill: #fff;\n      transform: rotate(180deg);\n    }\n\n    .blog-detail__meta {\n      display: flex;\n      flex-wrap: wrap;\n      gap: 10px 18px;\n      align-items: center;\n      color: rgba(255, 255, 255, 0.85);\n      font-size: 0.9375rem;\n    }\n\n    .blog-detail__meta .pill {\n      display: inline-block;\n      padding: 4px 12px;\n      background: var(--mchcc-green);\n      color: #fff;\n      font-size: 0.8125rem;\n      font-weight: 500;\n      line-height: 1.4;\n    }\n\n    .blog-detail__title {\n      margin: 14px 0 0;\n      color: #fff;\n      font-size: clamp(1.85rem, 4vw, 2.75rem);\n      font-weight: 600;\n      line-height: 1.15;\n      max-width: 22ch;\n    }\n\n    .blog-detail__cover {\n      display: block;\n      width: 100%;\n      max-height: 420px;\n      object-fit: cover;\n      margin: 28px 0 0;\n    }\n\n    .blog-detail__body {\n      width: var(--container);\n      margin: 0 auto;\n      padding: clamp(32px, 5vw, 64px) 0 var(--space);\n      max-width: 720px;\n    }\n\n    .blog-detail__body p {\n      margin: 0 0 1.1em;\n      color: var(--mchcc-text);\n      font-size: 1.125rem;\n      line-height: 1.55;\n    }\n\n    .blog-detail__body p:last-child { margin-bottom: 0; }\n\n    .blog-detail__external {\n      margin-top: 28px;\n    }\n\n    .blog-detail__external a {\n      color: var(--mchcc-blue);\n      font-weight: 500;\n      text-decoration: none;\n    }\n\n    .blog-detail__external a:hover {\n      color: var(--mchcc-green-hover);\n      text-decoration: underline;\n    }\n\n    @media (max-width: 879px) {\n      .blog-intro__inner {\n        grid-template-columns: 1fr;\n        gap: 28px;\n      }\n\n      .blog-intro__feat {\n        border-left: 0;\n        border-top: 1px solid rgba(61, 146, 219, 0.7);\n        padding-left: 0;\n        padding-top: 28px;\n        min-height: 0;\n      }\n\n      .blog-posts {\n        grid-template-columns: 1fr;\n      }\n    }\n\n    @media (max-width: 579px) {\n      .post-card { padding: 24px; }\n      .blog-intro__lead { max-width: none; }\n    }";
    document.head.appendChild(style);
  }

  function injectMarkup(mount) {
    if (mount.querySelector("#blog-root")) return;
    mount.innerHTML = "<div id=\"blog-root\">\n    <div class=\"mchcc-blog\" id=\"blog-list-view\" aria-live=\"polite\">\n      <section class=\"blog-intro\">\n        <div class=\"blog-intro__inner\">\n          <div class=\"blog-intro__left\">\n            <p class=\"blog-intro__lead\" id=\"blog-lead\">\n              Updates from across the CAPS &amp; Maple City Organization.\n            </p>\n            <h1 class=\"blog-intro__title\">Current News and Stories</h1>\n          </div>\n          <div class=\"blog-intro__feat\" id=\"blog-featured\" hidden></div>\n        </div>\n      </section>\n\n      <div class=\"blog-toolbar\">\n        <label class=\"blog-search\" for=\"blog-search-input\">\n          <span class=\"visually-hidden\" style=\"position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)\">Search posts</span>\n          <input id=\"blog-search-input\" type=\"search\" placeholder=\"Search posts\u2026\" autocomplete=\"off\" />\n        </label>\n        <div class=\"blog-count\" id=\"blog-count\"></div>\n      </div>\n\n      <div class=\"blog-loading\" id=\"blog-loading\">Loading posts\u2026</div>\n      <div class=\"blog-error\" id=\"blog-error\" hidden>\n        <div id=\"blog-error-text\"></div>\n      </div>\n      <div class=\"blog-empty\" id=\"blog-empty\" hidden>No posts match your search.</div>\n      <div class=\"blog-posts\" id=\"blog-posts\" hidden></div>\n    </div>\n\n    <article class=\"blog-detail\" id=\"blog-detail-view\" hidden>\n      <header class=\"blog-detail__hero\">\n        <div class=\"blog-detail__inner\">\n          <button type=\"button\" class=\"blog-back\" id=\"blog-back\">\n            <span class=\"blog-back__icon\" aria-hidden=\"true\">\n              <svg viewBox=\"0 0 10 10\" aria-hidden=\"true\"><path d=\"M3.2 1.2 7.3 5 3.2 8.8\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>\n            </span>\n            Back to posts\n          </button>\n          <div class=\"blog-detail__meta\" id=\"detail-meta\"></div>\n          <h1 class=\"blog-detail__title\" id=\"detail-title\"></h1>\n          <img class=\"blog-detail__cover\" id=\"detail-cover\" alt=\"\" hidden />\n        </div>\n      </header>\n      <div class=\"blog-detail__body\">\n        <div id=\"detail-content\"></div>\n        <p class=\"blog-detail__external\" id=\"detail-external\" hidden></p>\n      </div>\n    </article>\n  </div>";
  }

  function loadDataScript(cb) {
    if (window.MCHCC_BLOG_POSTS != null) {
      cb();
      return;
    }
    var s = document.createElement("script");
    s.src = DATA_SRC;
    s.async = false;
    s.onload = function () { cb(); };
    s.onerror = function () {
      var mount = ensureMount();
      mount.innerHTML = '<div style="padding:24px;border-top:5px solid #e85e5e;background:#fff;color:#545454;font-family:sans-serif;">Could not load blog-data.js from GitHub Pages. If this is on mchcc.org, add <code>https://jessetsmith.github.io</code> to the site CSP <code>script-src</code>.</div>';
    };
    document.head.appendChild(s);
  }

  function startApp() {
      const ARROW_SVG =
        '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M3.2 1.2 7.3 5 3.2 8.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      const els = {
        root: document.getElementById("blog-root"),
        listView: document.getElementById("blog-list-view"),
        detailView: document.getElementById("blog-detail-view"),
        featured: document.getElementById("blog-featured"),
        posts: document.getElementById("blog-posts"),
        loading: document.getElementById("blog-loading"),
        error: document.getElementById("blog-error"),
        errorText: document.getElementById("blog-error-text"),
        empty: document.getElementById("blog-empty"),
        count: document.getElementById("blog-count"),
        search: document.getElementById("blog-search-input"),
        back: document.getElementById("blog-back"),
        detailMeta: document.getElementById("detail-meta"),
        detailTitle: document.getElementById("detail-title"),
        detailCover: document.getElementById("detail-cover"),
        detailContent: document.getElementById("detail-content"),
        detailExternal: document.getElementById("detail-external"),
      };

      let allPosts = [];
      let filtered = [];

      function pick(row, keys) {
        for (const key of keys) {
          if (!isBlank(row[key])) return row[key];
          const found = Object.keys(row).find(
            (k) => k.toLowerCase().replace(/[_\s]/g, "") === key.toLowerCase().replace(/[_\s]/g, "")
          );
          if (found != null && !isBlank(row[found])) return row[found];
        }
        return "";
      }

      function isBlank(value) {
        if (value == null) return true;
        if (typeof value === "number" && Number.isNaN(value)) return true;
        if (typeof value === "string") {
          const s = value.trim();
          return !s || s === "..." || s.toLowerCase() === "nan" || s === "null" || s === "undefined";
        }
        return false;
      }

      function asBool(value) {
        if (typeof value === "boolean") return value;
        const s = String(value || "").trim().toLowerCase();
        return s === "true" || s === "1" || s === "yes";
      }

      function isObjectId(value) {
        return /^[a-f0-9]{24}$/i.test(String(value || "").trim());
      }

      function asArray(value) {
        if (Array.isArray(value)) {
          return value
            .filter((item) => !isBlank(item) && !isObjectId(item))
            .map(String);
        }
        if (isBlank(value)) return [];
        const raw = String(value).trim();
        if (raw.startsWith("[")) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              return parsed
                .map((item) =>
                  typeof item === "object" && item
                    ? item.label || item.name || item.title || ""
                    : String(item)
                )
                .filter((item) => !isBlank(item) && !isObjectId(item));
            }
          } catch (_) { /* fall through */ }
        }
        return raw
          .split(/[,;|]/)
          .map((s) => s.trim())
          .filter((s) => s && !isObjectId(s));
      }

      function resolveImageUrl(value) {
        if (isBlank(value)) return "";
        const raw = String(value).trim();
        if (/^https?:\/\//i.test(raw) || raw.startsWith("/")) return raw;
        // wix:image://v1/{fileId}/...
        const wix = raw.match(/^wix:image:\/\/v1\/([^/#?]+)/i);
        if (wix) return `https://static.wixstatic.com/media/${wix[1]}`;
        return raw;
      }

      function makeExcerpt(excerpt, content) {
        if (!isBlank(excerpt) && String(excerpt).trim() !== "...") {
          return String(excerpt).trim();
        }
        const text = String(content || "").replace(/\s+/g, " ").trim();
        if (!text) return "";
        return text.length > 180 ? `${text.slice(0, 177).trimEnd()}…` : text;
      }

      function normalizePost(row, index) {
        // Primary schema from blog-data.json:
        // id, title, slug, excerpt, content, published, image, featured, category, tags
        const title = String(pick(row, ["title"]) || "Untitled post");
        const publishedRaw = pick(row, ["published", "publishedDate", "Published Date"]);
        const publishedDate = publishedRaw ? new Date(publishedRaw) : null;
        const content = String(pick(row, ["content", "plainContent", "Plain Content"]) || "");
        const excerptRaw = pick(row, ["excerpt"]);
        const excerpt = makeExcerpt(excerptRaw, content);
        const coverImage = resolveImageUrl(pick(row, ["image", "coverImage", "Cover Image"]));
        const slug = String(pick(row, ["slug"]) || "");
        const categoryRaw = pick(row, ["category", "categories"]);
        const categories = asArray(categoryRaw).filter((c) => !isObjectId(c));
        const tags = asArray(pick(row, ["tags"]));
        const featured = asBool(pick(row, ["featured"]));
        const id = String(pick(row, ["id", "_id"]) || slug || `post-${index}`);

        return {
          id,
          title,
          publishedDate: publishedDate && !isNaN(publishedDate) ? publishedDate : null,
          excerpt,
          plain: content,
          rich: "",
          coverImage,
          author: "",
          slug,
          postPageURL: "",
          categories,
          tags,
          timeToRead: null,
          featured,
        };
      }

      function formatDate(date) {
        if (!date) return "";
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      function escapeHtml(str) {
        return String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
      }

      function contentToHtml(post) {
        if (post.rich && /<[a-z][\s\S]*>/i.test(post.rich)) {
          return post.rich;
        }
        const source = post.plain || post.excerpt || "";
        if (!source) return "<p>No content available for this post.</p>";
        return source
          .split(/\n{2,}/)
          .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
          .join("");
      }

      function sortPosts(posts) {
        return posts.slice().sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          const at = a.publishedDate ? a.publishedDate.getTime() : 0;
          const bt = b.publishedDate ? b.publishedDate.getTime() : 0;
          return bt - at;
        });
      }

      function renderFeatured(post) {
        if (!post) {
          els.featured.hidden = true;
          els.featured.innerHTML = "";
          return;
        }
        els.featured.hidden = false;
        els.featured.innerHTML = `
          <button type="button" class="blog-intro__feat-btn" data-post-id="${escapeHtml(post.id)}">
            <div class="blog-date">${escapeHtml(formatDate(post.publishedDate))}</div>
            <h2 class="blog-intro__story-title">${escapeHtml(post.title)}</h2>
            <span class="arrow-link">
              Read More
              <span class="arrow-link__icon">${ARROW_SVG}</span>
            </span>
          </button>
        `;
      }

      function renderCards(posts, featuredId) {
        const cards = posts.filter((p) => p.id !== featuredId);
        els.posts.innerHTML = cards
          .map(
            (post) => `
          <button type="button" class="post-card" data-post-id="${escapeHtml(post.id)}">
            <div class="blog-date">${escapeHtml(formatDate(post.publishedDate))}</div>
            <h3 class="post-card__title">${escapeHtml(post.title)}</h3>
            ${post.excerpt ? `<p class="post-card__excerpt">${escapeHtml(post.excerpt)}</p>` : ""}
            <span class="arrow-link">
              Read More
              <span class="arrow-link__icon">${ARROW_SVG}</span>
            </span>
          </button>
        `
          )
          .join("");
        els.posts.hidden = cards.length === 0;
        els.empty.hidden = posts.length !== 0;
        els.count.textContent =
          posts.length === 1 ? "1 post" : `${posts.length} posts`;
      }

      function applyFilter() {
        const q = (els.search.value || "").trim().toLowerCase();
        filtered = !q
          ? allPosts
          : allPosts.filter((p) => {
              const hay = [
                p.title,
                p.excerpt,
                p.plain,
                p.author,
                p.categories.join(" "),
                p.tags.join(" "),
              ]
                .join(" ")
                .toLowerCase();
              return hay.includes(q);
            });

        const featured = filtered[0] || null;
        renderFeatured(featured);
        renderCards(filtered, featured ? featured.id : null);
      }

      function openPost(id) {
        const post = allPosts.find((p) => p.id === id);
        if (!post) return;

        els.detailTitle.textContent = post.title;
        const metaParts = [];
        if (post.publishedDate) {
          metaParts.push(`<span>${escapeHtml(formatDate(post.publishedDate))}</span>`);
        }
        if (post.author) {
          metaParts.push(`<span>${escapeHtml(post.author)}</span>`);
        }
        if (post.timeToRead) {
          metaParts.push(`<span>${post.timeToRead} min read</span>`);
        }
        post.categories.slice(0, 3).forEach((cat) => {
          metaParts.push(`<span class="pill">${escapeHtml(cat)}</span>`);
        });
        els.detailMeta.innerHTML = metaParts.join("");

        if (post.coverImage) {
          els.detailCover.hidden = false;
          els.detailCover.src = post.coverImage;
          els.detailCover.alt = post.title;
        } else {
          els.detailCover.hidden = true;
          els.detailCover.removeAttribute("src");
        }

        els.detailContent.innerHTML = contentToHtml(post);

        if (post.postPageURL && /^https?:\/\//i.test(post.postPageURL)) {
          els.detailExternal.hidden = false;
          els.detailExternal.innerHTML = `Original post: <a href="${escapeHtml(post.postPageURL)}" target="_blank" rel="noopener noreferrer">${escapeHtml(post.postPageURL)}</a>`;
        } else {
          els.detailExternal.hidden = true;
          els.detailExternal.innerHTML = "";
        }

        els.listView.hidden = true;
        els.detailView.hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
        history.replaceState(null, "", `#${encodeURIComponent(post.slug || post.id)}`);
      }

      function showList() {
        els.detailView.hidden = true;
        els.listView.hidden = false;
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }

      function wireEvents() {
        els.search.addEventListener("input", applyFilter);
        els.back.addEventListener("click", showList);

        els.listView.addEventListener("click", (event) => {
          const btn = event.target.closest("[data-post-id]");
          if (!btn) return;
          openPost(btn.getAttribute("data-post-id"));
        });

        window.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && !els.detailView.hidden) showList();
        });
      }

      function unwrapPosts(data) {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.posts)) return data.posts;
        if (data && Array.isArray(data.data)) return data.data;
        throw new Error("JSON must be an array of posts (or { posts: [...] }).");
      }

      function setPosts(raw) {
        allPosts = sortPosts(raw.map(normalizePost));
        els.loading.hidden = true;
        els.error.hidden = true;
        showList();
        applyFilter();
      }

      function showLoadError(message) {
        els.loading.hidden = true;
        els.posts.hidden = true;
        els.empty.hidden = true;
        els.error.hidden = false;
        els.errorText.textContent = message;
        els.count.textContent = "";
      }

      function getEmbeddedPosts() {
        if (window.MCHCC_BLOG_POSTS == null) return null;
        return unwrapPosts(window.MCHCC_BLOG_POSTS);
      }

      function loadPosts() {
        const embedded = getEmbeddedPosts();
        if (embedded) return embedded;
        throw new Error(
          "No blog posts found. Ensure blog-data.js is loaded (defines window.MCHCC_BLOG_POSTS)."
        );
      }

      function init() {
        wireEvents();

        try {
          const raw = loadPosts();
          setPosts(raw);

          const hash = decodeURIComponent((window.location.hash || "").replace(/^#/, ""));
          if (hash) {
            const match = allPosts.find((p) => p.slug === hash || p.id === hash);
            if (match) openPost(match.id);
          }
        } catch (err) {
          showLoadError(
            err && err.message
              ? err.message
              : "Unable to load blog posts."
          );
          console.error(err);
        }
      }

      init();
  }

  function boot() {
    injectStyles();
    var mount = ensureMount();
    injectMarkup(mount);
    loadDataScript(function () {
      startApp();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
