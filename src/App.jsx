import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";

const AVATARS = [
  { id: "a1", name: "Alex", label: "A", color: "#E8C9A0", seed: "fashion1", description: "5'7\" Petite" },
  { id: "a2", name: "Maya", label: "M", color: "#C68642", seed: "fashion2", description: "5'9\" Athletic" },
  { id: "a3", name: "Jordan", label: "J", color: "#8D5524", seed: "fashion3", description: "5'5\" Curvy" },
  { id: "a4", name: "Sam", label: "S", color: "#FDBCB4", seed: "fashion4", description: "6'0\" Tall" },
];

const CATALOGUE = [
  { id: "top-001", name: "Relaxed Linen Shirt", brand: "Studio M", category: "tops", price: 49.99, sizes: ["XS","S","M","L","XL"], colors: ["white","sand","olive"], fitType: "Relaxed Fit", style: ["casual","minimalist"], seed: "1062", sizeGuide: "True to size. Model is 5'9\" wearing size M.", rating: 4.7, reviews: 142 },
  { id: "top-002", name: "Structured Blazer", brand: "Arche Studio", category: "tops", price: 189.00, sizes: ["XS","S","M","L","XL","XXL"], colors: ["black","camel","navy"], fitType: "Slim Fit", style: ["formal","minimalist","office"], seed: "338", sizeGuide: "Runs slightly small. Size up if between sizes.", rating: 4.9, reviews: 89 },
  { id: "top-003", name: "Ribbed Knit Sweater", brand: "Soft Co.", category: "tops", price: 79.00, sizes: ["XS","S","M","L"], colors: ["cream","grey","rust"], fitType: "Oversized", style: ["casual","streetwear"], seed: "582", sizeGuide: "Intentionally oversized. Size down for a fitted look.", rating: 4.6, reviews: 211 },
  { id: "top-004", name: "Silk Cami Top", brand: "Lumière", category: "tops", price: 95.00, sizes: ["XS","S","M","L","XL"], colors: ["ivory","champagne","blush"], fitType: "True to Size", style: ["formal","minimalist","date-night"], seed: "424", sizeGuide: "True to size. Adjustable straps.", rating: 4.8, reviews: 67 },
  { id: "bottom-001", name: "Wide Leg Trousers", brand: "Studio M", category: "bottoms", price: 110.00, sizes: ["XS","S","M","L","XL","XXL"], colors: ["black","sand","navy"], fitType: "Relaxed Fit", style: ["formal","minimalist","office"], seed: "64", sizeGuide: "High-waisted. True to size.", rating: 4.7, reviews: 198 },
  { id: "bottom-002", name: "Straight Leg Jeans", brand: "Raw Denim Co.", category: "bottoms", price: 135.00, sizes: ["XS","S","M","L","XL"], colors: ["indigo","black","white"], fitType: "Slim Fit", style: ["casual","streetwear","minimalist"], seed: "1025", sizeGuide: "Runs true to size. Model wears size 28.", rating: 4.5, reviews: 324 },
  { id: "bottom-003", name: "Midi Wrap Skirt", brand: "Lumière", category: "bottoms", price: 89.00, sizes: ["XS","S","M","L","XL"], colors: ["terracotta","forest","floral"], fitType: "Relaxed Fit", style: ["boho","casual","date-night"], seed: "839", sizeGuide: "Adjustable wrap. One size fits most XS-L.", rating: 4.6, reviews: 156 },
  { id: "dress-001", name: "Slip Dress", brand: "Lumière", category: "dresses", price: 145.00, sizes: ["XS","S","M","L"], colors: ["black","champagne","rust"], fitType: "True to Size", style: ["formal","date-night","minimalist"], seed: "1035", sizeGuide: "Bias cut — size up if between sizes.", rating: 4.9, reviews: 203 },
  { id: "dress-002", name: "Linen Shirt Dress", brand: "Studio M", category: "dresses", price: 125.00, sizes: ["XS","S","M","L","XL","XXL"], colors: ["white","stripe","sage"], fitType: "Relaxed Fit", style: ["casual","boho","minimalist"], seed: "614", sizeGuide: "Generous fit. Size down for a belted look.", rating: 4.7, reviews: 178 },
  { id: "outer-001", name: "Classic Trench Coat", brand: "Arche Studio", category: "outerwear", price: 295.00, sizes: ["XS","S","M","L","XL","XXL"], colors: ["camel","black","khaki"], fitType: "Relaxed Fit", style: ["formal","minimalist","office"], seed: "219", sizeGuide: "True to size. Fits comfortably over layers.", rating: 4.9, reviews: 412 },
  { id: "outer-002", name: "Oversized Denim Jacket", brand: "Raw Denim Co.", category: "outerwear", price: 159.00, sizes: ["XS","S","M","L","XL"], colors: ["indigo","black","white"], fitType: "Oversized", style: ["casual","streetwear","boho"], seed: "493", sizeGuide: "Very oversized. Size down 1-2 sizes.", rating: 4.5, reviews: 267 },
  { id: "shoe-001", name: "Block Heel Mules", brand: "Paso Studio", category: "shoes", price: 165.00, sizes: ["36","37","38","39","40","41"], colors: ["tan","black","white"], fitType: "True to Size", style: ["formal","date-night","minimalist"], seed: "768", sizeGuide: "True to size.", rating: 4.8, reviews: 134 },
  { id: "shoe-002", name: "Clean Leather Sneaker", brand: "Paso Studio", category: "shoes", price: 119.00, sizes: ["36","37","38","39","40","41","42"], colors: ["white","black","grey"], fitType: "True to Size", style: ["casual","streetwear","minimalist"], seed: "1024", sizeGuide: "True to size. Leather stretches slightly.", rating: 4.6, reviews: 289 },
  { id: "acc-001", name: "Structured Tote Bag", brand: "Carry Studio", category: "accessories", price: 210.00, sizes: ["One Size"], colors: ["tan","black","cream"], fitType: "One Size", style: ["formal","minimalist","office","casual"], seed: "683", sizeGuide: "Fits a 13\" laptop + essentials.", rating: 4.9, reviews: 521 },
  { id: "acc-002", name: "Minimal Gold Necklace", brand: "Orr Jewels", category: "accessories", price: 65.00, sizes: ["One Size"], colors: ["gold","silver"], fitType: "One Size", style: ["formal","minimalist","date-night","casual"], seed: "392", sizeGuide: "45cm chain, adjustable to 40cm.", rating: 4.8, reviews: 387 },
  { id: "acc-003", name: "Canvas Baseball Cap", brand: "Studio M", category: "accessories", price: 45.00, sizes: ["One Size"], colors: ["cream","black","navy"], fitType: "One Size", style: ["casual","streetwear"], seed: "1042", sizeGuide: "Adjustable strap, fits most head sizes.", rating: 4.4, reviews: 93 },
];

