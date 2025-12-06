"use client";

import { useEffect } from "react";

export default function MagicDisplayV06() {
  useEffect(() => {
    // 👉 ICI tu colles TOUT le JavaScript du v0.6
    //    (= tout ce qui est entre <script> et </script>
    //     dans 2025-11-09_magic-display_v0.6.html)

    // ⚠️ Très important :
    //  - NE COLLE PAS les balises <script>...</script>, seulement le code JS.
    //  - Tu peux le coller tel quel, ça reste du JavaScript valide.
    //
    // Exemple du début (à titre indicatif, ne retape pas à la main) :
    //
    // const size = 380, half = size/2;
    // const prefersReduced = window.matchMedia &&
    //   window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // const state = {
    //   zoom:1, rotX:-20, rotY:24, rotZ:8, floatT:0,
    //   autospin: !prefersReduced,
    //   hasInteracted: false,
    //   active:1, faces:{}, mode:'idle', selected:null,
    //   history:null
    // };
    //
    // ... (tout le reste : snapshot(), defFace(), makeFace(), drawFace(),
    //     tick(), onCanvasClick(), export/import JSON, renderAll(), etc.)
    //
    // Et surtout, à la fin :
    // renderAll(); setActive(1); applyTransform();
    // updateSpinButton(); tick(performance.now()); scheduleNudge();
    //
    // ====== COLLE LE SCRIPT COMPLET ICI ======

  }, []);

  return (
    <div className="wrap magic-display-v06">
      {/* Colonne de gauche : panneau rapide */}
      <div className="card">
        <h1>🎛️ Panneau rapide</h1>
        <p className="small">
          v0.6 ajoute des <b>pictos “+ média”</b> à l’extrémité des segments,
          des <b>raccourcis clavier</b> et une fonction <b>Annuler (1 étape)</b>.
        </p>
        <ul className="small">
          <li>←/→ : angle de l’aiguille (±5° · Maj = ±15°)</li>
          <li>↑/↓ : longueur de l’aiguille (±1%)</li>
          <li>
            <b>Ctrl/Cmd + Z</b> : Annuler
          </li>
        </ul>
        <div className="row">
          <button className="btn small" id="applyAll">
            Copier cette face → toutes
          </button>
          <button className="btn small" id="reset">
            Reset face
          </button>
          <button className="btn small" id="exportBtn">
            Export JSON
          </button>
          <label
            className="small"
            htmlFor="importFile"
            style={{ alignSelf: "center" }}
          >
            Import
          </label>
          <input id="importFile" type="file" accept="application/json" />
        </div>
      </div>

      {/* Centre : cube 3D + overlay */}
      <div className="card cube-viewport" id="viewport">
        <div className="overlay">
          <div className="controls">
            <button id="toggleSpin" className="toggle">
              ⏸︎ Pause rotation
            </button>
            <button id="undoBtn" className="undo">
              ↶ Annuler
            </button>
          </div>
          <div id="toast" className="toast">
            Tu es aux commandes
          </div>
          <div id="nudge" className="hint" style={{ display: "none" }}>
            ▶ Reprendre la démo
          </div>
        </div>
        {/* Le JS v0.6 crée les 6 faces dynamiquement dans #stage */}
        <div id="stage" className="stage" />
      </div>

      {/* Droite : JSON de la face active */}
      <div className="card">
        <h1>📄 Aperçu JSON (face active)</h1>
        <pre
          id="preview"
          className="small"
          style={{
            whiteSpace: "pre-wrap",
            maxHeight: "70vh",
            overflow: "auto",
          }}
        />
      </div>
    </div>
  );
}
