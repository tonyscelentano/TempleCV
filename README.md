<div align="center">

```text
  _______               _      ______      __
 /_  __/__  __ _  ___  / /__  / ___/ | /| / /
  / / / _ \/  ' \/ _ \/ / _ \/ /__ | |/ |/ / 
 /_/  \___/_/_/_/ .__/_/\___/\___/ |__/|__/  
               /_/                           
```

[Download Installer](https://github.com/tonyscelentano/TempleCV/releases)

**Deterministic. Local-First. Sovereign.**  
A high-performance desktop application for forging your career record.

[![Electron](https://img.shields.io/badge/Electron-191970?style=flat-square&logo=Electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

<img width="2560" height="1388" alt="{8630A91C-A027-4AF3-80CA-965847ADA17D}" src="https://github.com/user-attachments/assets/2131977b-4266-4fc2-8b80-ee3cab42c8ba" />

---

## 🏛️ The Philosophy

Most resume builders trap your data in a fragile web app, charge you a monthly subscription, or rely on non-deterministic WYSIWYG editors that break your layout when you press `Enter`. 

**TempleCV** is different. It is built on a strict, Zod-validated data model. Your resume is stored entirely locally in a portable `.resume` package (a ZIP bundle containing your JSON payload and high-res assets). 

What you write is deterministically compiled into pixel-perfect exports. You own the data.

## ✨ Features

- **Strict Data Model:** JSON-driven core. The layout adapts to your data, not the other way around.
- **Portable Packages:** Everything lives inside a single `.resume` file. No cloud, no lock-in.
- **Deterministic Previews:** The iframe preview renders *exactly* what the ATS scanner or human recruiter will see.
- **Design Tokens:** Customize typography, spacing, and brand colors without fighting with a word processor.
- **Multi-Target Export:** Compile directly to Pixel-Perfect PDF, ATS-Optimized PDF, HTML, JSON, or DOCX.
- **Built for Developers:** Drag-and-drop section ordering, clean UI, and dark mode by default.

## 🚀 Quick Start

Ensure you have Node.js installed, then clone the repository:

```powershell
# Install dependencies
npm install --cache .npm-cache

# Run in development mode
npm start

# Build the portable Windows .exe
npm run make
```

## 📦 The `.resume` Format

TempleCV introduces a custom `.resume` format. Under the hood, it's a standard ZIP archive containing:
- `resume.json`: The strongly-typed, version-migrated source of truth.
- `assets/`: A directory containing all locally linked images, logos, and headshots.

This guarantees that if you open your resume on an airplane, a submarine, or 10 years from now, it will look exactly the same.

---
<div align="center">
  <i>"God's Resume is deterministic."</i>
</div>
