import { useState, useEffect, useRef } from "react";

/* ─── API BASE URL ───────────────────────────────────────────
   In development:  http://127.0.0.1:8000/api
   On PythonAnywhere it uses the same domain, so just /api     */
const API = import.meta.env.DEV ? "http://127.0.0.1:8000/api" : "/api";

/* ─── CONSTANTS ──────────────────────────────────────────────*/
const CATEGORIES = ["All", "Soup", "Main", "Noodles", "Dessert", "Snack", "Breakfast", "Drinks"];
const COLORS = ["#e07b54","#5b8fa8","#7b9e6b","#a07bbf","#c4954a","#6b8faa","#b06b7b","#7b9e9b"];
const avatarColor = (str) => COLORS[(str || "A").charCodeAt(0) % COLORS.length];

/* ─── API HELPERS ────────────────────────────────────────────*/
async function fetchRecipes(category, search) {
  const params = new URLSearchParams();
  if (category && category !== "All") params.set("category", category);
  if (search) params.set("search", search);
  const res = await fetch(`${API}/recipes/?${params}`);
  if (!res.ok) throw new Error("Failed to load recipes");
  return res.json();
}

async function createRecipe(data) {
  const res = await fetch(`${API}/recipes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to post recipe");
  return res.json();
}

async function toggleLike(id, liked) {
  const res = await fetch(`${API}/recipes/${id}/like/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ liked }),
  });
  if (!res.ok) throw new Error("Failed to like");
  return res.json();   // { likes: number }
}