const CATEGORIES = ["all","tops","bottoms","dresses","outerwear","shoes","accessories"];
const SIZES = ["XS","S","M","L","XL","XXL"];
const STYLES = ["casual","formal","minimalist","streetwear","boho","date-night","office"];
const VIBES = [
  { id: "minimalist", label: "Minimalist", icon: "◻", items: ["top-002","bottom-001","shoe-002","acc-001"] },
  { id: "boho", label: "Boho", icon: "✿", items: ["top-001","bottom-003","outer-002","acc-002"] },
  { id: "streetwear", label: "Streetwear", icon: "◈", items: ["top-003","bottom-002","shoe-002","acc-003"] },
  { id: "office", label: "Office", icon: "◇", items: ["top-002","bottom-001","outer-001","acc-001"] },
  { id: "date-night", label: "Date Night", icon: "◈", items: ["dress-001","shoe-001","acc-002"] },
];

// Positions each clothing category as an overlay on the avatar (% of container)
const OVERLAY_POS = {
  tops:       { top: "18%", left: "8%",  width: "84%", height: "36%", zIndex: 3 },
  bottoms:    { top: "52%", left: "10%", width: "80%", height: "44%", zIndex: 2 },
  dresses:    { top: "12%", left: "4%",  width: "92%", height: "83%", zIndex: 2 },
  outerwear:  { top: "12%", left: "2%",  width: "96%", height: "56%", zIndex: 4 },
  shoes:      { top: "80%", left: "12%", width: "76%", height: "19%", zIndex: 2 },
  accessories:{ top: "3%",  left: "54%", width: "38%", height: "15%", zIndex: 5 },
};

const ACCENT = "#C17B5A";
const ACCENT_LIGHT = "#F5ECE6";
const ACCENT_DARK = "#9B5E3E";

