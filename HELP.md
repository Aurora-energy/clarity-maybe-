# Clarity maybe? - Prioritisation & Clarity Tool

A comprehensive project prioritisation and resource planning tool designed to bring clarity to complex backlogs using multi-dimensional scoring (Criticality, Time, Cost, Knowledge, Integration).

## 🚀 Installation & Setup

### Prerequisites
*   **Node.js** (v18 or later)
*   **npm** or **yarn**

### Quick Start
1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm start
    ```
3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 User Guide

### 1. Core Concepts

*   **Workshops**: Separate workspaces for different products or teams. Select or create one from the top-left dropdown.
*   **Items**: Tasks, risks, or features to be prioritised.
*   **P0-P3 Priority**: Items are automatically classified based on their scores:
    *   **P0 (Red)**: Critical Showstoppers or High Risk/Unknowns.
    *   **P1 (Orange)**: High Criticality.
    *   **P2 (Yellow)**: Medium Criticality / Long Lead Time.
    *   **P3 (Green)**: Low Criticality / Quick Wins / Nice-to-haves.
*   **Axes**: The dimensions used for scoring (Criticality, Time, Knowledge, Integration, Cost).

### 2. Views & Features

#### 📋 Dashboard
The main backlog view.
*   **Grouped Lists**: Items are grouped by their "Master Grouping".
*   **Create Item**: Click "+ New Item" to start a blank item.
*   **Show Completed**: Toggle to view archived/finished items.

#### 📅 Timeline
A Kanban-style view based on the **Time** axis.
*   **Dependencies**:
    1.  Click the **Right (+)** button on a "Source" item.
    2.  Click the **Left (+)** button on a "Target" item.
    3.  The Target is now dependent on the Source.

#### 📊 Gantt Chart
A chronological timeline view.
*   **Scheduling**: Drag and drop items to set their `Start Date`.
*   **Auto-Scheduling**: Moving an item pushes dependent items forward.
*   **Working Days**: Automatically skips weekends.

#### 💰 Resources
Financial and budget tracking.
*   **Swimplanes**: Two bars per item (Quote vs ICL).
*   **Chart**: Burn-up of accumulated costs.

#### 👥 People
Workload and assignment tracking.
*   **Team Load**: Total assigned hours per day.
*   **Assignments**: Individual workload timelines.

#### 🔥 Table / Risk Matrix
*   **Visual Grid**: Plot items by Knowledge vs Integration to identify high-risk clusters.

### 3. Item Details
*   **Metrics**: Sliders for scores (1-4) and numeric inputs (Days, Cost).
*   **Next Actions**: Checklist of sub-tasks with assignees.
*   **Mark as Complete**: Toggle the checkbox in the header.

### 4. Configuration
*   **Workshops**: Create/Rename via the top dropdown.
*   **Dark Mode**: Toggle the ☀️/🌙 icon.
*   **Settings**: Configure Axis names and scale definitions.