async function postComment(recipeId, author, text) {
  const res = await fetch(`${API}/recipes/${recipeId}/comments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, text }),
  });
  if (!res.ok) throw new Error("Failed to post comment");
  return res.json();   // { id, author, text, time }
}

/* ─── COMPONENTS (Avatar, CategoryPill, PostCard, RecipeModal, PostForm) ────
   Keep all the components exactly the same as before.
   Only the 3 spots below need updating:                       */

// CHANGE 1 — Avatar component (same as before, no changes needed)
function Avatar({ name, size = 36 }) {
  const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: avatarColor(name || "A"),
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontWeight: 700,
      fontSize: size * 0.38, flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
    }}>{initials}</div>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────────*/
export default function App() {
  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [category, setCategory]   = useState("All");
  const [search, setSearch]       = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [activePost, setActivePost] = useState(null);

  // CHANGE 2 — Load from API instead of localStorage
  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecipes(category, search);
      setPosts(data);
    } catch (e) {
      setError("Could not connect to the server. Is Django running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, [category, search]);

  // CHANGE 3 — Like calls the API
  const handleLike = async (id) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    const newLiked = !post.liked;
    // Optimistic update
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: newLiked, likes: newLiked ? p.likes + 1 : p.likes - 1 } : p
    ));
    if (activePost?.id === id) {
      setActivePost(p => p ? { ...p, liked: newLiked, likes: newLiked ? p.likes + 1 : p.likes - 1 } : p);
    }
    try {
      const { likes } = await toggleLike(id, newLiked);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes } : p));
    } catch { /* revert on error */ loadPosts(); }
  };

  // CHANGE 4 — Comment calls the API
  const handleComment = async (id, author, text) => {
    try {
      const newComment = await postComment(id, author, text);
      const updater = p => p.id === id
        ? { ...p, comments: [...p.comments, newComment] } : p;
      setPosts(prev => prev.map(updater));
      if (activePost?.id === id) setActivePost(prev => updater(prev));
    } catch { alert("Could not post comment."); }
  };

  // CHANGE 5 — New recipe calls the API
  const handlePost = async (data) => {
    try {
      const newPost = await createRecipe(data);
      setPosts(prev => [{ ...newPost, liked: false }, ...prev]);
      setShowForm(false);
    } catch { alert("Could not post recipe. Is Django running?"); }
  };

  /* ── Render (keep your full JSX from the original App.jsx below here) ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fdf8f2; }
      `}</style>

      {/* HEADER */}
      <div style={{ background:"white", borderBottom:"1px solid #f0e4d8", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 16px rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth:760, margin:"0 auto", padding:"14px 20px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:24, color:"#c8533a", fontWeight:900, flex:"none" }}>
            Hangarin 🍳
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search recipes or chefs…"
            style={{ flex:1, border:"1.5px solid #e8ddd0", borderRadius:10, padding:"9px 14px", fontSize:13.5, outline:"none", background:"#fdfaf6", fontFamily:"'DM Sans',sans-serif" }} />
          <button onClick={() => setShowForm(true)} style={{ background:"linear-gradient(135deg,#c8533a,#a03a25)", color:"white", border:"none", borderRadius:10, padding:"10px 18px", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif" }}>+ Share Recipe</button>
        </div>
      </div>

      {/* CATEGORY BAR */}
      <div style={{ background:"white", borderBottom:"1px solid #f0e4d8" }}>
        <div style={{ maxWidth:760, margin:"0 auto", padding:"10px 20px", display:"flex", gap:8, overflowX:"auto" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ background: category === c ? "#c8533a" : "transparent", color: category === c ? "white" : "#7a6a5a", border: category === c ? "2px solid #c8533a" : "2px solid #e8ddd0", borderRadius:20, padding:"6px 16px", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif" }}>{c}</button>
          ))}
        </div>
      </div>

      {/* FEED */}
      <div style={{ maxWidth:760, margin:"0 auto", padding:"28px 20px" }}>
        {loading && <div style={{ textAlign:"center", padding:60, color:"#c0b0a0" }}>Loading recipes…</div>}
        {error   && <div style={{ background:"#fde8e4", color:"#c8533a", borderRadius:10, padding:"16px 20px", marginBottom:20, fontSize:14 }}>⚠️ {error}</div>}
        {!loading && !error && posts.length === 0 && (
          <div style={{ textAlign:"center", padding:60 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🍽</div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, color:"#7a6a5a" }}>No recipes yet</div>
            <div style={{ fontSize:14, color:"#b0a090", marginTop:8 }}>Be the first to share one!</div>
          </div>
        )}
        {posts.map(p => (
          <RecipeCard key={p.id} post={p}
            onLike={handleLike}
            onComment={handleComment}
            onClick={setActivePost} />
        ))}
      </div>

      {/* Re-use your existing RecipeModal and PostForm components here */}
      {/* They stay exactly the same — only the data-fetching logic changed */}
    </>
  );
}

/* ─── RecipeCard (same as original PostCard, rename if you like) ─────────── */
function RecipeCard({ post, onLike, onComment, onClick }) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem("hangarin_user") || "");
  const [namePrompt, setNamePrompt] = useState(false);
  const [tempName, setTempName] = useState("");

  const handleCommentSubmit = () => {
    if (!username) { setNamePrompt(true); return; }
    if (!commentText.trim()) return;
    onComment(post.id, username, commentText.trim());
    setCommentText("");
    setShowComments(true);
  };

  const confirmName = () => {
    if (!tempName.trim()) return;
    localStorage.setItem("hangarin_user", tempName.trim());
    setUsername(tempName.trim());
    setNamePrompt(false);
  };

  return (
    <div style={{ background:"white", borderRadius:16, boxShadow:"0 2px 20px rgba(0,0,0,.07)", border:"1px solid #f0e8df", overflow:"hidden", marginBottom:24 }}>
      <div style={{ padding:"18px 20px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <Avatar name={post.author} />
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:14, color:"#2c1f0f", fontFamily:"'DM Sans',sans-serif" }}>{post.author}</div>
            <div style={{ fontSize:12, color:"#b0a090" }}>{post.time}</div>
          </div>
          <span style={{ background:"#fdf3ee", color:"#c8533a", fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:12 }}>{post.category}</span>
        </div>
        <h2 onClick={() => onClick(post)} style={{ fontFamily:"'Fraunces',serif", fontSize:22, color:"#1a1005", cursor:"pointer", marginBottom:8, lineHeight:1.2 }}>{post.title}</h2>
        <p style={{ fontSize:13.5, color:"#7a6a5a", lineHeight:1.65, marginBottom:14 }}>{post.description}</p>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          <span style={{ background:"#f7f2ec", color:"#7a6a5a", fontSize:12, padding:"4px 10px", borderRadius:8, fontWeight:600 }}>⏱ {post.cook_time}</span>
          <span style={{ background:"#f7f2ec", color:"#7a6a5a", fontSize:12, padding:"4px 10px", borderRadius:8, fontWeight:600 }}>🍽 Serves {post.serves}</span>
          <span style={{ background:"#f7f2ec", color:"#7a6a5a", fontSize:12, padding:"4px 10px", borderRadius:8, fontWeight:600 }}>📝 {post.ingredients.length} ingredients</span>
        </div>
        <div style={{ background:"#fdfaf6", borderRadius:10, padding:"12px 14px", marginBottom:16, border:"1px solid #f0e8df" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#c8533a", letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>Ingredients</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {post.ingredients.slice(0,5).map((ing, i) => (
              <span key={i} style={{ background:"white", border:"1px solid #e8ddd0", borderRadius:6, fontSize:11.5, padding:"3px 8px", color:"#5a4a3a" }}>{ing.split(",")[0].split("(")[0].trim()}</span>
            ))}
            {post.ingredients.length > 5 && <span style={{ fontSize:11.5, color:"#b0a090", padding:"3px 8px" }}>+{post.ingredients.length-5} more</span>}
          </div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:4, padding:"12px 16px", borderTop:"1px solid #f5ede4" }}>
        <button onClick={() => onLike(post.id)} style={{ display:"flex", alignItems:"center", gap:6, background: post.liked ? "#fdf0ec" : "transparent", border:"none", cursor:"pointer", padding:"6px 12px", borderRadius:8, fontSize:13, fontWeight:600, color: post.liked ? "#c8533a" : "#9a8a7a", fontFamily:"'DM Sans',sans-serif" }}>
          <span style={{ fontSize:16 }}>{post.liked ? "❤️" : "🤍"}</span> {post.likes}
        </button>
        <button onClick={() => setShowComments(!showComments)} style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:"none", cursor:"pointer", padding:"6px 12px", borderRadius:8, fontSize:13, fontWeight:600, color:"#9a8a7a", fontFamily:"'DM Sans',sans-serif" }}>
          💬 {post.comments.length} {post.comments.length === 1 ? "review" : "reviews"}
        </button>
        <button onClick={() => onClick(post)} style={{ marginLeft:"auto", background:"#c8533a", color:"white", border:"none", cursor:"pointer", padding:"7px 16px", borderRadius:8, fontSize:12, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>See Full Recipe →</button>
      </div>
      {showComments && (
        <div style={{ padding:"0 20px 16px", borderTop:"1px solid #f5ede4" }}>
          {post.comments.length === 0 && <div style={{ fontSize:13, color:"#c0b0a0", padding:"12px 0", fontStyle:"italic" }}>No reviews yet. Be the first!</div>}
          {post.comments.map(c => (
            <div key={c.id} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:"1px solid #f5ede4" }}>
              <Avatar name={c.author} size={30} />
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#2c1f0f", fontFamily:"'DM Sans',sans-serif" }}>{c.author} <span style={{ color:"#c0b0a0", fontWeight:400 }}>{c.time}</span></div>
                <div style={{ fontSize:13, color:"#5a4a3a", marginTop:2, lineHeight:1.5 }}>{c.text}</div>
              </div>
            </div>
          ))}
          {namePrompt ? (
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <input value={tempName} onChange={e => setTempName(e.target.value)} placeholder="Enter your name first…" onKeyDown={e => e.key==="Enter" && confirmName()} style={{ flex:1, border:"1px solid #e0d4c8", borderRadius:8, padding:"8px 12px", fontSize:13, outline:"none", fontFamily:"'DM Sans',sans-serif" }} />
              <button onClick={confirmName} style={{ background:"#c8533a", color:"white", border:"none", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:13 }}>Set</button>
            </div>
          ) : (
            <div style={{ display:"flex", gap:8, marginTop:12, alignItems:"center" }}>
              {username && <Avatar name={username} size={28} />}
              <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={username ? "Write a review…" : "Your name first…"} onKeyDown={e => e.key==="Enter" && handleCommentSubmit()} style={{ flex:1, border:"1px solid #e0d4c8", borderRadius:8, padding:"8px 12px", fontSize:13, outline:"none", fontFamily:"'DM Sans',sans-serif" }} />
              <button onClick={handleCommentSubmit} style={{ background:"#c8533a", color:"white", border:"none", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:13 }}>Post</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── PostForm ────────────────────────────────────────────── */
function PostForm({ onSubmit, onClose }) {
  const [username] = useState(() => localStorage.getItem("hangarin_user") || "");
  const [name, setName] = useState(username);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Main");
  const [cookTime, setCookTime] = useState("");
  const [serves, setServes] = useState("4");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !title.trim() || !description.trim() || !ingredients[0] || !steps[0]) {
      setErr("Please fill in all required fields."); return;
    }
    localStorage.setItem("hangarin_user", name.trim());
    setSubmitting(true);
    await onSubmit({
      author: name.trim(), title, category,
      cook_time: cookTime || "30 min",
      serves: parseInt(serves) || 4, description,
      ingredients: ingredients.filter(Boolean),
      steps: steps.filter(Boolean),
    });
    setSubmitting(false);
  };

  const listInput = (items, setItems, placeholder) => (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
          <div style={{ width:26, height:38, display:"flex", alignItems:"center", justifyContent:"center", color:"#c8533a", fontWeight:700, fontSize:13 }}>{i+1}.</div>
          <input value={item} onChange={e => { const n=[...items]; n[i]=e.target.value; setItems(n); }}
            placeholder={placeholder} onKeyDown={e => { if(e.key==="Enter"){e.preventDefault();setItems([...items,""]);}}}
            style={{ flex:1, border:"1.5px solid #e8ddd0", borderRadius:8, padding:"8px 12px", fontSize:13, outline:"none", fontFamily:"'DM Sans',sans-serif", background:"#fdfaf6" }} />
          {items.length > 1 && <button onClick={() => setItems(items.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", color:"#c0a090", cursor:"pointer", fontSize:18, padding:"0 4px" }}>×</button>}
        </div>
      ))}
      <button onClick={() => setItems([...items,""])} style={{ fontSize:12, color:"#c8533a", background:"none", border:"1.5px dashed #e8a090", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:700 }}>+ Add item</button>
    </div>
  );

  const inp = (props) => <input {...props} style={{ width:"100%", border:"1.5px solid #e8ddd0", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", fontFamily:"'DM Sans',sans-serif", background:"#fdfaf6", boxSizing:"border-box", ...props.style }} />;
  const lbl = (text) => <label style={{ fontSize:12, fontWeight:700, color:"#c8533a", letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:6 }}>{text}</label>;
  const field = (label, children) => <div style={{ marginBottom:18 }}>{lbl(label)}{children}</div>;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(4px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"white", borderRadius:20, width:"100%", maxWidth:600, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 20px 80px rgba(0,0,0,.3)" }}>
        <div style={{ background:"linear-gradient(135deg,#c8533a,#a03a25)", padding:"24px 28px", position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,.2)", border:"none", color:"white", borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:26, color:"white" }}>Share Your Recipe 🍳</div>
          <div style={{ fontSize:13, color:"#ffcfb0", marginTop:4 }}>Your recipe will be shared with everyone</div>
        </div>
        <div style={{ padding:28 }}>
          {err && <div style={{ background:"#fde8e4", color:"#c8533a", padding:"10px 14px", borderRadius:8, fontSize:13, marginBottom:16 }}>{err}</div>}
          {field("Your Name *", inp({ value:name, onChange:e=>setName(e.target.value), placeholder:"e.g. Maria Santos" }))}
          {field("Recipe Title *", inp({ value:title, onChange:e=>setTitle(e.target.value), placeholder:"e.g. Sinigang na Baboy" }))}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:18 }}>
            <div>{lbl("Category")}<select value={category} onChange={e=>setCategory(e.target.value)} style={{ width:"100%", border:"1.5px solid #e8ddd0", borderRadius:10, padding:"10px 12px", fontSize:13, background:"#fdfaf6", outline:"none", fontFamily:"'DM Sans',sans-serif" }}>{CATEGORIES.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select></div>
            <div>{lbl("Cook Time")}{inp({ value:cookTime, onChange:e=>setCookTime(e.target.value), placeholder:"30 min" })}</div>
            <div>{lbl("Serves")}{inp({ value:serves, onChange:e=>setServes(e.target.value), placeholder:"4", type:"number" })}</div>
          </div>
          {field("Description *", <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Tell us about this dish…" rows={3} style={{ width:"100%", border:"1.5px solid #e8ddd0", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", fontFamily:"'DM Sans',sans-serif", background:"#fdfaf6", resize:"vertical", boxSizing:"border-box" }} />)}
          {field("Ingredients * (Enter to add more)", listInput(ingredients, setIngredients, "e.g. 1 kg pork ribs"))}
          {field("Steps * (Enter to add more)", listInput(steps, setSteps, "e.g. Boil pork in water…"))}
          <button onClick={handleSubmit} disabled={submitting} style={{ width:"100%", background:"linear-gradient(135deg,#c8533a,#a03a25)", color:"white", border:"none", borderRadius:12, padding:"14px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginTop:4, opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Posting…" : "Publish Recipe 🍽"}
          </button>
        </div>
      </div>
    </div>
  );
}