function getSizeRec(item, measurements) {
  if (!measurements || !measurements.chest) return null;
  const chest = parseInt(measurements.chest);
  if (!chest) return null;
  let rec = "M";
  if (chest < 80) rec = "XS";
  else if (chest < 88) rec = "S";
  else if (chest < 96) rec = "M";
  else if (chest < 104) rec = "L";
  else if (chest < 112) rec = "XL";
  else rec = "XXL";
  const note = item.fitType === "Slim Fit" ? "snug around the chest" : item.fitType === "Oversized" ? "very roomy — consider sizing down" : "comfortable and true";
  return { size: rec, note };
};

export default function VirtualTrialRoom() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState("a1");
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [measurements, setMeasurements] = useState({ height: "", weight: "", chest: "", waist: "", hips: "" });
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [styleFilter, setStyleFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [mobileView, setMobileView] = useState("tryon");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [outfitName, setOutfitName] = useState("");
  const [activeVibe, setActiveVibe] = useState(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const [loadingItem, setLoadingItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const fileInputRef = useRef(null);

  const d = darkMode;
  const bg = d ? "#0E0E0E" : "#FAF9F7";
  const bg2 = d ? "#1A1A1A" : "#FFFFFF";
  const bg3 = d ? "#242424" : "#F5F0EB";
  const txt = d ? "#F0EDE9" : "#1A1A1A";
  const txt2 = d ? "#999" : "#6B6B6B";
  const border = d ? "#333" : "#E8E6E3";

  const filtered = useMemo(() => {
    return CATALOGUE.filter(item => {
      const matchCat = activeCategory === "all" || item.category === activeCategory;
      const matchSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSize = !sizeFilter || item.sizes.includes(sizeFilter);
      const matchStyle = !styleFilter || item.style.includes(styleFilter);
      const matchPrice = item.price <= maxPrice;
      return matchCat && matchSearch && matchSize && matchStyle && matchPrice;
    });
  }, [activeCategory, searchQuery, sizeFilter, styleFilter, maxPrice]);

  const selectedItemData = useMemo(() => selectedItems.map(id => CATALOGUE.find(i => i.id === id)).filter(Boolean), [selectedItems]);
  const selectedAvatar = AVATARS.find(a => a.id === selectedAvatarId);

  const toggleItem = useCallback((item) => {
    if (selectedItems.includes(item.id)) {
      setSelectedItems(prev => prev.filter(id => id !== item.id));
      if (detailItem?.id === item.id) setDetailItem(null);
    } else {
      setLoadingItem(item.id);
      setTimeout(() => {
        setSelectedItems(prev => [...prev, item.id]);
        setDetailItem(item);
        setLoadingItem(null);
      }, 600);
    }
  }, [selectedItems, detailItem]);

  const toggleFavorite = useCallback((id, e) => {
    e.stopPropagation();
    setFavorites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const applyVibe = useCallback((vibe) => {
    setActiveVibe(vibe.id);
    setSelectedItems(vibe.items);
  }, []);

  const surpriseMe = useCallback(() => {
    setActiveVibe(null);
    const random = VIBES[Math.floor(Math.random() * VIBES.length)];
    setSelectedItems(random.items);
  }, []);

  const saveOutfit = useCallback(() => {
    if (!outfitName.trim()) return;
    setSavedOutfits(prev => [...prev, { name: outfitName.trim(), items: [...selectedItems], date: new Date().toLocaleDateString() }]);
    setShowSaveModal(false);
    setOutfitName("");
  }, [outfitName, selectedItems]);

  const shareOutfit = useCallback(() => {
    const data = JSON.stringify({ items: selectedItems, measurements });
    try { navigator.clipboard.writeText(data); } catch {}
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  }, [selectedItems, measurements]);

  const handlePhotoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedPhoto(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  const totalPrice = selectedItemData.reduce((sum, i) => sum + i.price, 0);
  const avatarImg = uploadedPhoto || `https://picsum.photos/seed/${selectedAvatar.seed}/280/450`;

  const s = {
    app: { minHeight: "100vh", background: bg, color: txt, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", transition: "background 0.3s, color 0.3s", display: "flex", flexDirection: "column" },
    header: { background: bg2, borderBottom: `1px solid ${border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
    logo: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, fontWeight: 600, color: ACCENT, letterSpacing: "-0.5px" },
    main: { flex: 1, display: "flex", overflow: "hidden" },
    leftPanel: { width: "60%", borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", overflow: "hidden" },
    rightPanel: { width: "40%", display: "flex", flexDirection: "column", overflow: "hidden" },
    btn: (active) => ({ background: active ? ACCENT : "transparent", color: active ? "#fff" : txt2, border: `1px solid ${active ? ACCENT : border}`, borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }),
    iconBtn: { background: "transparent", border: "none", cursor: "pointer", color: txt2, padding: 8, borderRadius: 8, fontSize: 16, lineHeight: 1 },
    input: { background: bg3, border: `1px solid ${border}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, color: txt, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" },
    card: { background: bg2, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s", position: "relative" },
    pill: (color) => ({ background: color || ACCENT_LIGHT, color: color ? "#fff" : ACCENT, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 500, display: "inline-block" }),
    section: { padding: "16px 20px", borderBottom: `1px solid ${border}` },
  };

  return (
    <div style={s.app}>
      {/* HEADER */}
      <header style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={s.logo}>Atelier</span>
          <span style={{ fontSize: 12, color: txt2, letterSpacing: 2, textTransform: "uppercase" }}>Virtual Room</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {savedOutfits.length > 0 && (
            <span style={{ ...s.pill(), fontSize: 12 }}>{savedOutfits.length} saved</span>
          )}
          <button style={s.iconBtn} onClick={() => setShowMeasurements(true)} title="My Measurements">📏</button>
          <button style={s.iconBtn} onClick={() => setDarkMode(d => !d)} title="Toggle dark mode">
            {darkMode ? "☀" : "◐"}
          </button>
        </div>
      </header>

      {/* MOBILE TAB BAR */}
      <div style={{ display: "flex", borderBottom: `1px solid ${border}`, background: bg2 }}>
        {["tryon","browse"].map(v => (
          <button key={v} onClick={() => setMobileView(v)} style={{ flex: 1, background: "transparent", border: "none", borderBottom: `2px solid ${mobileView === v ? ACCENT : "transparent"}`, color: mobileView === v ? ACCENT : txt2, padding: "10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
            {v === "tryon" ? "👗 Try On" : "🛍 Browse"}
          </button>
        ))}
      </div>

      {/* MAIN PANELS */}
      <div style={{ ...s.main, flexDirection: "row" }}>
        {/* LEFT: FITTING ROOM */}
        <div style={{ ...s.leftPanel, display: mobileView === "tryon" ? "flex" : "none" }}>
          {/* Avatar Selector */}
          <div style={{ ...s.section, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: txt2, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", marginRight: 4 }}>Model</span>
            {AVATARS.map(av => (
              <button key={av.id} onClick={() => { setSelectedAvatarId(av.id); setUploadedPhoto(null); }}
                title={`${av.name} — ${av.description}`}
                style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${selectedAvatarId === av.id && !uploadedPhoto ? ACCENT : border}`, background: av.color, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.3)", transition: "all 0.2s" }}>
                {av.label}
              </button>
            ))}
            <button onClick={() => fileInputRef.current?.click()} style={{ ...s.btn(!!uploadedPhoto), fontSize: 12, gap: 4, display: "flex", alignItems: "center" }}>
              {uploadedPhoto ? "✓ Photo" : "+ Upload"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
          </div>

          {/* Fitting Room Display */}
          <div style={{ flex: 1, display: "flex", gap: 0, overflow: "hidden" }}>
            {/* Avatar + Outfit Layers */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: 20, overflow: "auto" }}>
              <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: `0 4px 40px ${d ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.12)"}`, width: "100%", maxWidth: 240 }}>
                {/* Base model photo */}
                <img src={avatarImg} alt="Model" style={{ width: "100%", aspectRatio: "3/5", objectFit: "cover", display: "block" }} />

                {/* Clothing overlays — each item positioned at its body zone */}
                {selectedItemData.map(item => {
                  const pos = OVERLAY_POS[item.category] || OVERLAY_POS.tops;
                  return (
                    <img
                      key={item.id}
                      src={`https://picsum.photos/seed/${item.seed}/300/400`}
                      alt={item.name}
                      style={{
                        position: "absolute",
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        height: pos.height,
                        zIndex: pos.zIndex,
                        objectFit: "cover",
                        mixBlendMode: "multiply",
                        opacity: 0.82,
                        borderRadius: 4,
                        pointerEvents: "none",
                        transition: "opacity 0.4s ease",
                        animation: "fadeIn 0.4s ease",
                      }}
                    />
                  );
                })}

                {/* Loading shimmer */}
                {loadingItem && (
                  <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "rgba(193,123,90,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${ACCENT}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                  </div>
                )}

                {/* Bottom labels strip */}
                {selectedItemData.length > 0 && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 9, background: "linear-gradient(transparent, rgba(0,0,0,0.65))", padding: "20px 10px 8px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      {selectedItemData.map(item => (
                        <span key={item.id} style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(4px)", color: "#fff", borderRadius: 5, padding: "2px 7px", fontSize: 9 }}>{item.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Outfit Board */}
              {selectedItemData.length > 0 && (
                <div style={{ width: "100%", maxWidth: 280, marginTop: 16 }}>
                  <div style={{ fontSize: 11, color: txt2, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Current Look</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {selectedItemData.map(item => (
                      <div key={item.id} style={{ position: "relative", width: 64, cursor: "pointer" }} onClick={() => setDetailItem(detailItem?.id === item.id ? null : item)}>
                        <img src={`https://picsum.photos/seed/${item.seed}/64/80`} alt={item.name} style={{ width: 64, height: 80, objectFit: "cover", borderRadius: 8, border: `1px solid ${border}` }} />
                        <button onClick={(e) => { e.stopPropagation(); setSelectedItems(prev => prev.filter(id => id !== item.id)); }} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#333", color: "#fff", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>×</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 13, color: txt2 }}>Total: <span style={{ color: ACCENT, fontWeight: 600 }}>£{totalPrice.toFixed(2)}</span></div>
                </div>
              )}

              {selectedItemData.length === 0 && (
                <div style={{ marginTop: 24, textAlign: "center", color: txt2, fontSize: 13 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>👗</div>
                  <div>Browse items and click to try them on</div>
                </div>
              )}
            </div>

            {/* Detail / Size Panel */}
            {detailItem && (
              <div style={{ width: 200, borderLeft: `1px solid ${border}`, background: bg3, overflowY: "auto", padding: 16, flexShrink: 0 }}>
                <img src={`https://picsum.photos/seed/${detailItem.seed}/200/240`} alt={detailItem.name} style={{ width: "100%", borderRadius: 10, objectFit: "cover", marginBottom: 12 }} />
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{detailItem.name}</div>
                <div style={{ fontSize: 11, color: txt2, marginBottom: 8 }}>{detailItem.brand}</div>
                <span style={s.pill()}>{detailItem.fitType}</span>
                <div style={{ marginTop: 12, fontSize: 11, color: txt2, lineHeight: 1.5 }}>{detailItem.sizeGuide}</div>
                {measurements.chest && (() => {
                  const rec = getSizeRec(detailItem, measurements);
                  return rec ? (
                    <div style={{ marginTop: 12, background: ACCENT_LIGHT, borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 11, color: ACCENT_DARK, fontWeight: 600 }}>Recommended: {rec.size}</div>
                      <div style={{ fontSize: 10, color: ACCENT_DARK, marginTop: 3, lineHeight: 1.4 }}>{detailItem.fitType} — may feel {rec.note}</div>
                    </div>
                  ) : null;
                })()}
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: "#F5A623" }}>{"★".repeat(Math.round(detailItem.rating))}</span>
                  <span style={{ fontSize: 11, color: txt2 }}>{detailItem.rating} ({detailItem.reviews})</span>
                </div>
                <div style={{ marginTop: 12, fontSize: 15, fontWeight: 600, color: ACCENT }}>£{detailItem.price.toFixed(2)}</div>
              </div>
            )}
          </div>

          {/* Style Explorer */}
          <div style={{ ...s.section }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: txt2, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}>Style Vibes</span>
              <button onClick={surpriseMe} style={{ ...s.btn(false), background: ACCENT_LIGHT, color: ACCENT, border: "none", fontSize: 12 }}>✦ Surprise Me</button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {VIBES.map(v => (
                <button key={v.id} onClick={() => applyVibe(v)} style={s.btn(activeVibe === v.id)}>{v.icon} {v.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: CLOTHING BROWSER */}
        <div style={{ ...s.rightPanel, display: mobileView === "browse" ? "flex" : "flex" }}>
          {/* Search */}
          <div style={{ ...s.section }}>
            <input style={s.input} placeholder="Search clothes, brands…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          {/* Category Tabs */}
          <div style={{ ...s.section, paddingTop: 8, paddingBottom: 8, overflowX: "auto" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ ...s.btn(activeCategory === cat), whiteSpace: "nowrap", textTransform: "capitalize", fontSize: 12 }}>
                  {cat === "all" ? "All Items" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div style={{ ...s.section, paddingTop: 8, paddingBottom: 8 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)} style={{ ...s.input, width: "auto", padding: "6px 10px", fontSize: 12 }}>
                <option value="">All Sizes</option>
                {SIZES.map(sz => <option key={sz} value={sz}>{sz}</option>)}
              </select>
              <select value={styleFilter} onChange={e => setStyleFilter(e.target.value)} style={{ ...s.input, width: "auto", padding: "6px 10px", fontSize: 12, textTransform: "capitalize" }}>
                <option value="">All Styles</option>
                {STYLES.map(st => <option key={st} value={st} style={{ textTransform: "capitalize" }}>{st}</option>)}
              </select>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: txt2 }}>
                <span>up to</span>
                <input type="range" min={0} max={500} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: 80 }} />
                <span style={{ color: ACCENT, fontWeight: 600, minWidth: 40 }}>£{maxPrice}</span>
              </div>
              {(sizeFilter || styleFilter || maxPrice < 500) && (
                <button onClick={() => { setSizeFilter(""); setStyleFilter(""); setMaxPrice(500); }} style={{ fontSize: 11, color: ACCENT, background: "none", border: "none", cursor: "pointer" }}>Clear</button>
              )}
            </div>
          </div>

          {/* Item Count */}
          <div style={{ padding: "6px 20px", fontSize: 11, color: txt2 }}>
            {filtered.length} items
          </div>

          {/* Clothing Grid */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {filtered.map(item => {
                const isSelected = selectedItems.includes(item.id);
                const isFav = favorites.has(item.id);
                const isLoading = loadingItem === item.id;
                return (
                  <div key={item.id} onClick={() => toggleItem(item)}
                    style={{ ...s.card, outline: isSelected ? `2px solid ${ACCENT}` : "none", transform: isSelected ? "scale(0.98)" : "scale(1)" }}>
                    <div style={{ position: "relative" }}>
                      <img src={`https://picsum.photos/seed/${item.seed}/300/360`} alt={item.name} style={{ width: "100%", aspectRatio: "5/6", objectFit: "cover", display: "block" }} />
                      {isLoading && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(193,123,90,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${ACCENT}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                        </div>
                      )}
                      {isSelected && (
                        <div style={{ position: "absolute", top: 8, left: 8, background: ACCENT, color: "#fff", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>Wearing ✓</div>
                      )}
                      <button onClick={(e) => toggleFavorite(item.id, e)} style={{ position: "absolute", top: 8, right: 8, background: isFav ? ACCENT : "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", color: isFav ? "#fff" : "#999" }}>
                        {isFav ? "♥" : "♡"}
                      </button>
                    </div>
                    <div style={{ padding: "10px 10px 12px" }}>
                      <div style={{ fontSize: 11, color: txt2, marginBottom: 2 }}>{item.brand}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: ACCENT }}>£{item.price.toFixed(2)}</span>
                        <span style={{ ...s.pill(), fontSize: 10 }}>{item.fitType}</span>
                      </div>
                      <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ color: "#F5A623", fontSize: 11 }}>{"★".repeat(Math.round(item.rating))}</span>
                        <span style={{ fontSize: 10, color: txt2 }}>({item.reviews})</span>
                      </div>
                      <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {item.style.slice(0,2).map(st => (
                          <span key={st} style={{ background: bg3, color: txt2, borderRadius: 4, padding: "1px 6px", fontSize: 10, textTransform: "capitalize" }}>{st}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: txt2 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                  <div>No items match your filters</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OUTFIT TRAY */}
      {selectedItemData.length > 0 && (
        <div style={{ background: bg2, borderTop: `1px solid ${border}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: txt2, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>Your Look</span>
          <div style={{ display: "flex", gap: 8, flex: 1, overflowX: "auto" }}>
            {selectedItemData.map(item => (
              <div key={item.id} style={{ position: "relative", flexShrink: 0 }}>
                <img src={`https://picsum.photos/seed/${item.seed}/48/58`} alt={item.name} title={item.name} style={{ width: 48, height: 58, objectFit: "cover", borderRadius: 6, border: `1px solid ${border}` }} />
                <button onClick={() => setSelectedItems(prev => prev.filter(id => id !== item.id))} style={{ position: "absolute", top: -5, right: -5, width: 16, height: 16, borderRadius: "50%", background: "#333", color: "#fff", border: "none", cursor: "pointer", fontSize: 10, lineHeight: "16px", textAlign: "center" }}>×</button>
              </div>
            ))}
          </div>
          <span style={{ color: ACCENT, fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>£{totalPrice.toFixed(2)}</span>
          <button onClick={shareOutfit} style={{ ...s.btn(false), fontSize: 12, whiteSpace: "nowrap" }}>⬆ Share</button>
          <button onClick={() => { setShowSaveModal(true); setOutfitName(""); }} style={{ ...s.btn(false), fontSize: 12, whiteSpace: "nowrap" }}>☆ Save</button>
          <button onClick={() => { setSelectedItems([]); setActiveVibe(null); setDetailItem(null); }} style={{ ...s.btn(false), fontSize: 12, color: txt2, whiteSpace: "nowrap" }}>✕ Clear</button>
        </div>
      )}

      {/* MEASUREMENTS MODAL */}
      {showMeasurements && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }} onClick={() => setShowMeasurements(false)}>
          <div style={{ background: bg2, borderRadius: 16, padding: 28, width: 340, maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 600, marginBottom: 4 }}>My Measurements</div>
            <div style={{ fontSize: 13, color: txt2, marginBottom: 20 }}>We'll use these to recommend your ideal size.</div>
            {[["height","Height (cm)"],["weight","Weight (kg)"],["chest","Chest (cm)"],["waist","Waist (cm)"],["hips","Hips (cm)"]].map(([key, label]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: txt2, display: "block", marginBottom: 4 }}>{label}</label>
                <input type="number" style={s.input} value={measurements[key]} onChange={e => setMeasurements(prev => ({ ...prev, [key]: e.target.value }))} placeholder="Enter value" />
              </div>
            ))}
            <button onClick={() => setShowMeasurements(false)} style={{ width: "100%", background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: 12, fontSize: 15, cursor: "pointer", marginTop: 8, fontFamily: "inherit" }}>Save Measurements</button>
          </div>
        </div>
      )}

      {/* SAVE OUTFIT MODAL */}
      {showSaveModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }} onClick={() => setShowSaveModal(false)}>
          <div style={{ background: bg2, borderRadius: 16, padding: 28, width: 320, maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Save Outfit</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
              {selectedItemData.map(item => (
                <img key={item.id} src={`https://picsum.photos/seed/${item.seed}/56/70`} alt={item.name} style={{ width: 56, height: 70, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
              ))}
            </div>
            <input style={s.input} placeholder="e.g. Summer in Tuscany" value={outfitName} onChange={e => setOutfitName(e.target.value)} onKeyDown={e => e.key === "Enter" && saveOutfit()} />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={() => setShowSaveModal(false)} style={{ flex: 1, background: bg3, color: txt, border: "none", borderRadius: 10, padding: 12, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={saveOutfit} disabled={!outfitName.trim()} style={{ flex: 2, background: outfitName.trim() ? ACCENT : bg3, color: outfitName.trim() ? "#fff" : txt2, border: "none", borderRadius: 10, padding: 12, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Save Outfit</button>
            </div>
            {savedOutfits.length > 0 && (
              <div style={{ marginTop: 20, borderTop: `1px solid ${border}`, paddingTop: 16 }}>
                <div style={{ fontSize: 12, color: txt2, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Saved Outfits</div>
                {savedOutfits.map((outfit, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: `1px solid ${border}` }}>
                    <span>{outfit.name}</span>
                    <span style={{ color: txt2 }}>{outfit.items.length} items</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SHARE TOAST */}
      {showShareToast && (
        <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "#1A1A1A", color: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 13, zIndex: 300, pointerEvents: "none" }}>
          ✓ Outfit data copied to clipboard
        </div>
      )}

      {/* CSS */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 0.82; transform: scale(1); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${border}; border-radius: 4px; }
        input[type=range] { accent-color: ${ACCENT}; }
        select { cursor: pointer; }
        button:hover { opacity: 0.88; }
      `}</style>
    </div>
  );
}
