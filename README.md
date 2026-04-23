# 📑 Professional Interactive PDF Engine

A robust, high-performance client-side PDF rendering application. This project leverages the **Mozilla PDF.js** library to transform binary document data into high-fidelity vector graphics using the HTML5 Canvas API.

## 🚀 Key Technical Features

* **Asynchronous Rendering Pipeline:** Utilizes a custom-built queue system to prevent UI thread blocking. This ensures that even during complex zoom operations or rapid page turns, the interface remains fluid.
* **Dynamic Vector Scaling:** Unlike standard image-based viewers, this engine re-renders the PDF vectors at every zoom level ($+50\%$ increments), maintaining perfect text clarity regardless of magnification.
* **Browser-Side Privacy:** Employs the `FileReader` API to process files locally. Data never leaves the client’s machine, ensuring maximum security and zero latency.
* **Smart UX State Management:** The interface is context-aware, hiding document controls until a valid PDF is ingested and automatically resetting page states upon new file uploads.

---

## 🛠️ System Architecture

### Frontend Stack
* **Engine:** PDF.js (Mozilla)
* **Language:** Vanilla JavaScript (ES6 Modules)
* **Interface:** HTML5 / CSS3 (Flexbox & Grid)
* **Iconography:** FontAwesome 6.x

### File Structure
- `index.html`: Semantic entry point and canvas mount.
- `main.js`: Core engine logic, worker management, and event delegation.
- `main.css`: "Charcoal & Slate" design system for optimized reading ergonomics.

---

## 🕹️ Controls & Shortcuts

The engine is optimized for both mouse interaction and keyboard productivity.

| Action | Control | Shortcut |
| :--- | :--- | :--- |
| **Previous Page** | Prev Button | `Arrow Left` |
| **Next Page** | Next Button | `Arrow Right` |
| **Zoom In** | Integrated Logic | `+` or `=` |
| **Zoom Out** | Integrated Logic | `-` |
| **Open File** | Custom Upload Input | N/A |

---

## 💻 Implementation Highlights

### The Render Guard Logic
To handle asynchronous data streams, the following logic prevents "Race Conditions" during the painting process:

```javascript
const queueRenerPage = num => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
};
